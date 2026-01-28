/**
 * Vaultica Tailwind Configuration
 * Generated: 2026-01-28T07:32:43.231Z
 * 
 * Usage: Import in your tailwind.config.js
 * 
 * const vaulticaTheme = require('./path/to/tailwind.config.js');
 * module.exports = {
 *   ...vaulticaTheme,
 *   // your overrides
 * };
 */

module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "vault": {
          "surface": {
            "primary": "var(--color-semantic-vault-surface-primary)",
            "secondary": "var(--color-semantic-vault-surface-secondary)",
            "tertiary": "var(--color-semantic-vault-surface-tertiary)"
          },
          "border": {
            "DEFAULT": "var(--color-semantic-vault-border-default)",
            "strong": "var(--color-semantic-vault-border-strong)",
            "subtle": "var(--color-semantic-vault-border-subtle)",
            "focus": "var(--color-semantic-vault-border-focus)"
          },
          "text": {
            "primary": "var(--color-semantic-vault-text-primary)",
            "secondary": "var(--color-semantic-vault-text-secondary)",
            "tertiary": "var(--color-semantic-vault-text-tertiary)",
            "accent": "var(--color-semantic-vault-text-accent)"
          },
          "accent": {
            "DEFAULT": "var(--color-semantic-vault-accent-default)",
            "hover": "var(--color-semantic-vault-accent-hover)",
            "active": "var(--color-semantic-vault-accent-active)",
            "subtle": "var(--color-semantic-vault-accent-subtle)"
          },
          "status": {
            "success": "var(--color-semantic-vault-status-success)",
            "warning": "var(--color-semantic-vault-status-warning)",
            "critical": "var(--color-semantic-vault-status-critical)"
          }
        }
      },
      "fontFamily": {
        "primary": [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ],
        "mono": [
          "JetBrains Mono",
          "SF Mono",
          "Fira Code",
          "Consolas",
          "monospace"
        ]
      },
      "borderWidth": {
        "DEFAULT": "2px",
        "thick": "3px",
        "heavy": "4px"
      },
      "borderRadius": {
        "sm": "0.25rem",
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem"
      },
      "boxShadow": {
        "glow-accent": "0 0 20px oklch(55% 0.2 265 / 0.3)",
        "glow-success": "0 0 20px oklch(60% 0.15 155 / 0.3)",
        "glow-critical": "0 0 20px oklch(55% 0.2 25 / 0.3)"
      },
      "transitionDuration": {
        "fast": "100ms",
        "normal": "200ms",
        "slow": "300ms"
      }
    }
  }
};
