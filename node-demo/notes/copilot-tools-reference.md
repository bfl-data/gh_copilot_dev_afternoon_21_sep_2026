# GitHub Copilot :  Agent Tools Reference

> **Client compatibility:** Current VS Code documentation says `.prompt.md` files are not loaded by Agent Host sessions; they remain supported by the Local agent for now. For Agent Host, migrate reusable prompts to agent skills. Prompt-file examples in this guide apply to the Local agent. [Official prompt-file documentation](https://code.visualstudio.com/docs/agent-customization/prompt-files).

> **Source:** VS Code Copilot feature reference
> **Documentation checked:** 21 September 2026
> **Why this matters:** these are the exact strings used in the `tools:`
> frontmatter of `.agent.md` and `.prompt.md` files. Unavailable tool references can be ignored.
> Inspect the effective tool selection before relying on restrictions.

---

## How Tools Are Organised

Copilot groups tools into **tool sets**. Each set contains individual tools.

You can grant either granularity:

```yaml
tools: ['search', 'read']                    # two whole sets
tools: ['search', 'read', 'edit/editFiles']  # two sets + one single tool
```

Referenced in chat with a `#` prefix (`#search/codebase`, `#selection`); written in
frontmatter without it.

**Granting a set grants everything in it.** `execute` includes running arbitrary
terminal commands. If you only want one capability from a set, name the single
tool :  `execute/runInTerminal` rather than `execute`.

---

## Tool Sets

| Set | Grants | Risk |
|---|---|---|
| `search` | Search files in the workspace | Read-only |
| `read` | Read files in the workspace | Read-only |
| `edit` | Modify the workspace | **Writes files** |
| `execute` | Execute code and applications | **Runs commands** |
| `web` | Access web content | Network egress |
| `browser` | Interact with integrated browser pages | Network egress |
| `agent` | Delegate tasks to other agents | Review the delegated agent's effective tools and permissions |
| `vscode` | VS Code functionality and extensions | Can change your editor |

---

## Individual Tools

### `search` :  finding things

| Tool | Does |
|---|---|
| `search/codebase` | Semantic search across the workspace |
| `search/textSearch` | Literal text search |
| `search/fileSearch` | Find files by name or path pattern |
| `search/listDirectory` | List a directory's contents |
| `search/usages` | Find references to a symbol |
| `search/changes` | The current source control diff |

### `read` :  reading things

| Tool | Does |
|---|---|
| `read/readFile` | Read a file's contents |
| `read/problems` | Read diagnostics :  errors and warnings |
| `read/terminalLastCommand` | The last terminal command and its output |
| `read/terminalSelection` | The current terminal selection |
| `read/getNotebookSummary` | Summarise a notebook's structure |
| `read/readNotebookCellOutput` | Read a notebook cell's output |

### `edit` :  writing things

| Tool | Does |
|---|---|
| `edit/editFiles` | Modify existing files |
| `edit/createFile` | Create a new file |
| `edit/createDirectory` | Create a directory |
| `edit/editNotebook` | Modify notebook cells |

### `execute` :  running things

| Tool | Does |
|---|---|
| `execute/runInTerminal` | Run a shell command |
| `execute/getTerminalOutput` | Read output from a running command |
| `execute/createAndRunTask` | Create and run a VS Code task |
| `execute/runNotebookCell` | Execute a notebook cell |
| `execute/testFailure` | Inspect test failure details |

### `web`, `vscode`, and others

| Tool | Does |
|---|---|
| `web/fetch` | Fetch content from a URL |
| `vscode/runCommand` | Run a VS Code command |
| `vscode/askQuestions` | Ask the user a clarifying question |
| `vscode/extensions` | Query installed extensions |
| `vscode/installExtension` | Install an extension |
| `agent/runSubagent` | Delegate a task to an isolated subagent context |
| `vscode/getProjectSetupInfo` | Obtain project scaffolding guidance |
| `vscode/VSCodeAPI` | Query the VS Code extension API |
| `selection` | The current editor selection |
| `todos` | Track progress across a multi-step request |
| `githubRepo` | Semantic search of a GitHub repository |
| `githubTextSearch` | Keyword search across repositories |
| `newWorkspace` | Scaffold a new workspace |

---

## MCP Tools

Tools from connected MCP servers are addressed by server name:

```yaml
tools: ['search', 'read', 'postgres/*']   # all tools from the postgres server
```

Grant MCP tools deliberately. A server exposing `read_query` is a very different
risk profile from one exposing `execute_sql`, and `server/*` grants both.

---

## Designing an Agent's Tool List

The restriction *is* the feature. Work out what the agent must not be able to do,
then grant the minimum that still lets it work.

### Reviewer with read/search tools

```yaml
tools: ['search', 'read']
```

This selection excludes direct file-editing and terminal tools. Inspect the effective configuration and any delegation or added tools before treating a workflow as read-only.

If you add `execute/runInTerminal` to run a test or `npm audit`, the reviewer gains a general-purpose command capability. It can write files, execute scripts, and invoke task runners even without `execute/createAndRunTask`. Tool selection does not constrain it to only the commands mentioned in prose.

### Implementer

Needs to write code and prove it works.

```yaml
tools: ['search', 'read', 'edit', 'execute']
```

### File-creation agent

```yaml
tools: ['search', 'read', 'edit/createFile']
```

This allows file creation without granting the full edit tool set. It does not restrict new content to prose or paths to documentation folders. A documentation-only policy requires additional controls and review. Do not describe this as preventing source-code creation.

### Research agent

Reads code and the web, changes nothing.

```yaml
tools: ['search', 'read', 'web/fetch']
```

---

## What restrictions provide

Tool lists determine which capabilities are exposed to the agent. They are an enforced configuration mechanism, not merely natural-language advice. They are not a complete sandbox: a permitted terminal, browser, extension action, or MCP tool may perform broad operations.

| Layer | Purpose | Limitation |
|---|---|---|
| Tool selection | Limit exposed capabilities | Broad tools can perform indirect actions |
| Approvals | Review an action before execution | Depends on active approval settings |
| Hooks | Check supported lifecycle events and allow/deny according to code | Must be enabled, correctly matched, and tested |
| Credentials and filesystem isolation | Restrict underlying resource access | Must cover the actual execution environment |
| Organisation policy / CI | Apply administrative controls and required checks | Coverage varies by product, plan, and workflow |

VS Code documents `PreToolUse`; Copilot CLI uses `preToolUse`. VS Code can translate CLI-style hook configuration, but event names, input fields, and decision output must follow the target client's schema.

A hook is more than an exit code. For example, VS Code supports structured permission decisions. Do not assume any nonzero exit guarantees the intended denial, or that a hook catches actions its logic does not match. See the [hooks reference](https://code.visualstudio.com/docs/agent-customization/hooks).

---

## Verification

Tool naming has changed before :  the current tool-set vocabulary replaced flatter
names like `codebase` and `editFiles`. Before relying on a specific string:

1. In chat, type `#` and read the completion list. That is the live vocabulary.
2. Run `/agents` → configure, and inspect the tool picker for an existing agent.
3. Check the [VS Code Copilot feature reference](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features).

Unavailable tool references can be ignored. Confirm exact identifiers and the effective selection in the active client. These examples were checked against documentation, not execution-tested in a signed-in VS Code session.


## Official sources

- [Built-in tool reference](https://code.visualstudio.com/docs/agents/reference/ai-features-cheat-sheet)
- [Custom-agent tools](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [Hook behaviour and CLI compatibility](https://code.visualstudio.com/docs/agent-customization/hooks)
