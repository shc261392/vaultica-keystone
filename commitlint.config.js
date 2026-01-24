module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation changes
        "style", // Code style changes (formatting, no logic change)
        "refactor", // Code refactoring
        "perf", // Performance improvements
        "test", // Adding or updating tests
        "build", // Build system or dependencies
        "ci", // CI/CD changes
        "chore", // Other changes (tooling, etc.)
        "revert", // Revert a previous commit
      ],
    ],
    "scope-enum": [
      2,
      "always",
      [
        "tokens", // Design tokens
        "preview", // Preview app
        "scripts", // Build scripts
        "docs", // Documentation
        "ci", // CI/CD
        "deps", // Dependencies
        "config", // Configuration files
      ],
    ],
    "subject-case": [2, "always", "sentence-case"],
    "header-max-length": [2, "always", 100],
  },
};
