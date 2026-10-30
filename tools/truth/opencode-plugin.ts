// TRUTH_VERSION: 1.0.0  (canonical: vaultica-keystone/tools/truth/opencode-plugin.ts)
// OpenCode v2 server plugin -> install as .opencode/plugins/truth.ts via tools/truth/sync.sh.
// Keeps docs/truth/* in sync with code. OpenCode cannot block a turn from ending, so on idle
// this re-prompts the agent (max 2 attempts per identical stale set). Every handler fails OPEN.
// Set TRUTH_PLUGIN_DEBUG=1 to log observed events to .agent_workspace/truth-plugin.log.
import { execFileSync } from "node:child_process"
import { appendFileSync, mkdirSync } from "node:fs"
import path from "node:path"

const LOCK = "truth.lock.json"
const MAX_RETRIES = 2
const EDIT_TOOLS = /^(edit|write|multiedit|patch|apply_patch)$/i

type Any = any

export default {
  id: "vaultica.truth",
  async setup(ctx: Any) {
    const dir: string = ctx?.location?.directory ?? process.cwd()
    const debug = process.env.TRUTH_PLUGIN_DEBUG === "1"
    const log = (...a: unknown[]) => {
      if (!debug) return
      try {
        mkdirSync(path.join(dir, ".agent_workspace"), { recursive: true })
        const line = a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" ")
        appendFileSync(path.join(dir, ".agent_workspace/truth-plugin.log"), `${new Date().toISOString()} ${line}\n`)
      } catch {}
    }
    const check = (): Any => {
      try {
        const out = execFileSync("node", ["scripts/truth.mjs", "check", "--dirty", "--json"], {
          cwd: dir,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        })
        return JSON.parse(out)
      } catch (e: Any) {
        // exit 1 still prints JSON on stdout
        try {
          return JSON.parse(e?.stdout ?? "")
        } catch {
          return null
        }
      }
    }
    const blocking = (r: Any): Any[] => (r?.stale ?? []).filter((s: Any) => s.severity === "block")
    const message = (stale: Any[]) =>
      `Truth docs are out of date. Resolve before finishing:\n${stale
        .map(
          (s) =>
            `STALE ${s.doc}: changed ${s.changed.map((c: Any) => c.path).join(", ")}` +
            `${s.sections?.length ? ` (sections: ${s.sections.join(", ")})` : ""}. ` +
            `Edit the doc to match the code, then run: ${s.fix}`,
        )
        .join("\n")}`
    const sidOf = (e: Any): string | undefined =>
      e?.sessionID ?? e?.data?.sessionID ?? e?.properties?.sessionID ?? e?.session?.id

    const regs: Any[] = []
    const safe = async (name: string, fn: () => Promise<void> | void) => {
      try {
        await fn()
      } catch (e: Any) {
        log("error", name, String(e?.message ?? e))
      }
    }

    // 1. Nudge after edits so the agent sees the stale doc immediately.
    await safe("tool.hook", async () => {
      regs.push(
        await ctx.tool.hook("execute.after", async (event: Any) => {
          await safe("execute.after", async () => {
            log("execute.after", { keys: Object.keys(event ?? {}), tool: event?.tool, status: event?.status })
            if (!EDIT_TOOLS.test(String(event?.tool ?? ""))) return
            const sid = sidOf(event)
            if (!sid) return
            // Observed on OpenCode 2.1.4: ctx.session.instructions is undefined, so this nudge is
            // a no-op there; the end-of-turn re-prompt below is the real enforcement.
            const entry = ctx?.session?.instructions?.entry
            if (!entry) return
            const stale = blocking(check())
            if (stale.length) await entry.put({ sessionID: sid, key: "truth-docs", value: message(stale) })
            else await entry.remove({ sessionID: sid, key: "truth-docs" })
          })
        }),
      )
    })

    // 2. Protect the tool-owned lock file and --no-verify commits.
    await safe("permission.hook", async () => {
      regs.push(
        await ctx.permission.hook("evaluate", (event: Any) => {
          void safe("evaluate", () => {
            log("evaluate", { action: event?.action, resources: event?.resources })
            const res: string[] = (event?.resources ?? []).map(String)
            const lockEdit = event?.action !== "read" && res.some((r) => r.endsWith(LOCK))
            const noVerify =
              event?.action === "shell" &&
              res.some((r) => /\bgit\s+commit\b/.test(r) && /(--no-verify|\s-[a-zA-Z]*n[a-zA-Z]*(\s|$))/.test(r.replace(/"[^"]*"|'[^']*'/g, '""')))
            if (lockEdit) {
              event.effect = "deny"
              event.message = `docs/truth/${LOCK} is tool-owned. Use: pnpm truth stamp <doc> --reason "..."`
            } else if (noVerify) {
              event.effect = "deny"
              event.message = "git commit --no-verify is not allowed (skips the truth-docs pre-commit hook)."
            }
          })
        }),
      )
    })

    // 3. On idle, re-prompt (cap: MAX_RETRIES per identical stale set).
    const attempts = new Map<string, { fp: string; n: number }>()
    const controller = new AbortController()
    await safe("event.subscribe", () => {
      void (async () => {
        try {
          for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
            await safe("event", async () => {
              const t = String(event?.type ?? "")
              if (debug) log("event", { type: t, keys: Object.keys(event ?? {}), sample: JSON.stringify(event).slice(0, 400) })
              // Observed end-of-turn event on OpenCode 2.1.4: session.execution.succeeded (data.sessionID).
              const idle = t === "session.execution.succeeded" || t === "session.idle"
              if (!idle) return
              const sid = sidOf(event)
              if (!sid) return
              const stale = blocking(check())
              if (!stale.length) {
                attempts.delete(sid)
                return
              }
              const fp = JSON.stringify(stale.map((s) => [s.doc, s.changed.map((c: Any) => `${c.path}:${c.status}`)]))
              const prev = attempts.get(sid)
              const n = prev && prev.fp === fp ? prev.n + 1 : 1
              attempts.set(sid, { fp, n })
              if (n > MAX_RETRIES) {
                log("retry cap reached", sid)
                return
              }
              await ctx.session.prompt({ sessionID: sid, text: message(stale) })
            })
          }
        } catch (e: Any) {
          log("event loop ended", String(e?.message ?? e))
        }
      })()
    })

    log("loaded", { dir, version: ctx?.app?.version })
    return () => {
      controller.abort()
      for (const r of regs) void Promise.resolve(r?.dispose?.()).catch(() => {})
    }
  },
}
