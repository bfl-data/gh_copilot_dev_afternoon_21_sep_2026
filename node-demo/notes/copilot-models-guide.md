# GitHub Copilot: Models & Cost Guide

> **Client compatibility:** Current VS Code documentation says `.prompt.md` files are not loaded by Agent Host sessions; they remain supported by the Local agent for now. For Agent Host, migrate reusable prompts to agent skills. Prompt-file examples in this guide apply to the Local agent. [Official prompt-file documentation](https://code.visualstudio.com/docs/agent-customization/prompt-files).

> **Documentation checked:** 21 September 2026
> Scope: GitHub Copilot. Model access and billing vary by plan, client, policy, and subscription status.
> This is a documentation review, not a measured cost benchmark. Check your account before quoting a budget.

## Billing model

Usage-based billing began on 1 June 2026. AI Credits represent model token usage: input, output, and cached tokens have model-specific rates. One AI Credit equals USD 0.01.

Legacy annual Pro and Pro+ subscriptions can retain request-based billing until expiry. Do not assume every account has migrated. Consult the [transition announcement](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) and the account's actual billing status.

Code completions and Next Edit Suggestions remain unlimited on paid plans and do not consume AI Credits. Chat and agent work consume credits. See [individual billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing).

## Included monthly credits

| Plan | Base credits | Flex allotment | Current total |
|---|---:|---:|---:|
| Pro | 1,000 | 500 | 1,500 |
| Pro+ | 3,900 | 3,100 | 7,000 |
| Max | 10,000 | 10,000 | 20,000 |

Flex allotments can change. Included credits reset monthly and do not roll over. Source: [individual billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing).

| Organisation plan | Credits per assigned user per month |
|---|---:|
| Business | 1,900 |
| Enterprise | 3,900 |

Organisation credits are pooled at the billing entity level. The higher June-to-August transition allowances have ended; budget with current allowances. See [organisation billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing).

## Agent billing: the key distinction

One user prompt can trigger several model calls. Their token usage contributes to consumption. Tool results can become input to later calls, increasing context size. Autonomous work is not free simply because the user did not send another message.

Prompt count alone is therefore a poor cost estimate. Clear scope may reduce retries, but one large prompt is not guaranteed to cost less than several focused prompts. See [what affects usage](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing).

| Workflow | Budget consideration |
|---|---|
| Inline completion / Next Edit Suggestions | No AI Credit charge on paid plans |
| Chat / CLI | Model choice, context, output, and repeated model calls |
| Agent work | Iterations, tool-result context, reasoning, and task scope |
| Cloud agent / code review | Check current feature billing and applicable GitHub Actions usage |

Do not describe code review as universally the most expensive feature. Use the account's actual usage and the [current pricing reference](https://docs.github.com/copilot/reference/copilot-billing/models-and-pricing).

## Model availability snapshot

Examples from the [official supported-model roster](https://docs.github.com/en/copilot/reference/ai-models/supported-models), not an exhaustive list or a promise of access:

| Provider | Examples |
|---|---|
| OpenAI | GPT-5 mini, GPT-5.3-Codex, GPT-5.4, GPT-5.5, GPT-5.6 Luna / Sol / Terra, GPT-6 Astra |
| Anthropic | Claude Haiku 4.5, Sonnet 5, Opus 4.8 / 5, Fable 5 / 5.1 |
| Google | Gemini 3.7 Flash, Gemini 3.8 Flash |
| Other providers | Grok 4.5 / 4.6, Kimi K3, MAI-Code-1.1-Flash |

Retirements relevant to the earlier guide:

- Sonnet 4.5, Gemini 3.1 Pro, and Raptor mini retired on 1 September 2026.
- Sonnet 4.6 retired on that date with an exception for individual annual-plan subscribers.
- MAI-Code-1-Flash retired on 10 September 2026.
- The roster schedules Opus 4.7, Gemini 3.5 / 3.6 Flash, and Kimi K2.7 Code retirement for 2 October 2026.

Check client, plan, administrator policy, and provider data-handling conditions before a demonstration. Some models require newer client versions.

## Choosing a model

These are training heuristics, not official product tiers or performance guarantees.

| Task | Selection approach |
|---|---|
| Mechanical edits, boilerplate, brief explanations | Try a lower-cost model; validate the result |
| Normal implementation and tests | Select a model that performs well on representative team tasks |
| Difficult debugging or architecture | Compare stronger reasoning models and measure the extra cost |
| Security-sensitive changes | Use independent review and tests regardless of model |

Escalate when quality warrants it. Repeated unsuccessful attempts with a cheaper model can cost more overall. Avoid hard-coding a universal cost ranking by family name.

## Switching and pinning models

In VS Code, use the model picker or `Ctrl+Alt+.` on Windows/Linux, `Option+Command+.` on macOS. Availability depends on the session.

Prompt files and custom-agent files support a `model` field. Select an exact available model identifier using the editor's suggestions. Omit the field to use the session default. Recheck pinned identifiers after model retirements.

Example custom task without a fragile model pin, saved as `.github/prompts/security-review.prompt.md`:

```markdown
---
name: security-review
description: Review pending changes for security issues
agent: agent
tools: ['search', 'read']
---
Review the pending changes. Report evidence, affected files, impact,
and suggested fixes. Do not modify files. State what you could not verify.
```

This creates a custom prompt; it is not a built-in security certification or a replacement for testing.

## Cost control for teams

1. Define the outcome, relevant files, and stopping conditions.
2. Use a question-answering workflow when implementation is unnecessary.
3. Measure representative sessions rather than counting prompts.
4. Review background review/agent triggers and avoid duplicate runs.
5. Set spending budgets and decide what happens when credits run out.
6. Forecast seat subscriptions, metered usage, and applicable Actions charges separately.
7. Use aggregate usage to improve workflows; usage or acceptance rate alone does not establish individual productivity.

## Official sources

- [Individual billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing)
- [Organisation and enterprise billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)
- [Billing transition](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/)
- [Model roster and retirements](https://docs.github.com/en/copilot/reference/ai-models/supported-models)
- [Models and pricing](https://docs.github.com/copilot/reference/copilot-billing/models-and-pricing)
- [VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [VS Code feature reference](https://code.visualstudio.com/docs/agents/reference/ai-features-cheat-sheet)
