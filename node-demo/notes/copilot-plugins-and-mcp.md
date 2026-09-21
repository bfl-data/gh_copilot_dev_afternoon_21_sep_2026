# GitHub Copilot :  Plugins & MCP Servers

> **Documentation checked:** 21 September 2026
> **Volatility: high.** The plugin catalogue grows weekly. Treat the named
> examples as illustrative, not exhaustive :  browse the live marketplace instead
> of working from this list.

---

## Two Ways to Extend Copilot

| Mechanism | Purpose | Configuration |
|---|---|---|
| Plugins | Package reusable agent customisations, including skills and potentially MCP configurations, agents, and hooks | Client-specific installation; Copilot CLI supports `copilot plugin install` |
| MCP servers | Expose external capabilities, data, and context through a standard protocol | Configuration and authentication depend on the host and server |

These mechanisms overlap: a plugin can package an MCP connection. MCP servers can perform actions as well as retrieve information.

Legacy GitHub App based Copilot Extensions are outside this guide's supported setup path. The previous assertion that they still work was not substantiated in this review. Built-in participants such as `@github` are a separate concept.

Source: [GitHub plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins) and [MCP](https://docs.github.com/en/copilot/concepts/context/mcp).

---

## Part 1 :  Plugins

### The marketplaces

Copilot CLI ships with **two marketplaces registered by default**. No setup:

| Marketplace | Contents |
|---|---|
| `copilot-plugins` | Official GitHub Copilot plugins |
| `awesome-copilot` | Community-contributed, curated in `github/awesome-copilot` |

Browse the current marketplace; counts and community statistics are deliberately omitted because they are not stable configuration requirements.

### Commands

```bash
copilot plugin install <name>@awesome-copilot   # install
copilot plugin list                             # what you have
copilot plugin update <name>                    # update one
copilot plugin uninstall <name>                 # remove
```

Inside an interactive session:

```
/plugin marketplace browse awesome-copilot
```

To register a marketplace that is not built in (your own, or a third party):

```bash
copilot plugin marketplace add <owner>/<repo>
```

### Plugin versions and contents

Use `copilot plugin update <name>` to update deliberately. Check the installed CLI version's update behaviour before relying on automatic updates; no universal session-start guarantee is made here.

A `plugin.json` manifest is required. Current GitHub documentation distinguishes **Agent Plugins 1.0** and **legacy Copilot plugins**. Their discovery paths differ. Do not package ordinary repository folders and assume every client will load them.

| Format | Important locations |
|---|---|
| Agent Plugins 1.0 | Root `plugin.json` declaring the Agent Plugins schema; `skills/`; root `mcp.json`; Copilot-specific components in `com.github.copilot/` |
| Legacy Copilot | Manifest without the Agent Plugins schema; component paths such as `agents/`, `skills/`, `hooks.json`, and `.mcp.json` according to the manifest and CLI reference |

See [official format documentation](https://docs.github.com/en/copilot/concepts/agents/about-plugins) before authoring a package.

### Finding a plugin for a task

Browse `awesome-copilot` and inspect the actual manifest and source before installation. The previous static list and per-plugin item counts have been replaced with a discovery workflow because they were not independently verified.

| Need | What to inspect in a candidate |
|---|---|
| Language/framework work | Supported versions, coding conventions, test instructions |
| Cloud and operations | Credentials, infrastructure write permissions, environment assumptions |
| Migration | Supported source/target versions, rollback plan, verification steps |
| Testing and security | Actual checks performed and limitations |
| Planning and documentation | Output format, repository assumptions, required tools |
| Multi-agent work | Delegation rules, tool access, context transfer, measured usage |
| MCP development | Protocol version, SDK compatibility, runnable examples |

GitHub's installation guide uses this concrete example:

```bash
copilot plugin install database-data-management@awesome-copilot
```

Installing a plugin does not guarantee correct output or suitability for a production task. See [official installation commands](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing).

---

## Part 2 :  MCP Servers

### Start with GitHub

Setup depends on the client:

| Surface | GitHub MCP setup |
|---|---|
| Copilot CLI | Built in; additional manual configuration is not normally required |
| Copilot cloud agent / code review | GitHub MCP and Playwright MCP are configured by default |
| VS Code | Connect/authenticate through the supported MCP setup workflow if not already configured |

The `@github` participant and repository search tools are distinct from configuring an MCP server. Available tools depend on enabled toolsets and account permissions.

For a manual VS Code workspace setup, this belongs in `.vscode/mcp.json`:

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

Start the configured server and follow VS Code's authentication prompt. The remote OAuth setup avoids storing a PAT in this file. UI labels can vary by version.

Where your organisation permits a local deployment, the Docker variant uses a PAT. It still needs permitted GitHub network access and is not a workaround for organisational restrictions. Docker must be installed and running:

```json
{
  "inputs": [
    {
      "id": "github-pat",
      "type": "promptString",
      "description": "GitHub PAT with only the required repository permissions",
      "password": true
    }
  ],
  "servers": {
    "github": {
      "type": "stdio",
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
               "ghcr.io/github/github-mcp-server"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github-pat}" }
    }
  }
}
```

Prefer OAuth. A PAT is one more credential to rotate, scope, and keep out of
version control.

### Choosing additional servers

Start with a specific task and check the provider's current server documentation. GitHub's [MCP Registry](https://github.com/mcp) is a discovery starting point, not a guarantee of suitability.

Context7 can supply library documentation. Its official setup recommends an API key for higher limits and supports an authenticated setup flow. It can improve grounding, but does not guarantee correct API usage. See the [official Context7 repository](https://github.com/upstash/context7).

Browser automation, design access, error tracking, databases, and search require different permissions. Prefer each vendor's maintained implementation and read its authentication and data-access requirements.

### Where config lives

| Surface | Location |
|---|---|
| VS Code :  workspace | `.vscode/mcp.json` (committed, team-wide) |
| VS Code :  user | `mcp.json` in the profile (*MCP: Open User Configuration*) |
| VS Code :  remote | *MCP: Open Remote User Configuration* |
| Copilot CLI | `~/.copilot/mcp-config.json` |
| Copilot cloud agent / code review | Repository MCP settings on GitHub.com; plugin-based customisation has separate configuration |
| Dev containers | `devcontainer.json` → `customizations.vscode.mcp` |

For the VS Code workspace example above, use `.vscode/mcp.json`. User, remote, CLI, and plugin settings have different scopes and discovery rules. Do not copy one client's schema into another.

### Database server selection

The old example using `@modelcontextprotocol/server-postgres` has been removed: that reference implementation is [archived and no longer maintained](https://github.com/modelcontextprotocol/servers-archived).

Choose a maintained server compatible with your database and security requirements. Follow its documented command and argument schema. For training, use a disposable database or a restricted read-only account. Input prompts keep credentials out of committed JSON, but do not themselves restrict database permissions.

### Configuration check before a demo

1. Confirm the correct client and config location.
2. Check required local dependencies and permitted network endpoints.
3. Start the server and complete authentication.
4. Inspect the actual tools exposed and enable only what is needed.
5. Run a harmless read against demo data before teaching a write operation.

The JSON examples are documentation-aligned and syntax-checked, but were not run against a signed-in Copilot session during this revision.

---

## Security :  Read Before Installing Anything

This applies to both plugins and MCP servers, and it is the part to raise with
your platform team *before* rollout rather than after.

**A plugin can contain hooks, and hooks execute shell commands with your
privileges.** A malicious or merely careless plugin runs as you.

**A local MCP server runs a process; a remote server receives requests over the network.** Review local filesystem access, outgoing data, and credential scopes according to the deployment type.

Practical rules:

1. **Treat both like npm dependencies.** Review before installing. Prefer
   official and vendor-maintained sources.
2. **Read what an MCP server exposes.** A server offering `read_query` is a very
   different risk from one offering `execute_sql`. The tool list is visible
   before you approve it :  read it.
3. **Never point a write-capable server at production.** Dev database or read
   replica. This is not a hypothetical failure mode.
4. **Scope credentials to the minimum.** A read-only database user costs nothing
   to create and eliminates a whole class of accident.
5. **Review updates.** Check version changes, manifests, and new tools before adopting an update. Confirm automatic-update behaviour in the installed client.
6. **Check administrator controls.** MCP enablement and any supported registry restrictions depend on the plan and client. An enable/disable policy is not automatically a per-server allowlist.
7. **Test hooks as one control layer.** Blocking depends on hook support, event matching, and decision output. Combine hooks with restricted credentials, approvals, and isolation. See `copilot-tools-reference.md`.

---

## Where to Browse

- [GitHub community customisations](https://github.com/github/awesome-copilot)
- [GitHub MCP Registry](https://github.com/mcp)
- CLI: `copilot plugin marketplace browse awesome-copilot`
- CLI: `copilot plugin marketplace list`

### Suggested starting sequence

Write focused repository instructions, check whether GitHub MCP is already available, and add a plugin or server only for a demonstrated need. Keep the first training environment small enough to inspect and explain.


## Official sources

- [Plugin formats](https://docs.github.com/en/copilot/concepts/agents/about-plugins)
- [Plugin installation](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing)
- [MCP across Copilot clients](https://docs.github.com/en/copilot/concepts/context/mcp)
- [VS Code MCP configuration](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
- [GitHub MCP server](https://github.com/github/github-mcp-server)
- [VS Code hooks](https://code.visualstudio.com/docs/agent-customization/hooks)
