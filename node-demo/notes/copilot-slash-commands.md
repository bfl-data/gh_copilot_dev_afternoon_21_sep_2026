# GitHub Copilot :  Commands, Variables & Shortcuts Reference

> **Client compatibility:** Current VS Code documentation says `.prompt.md` files are not loaded by Agent Host sessions; they remain supported by the Local agent for now. For Agent Host, migrate reusable prompts to agent skills. Prompt-file examples in this guide apply to the Local agent. [Official prompt-file documentation](https://code.visualstudio.com/docs/agent-customization/prompt-files).

> **Source:** VS Code Copilot feature reference + GitHub Docs
> **Documentation checked:** 21 September 2026
> **Note:** Availability varies by plan, by organisation policy, and by VS Code
> version. Not every command appears for every user.

---

## Slash Commands

Type `/` in the Chat view to see what is available in your setup.

### Code Tasks

| Command | Purpose |
|---|---|
| `/explain` | Explain a code block, file, or programming concept |
| `/fix` | Fix a code block, or resolve compiler and linting errors |
| `/tests` | Generate tests for the selection, or for all functions in the file |
| `/setupTests` (experimental) | Recommend a testing framework and walk through setting it up |
| `/doc` | Generate documentation comments (from inline chat) |
| `/plan` | Produce a detailed implementation plan for a complex task |

### Session Management

| Command | Purpose |
|---|---|
| `/clear` | Start a new chat session in the Chat view |
| `/compact` | Condense a long conversation to fit the model's context window |
| `/fork` | Create a separate session inheriting the conversation history |
| `/rename <name>` | Rename a local chat |
| `/models` | Open the model picker |
| `/tools` | Configure tools in a local chat |

> `/compact` and `/fork` are the closest Copilot equivalents to session
> management in other agentic tools. `/compact` when a long thread starts losing
> the plot; `/fork` before trying a risky direction you may want to abandon.

### Scaffolding

| Command | Purpose |
|---|---|
| `/new` | Scaffold a new workspace or file |
| `/newNotebook` | Scaffold a new Jupyter notebook from a description |
| `@vscode /search` | Generate a query for the Search view |


### Configuring Customisations

These are how you create and manage the files from the trainer handbook without
writing them by hand.

| Command | Purpose |
|---|---|
| `/agents` | Open the Configure Custom Agents menu |
| `/prompts` | Manage prompt files |
| `/instructions` | Manage instruction files |
| `/skills` | Manage agent skills |
| `/hooks` | Manage hooks |
| `/init` | Generate or update workspace instructions in a local agent session |
| `/create-agent` | Generate a new `.agent.md` |
| `/create-prompt` | Generate a new `.prompt.md` |
| `/create-instructions` | Generate a new `.instructions.md` |
| `/create-skill` | Generate a new `SKILL.md` |
| `/create-hook` | Generate a new hook definition |

> **Use these in a demo.** Building a prompt file via `/create-prompt` is faster
> and more convincing than typing YAML frontmatter on screen.

### Diagnostics

| Command | Purpose |
|---|---|
| `/debug` | Open the Chat Debug view |
| `/troubleshoot` | Analyse agent debug logs |

### Approval

| Command | Purpose |
|---|---|
| `/yolo` (alias `/autoApprove`) | Bypass approvals for the current supported local or CLI session |
| `/disableYolo` (alias `/disableAutoApprove`) | Restore the default permission level |
| `/autopilot` | Enable Autopilot in a supported session |
| `/exitAutopilot` | Exit Autopilot and restore the default permission level |

> Bypassing approvals removes a confirmation control for the current supported session. Administrator restrictions and other controls may still apply. Hooks only enforce checks that are supported, enabled, and correctly implemented. Demonstrate how to restore approvals, and use disposable training data.

### Your Own

| Command | Purpose |
|---|---|
| `/<prompt-name>` | Run a prompt file from `.github/prompts/` |
| `/<skill-name>` | Invoke an agent skill directly |

---

## Context Variables (`#`)

Attach specific context instead of hoping Copilot picks the right thing. This is
the highest-return habit in the whole tool.

### Content

| Variable | Attaches |
|---|---|
| `#file:path/to/file.js` | One specific file |
| `#selection` | The current editor selection |
| `#search/changes` | Current source control changes (your uncommitted diff) |
| `#search/codebase` | Semantic search across the workspace |
| `#githubRepo` | Semantic search of a GitHub repository |
| `#githubTextSearch` | Keyword/pattern search across repositories |

### Tool Sets

These reference tools or tool sets, not just static content. They do not bypass administrator policy, authentication, or approvals. Configure available tools in the picker or frontmatter. See `copilot-tools-reference.md`. `todos` and `newWorkspace` below are individual tools.

| Variable | Grants |
|---|---|
| `#read` | Read files in the workspace |
| `#search` | Search for files in the workspace |
| `#edit` | Modify the workspace |
| `#execute` | Run code, commands, and applications |
| `#web` | Access web content |
| `#browser` | Interact with integrated browser pages |
| `#agent` | Delegate tasks to other agents |
| `#vscode` | Query VS Code features and extension APIs |
| `#todos` | Track progress across a multi-step request |
| `#newWorkspace` | Create a new workspace |

### Worked example

```
Vague:
  Why is login failing?

Precise:
  #file:src/auth/authService.js #file:tests/authService.test.js
  The password check passes even with a wrong password. Why?
```

The second gets a specific answer because it was given specific material. Vague
prompt plus vague context equals vague answer :  reliably.

---

## Chat Participants (`@`)

| Participant | Ask it about |
|---|---|
| `@github` | Repositories, issues, pull requests, GitHub skills |
| `@terminal` | The integrated terminal, shell commands, and their output |
| `@vscode` | VS Code features, settings, and extension APIs |

```
@terminal why did that npm command fail?
@vscode how do I change the auto-save delay?
@github what open issues mention authentication?
```

---

## Chat Modes

Select the workflow or agent from the Chat view. Options vary by client version and session type; do not assume all four appear in every environment.

| Mode | Behaviour |
|---|---|
| **Ask** | Question-answering workflow; review the active surface and available actions |
| **Edit** (where available) | Edits files you explicitly add to the working set. You control scope. |
| **Agent** | Decides scope itself. Reads, edits, runs commands, iterates on failures. |
| **Plan** | Researches and proposes a plan for review before implementation handoff |
| *custom* | Your `.agent.md` definitions appear here alongside the built-ins. |

**Choosing:** Ask to understand. Edit when you know the file list. Plan when the
change is large enough that you want to review the approach first. Agent when you
know the outcome but not the file list.

---

## Keyboard Shortcuts

| Windows / Linux | macOS | Does |
|---|---|---|
| `Tab` | `Tab` | Accept the inline suggestion |
| `Ctrl+→` | `Cmd+→` | Accept one word of it |
| `Esc` | `Esc` | Dismiss the suggestion |
| `Alt+]` / `Alt+[` | `Opt+]` / `Opt+[` | Next / previous alternative |
| `Ctrl+Alt+I` | `Ctrl+Cmd+I` | Open the Chat view |
| `Ctrl+I` | `Cmd+I` | Inline chat / voice chat |
| Windows: `Ctrl+Shift+I`; Linux: `Ctrl+Shift+Alt+I` | `Shift+Cmd+I` | Switch to using agents in Chat view |
| `Ctrl+Shift+Alt+L` | `Shift+Opt+Cmd+L` | Quick Chat |
| `Ctrl+Alt+.` | `Opt+Cmd+.` | Open the model picker |
| `Ctrl+N` | `Cmd+N` | New chat session when Chat view has focus |

> **The one to teach:** `Ctrl+→` / `Cmd+→`, word-by-word acceptance. When a
> suggestion is seventy percent right you take the seventy percent, instead of
> accepting everything and deleting the rest. Almost nobody has this in muscle
> memory, and it is the highest-value shortcut on the list.

---

## Two Buttons That Are Not Commands

Neither of these is a slash command, and both get missed because of it.

| Where | What it does |
|---|---|
| Sparkle icon in the Source Control message box (VS Code) | Writes a commit message from the staged diff. No prompt, no chat panel. |
| Copilot on a pull request (github.com) | Drafts a pull request description from the diff. Plan gating has differed from the commit-message button :  check yours. |

Commit-message generation can use custom instructions. A custom prompt can make a particular review or formatting workflow explicit, but the built-in action is not necessarily generic or uncustomisable. Check the current instructions settings.

---

## Settings Worth Knowing

| Setting | Controls |
|---|---|
| `chat.promptFilesLocations` | Extra folders to look for `.prompt.md` files |
| `chat.instructionsFilesLocations` | Extra folders for `.instructions.md` files |
| `chat.includeApplyingInstructions` | Enables `applyTo` pattern matching |
| `chat.useAgentsMdFile` | Whether `AGENTS.md` is read |
| `chat.useCustomizationsInParentRepositories` | Monorepo / parent-repo discovery |
| `chat.promptFilesRecommendations` | Surfaces prompts as recommended actions |

---

## Debugging "Copilot Ignored My Instructions"

Check the following before changing the prompt:

1. **Expand the References section** in the chat response. It lists which
   referenced instructions when supported. Use diagnostics or Chat Debug to investigate missing context; absence from the visible list is not conclusive proof that the file was never read.
2. **Check the file location.** `.github/copilot-instructions.md`,
   `.github/instructions/*.instructions.md`, `.github/prompts/*.prompt.md`,
   `.github/agents/*.agent.md`, `.github/skills/<name>/SKILL.md`. These are common repository locations. User, plugin, and additional configured locations may also be supported.
3. **Check `applyTo`** on path-scoped instructions. A glob that does not match
   the relevant files may prevent automatic application through that rule. Explicit attachment and other supported discovery paths also matter.
4. **Check the enabling setting** from the table above.
5. **Check the file is not enormous.** A very long instructions file competes
   with your code for context and gets diluted. Under 100 lines for the
   repo-wide file is a good discipline.
6. **Only then consider that it was read and not followed.** If that is genuinely
   the case, the instruction is advice :  and if it must be enforced, it belongs
   in a hook, not a markdown file.


## Official sources

- [Commands, tools, and shortcuts](https://code.visualstudio.com/docs/agents/reference/ai-features-cheat-sheet)
- [Settings reference](https://code.visualstudio.com/docs/agents/reference/ai-settings)
- [Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)
