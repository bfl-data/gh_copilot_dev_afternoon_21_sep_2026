# GitHub Copilot Prompting Guide

> **Client compatibility:** Current VS Code documentation says `.prompt.md` files are not loaded by Agent Host sessions; they remain supported by the Local agent for now. For Agent Host, migrate reusable prompts to agent skills. Prompt-file examples in this guide apply to the Local agent. [Official prompt-file documentation](https://code.visualstudio.com/docs/agent-customization/prompt-files).

> **Documentation checked:** 21 September 2026
> Scope: prompting guidance for GitHub Copilot, primarily in VS Code.
> The patterns below are teaching techniques, not official Copilot features or guarantees of model reasoning. Ask for concise explanations, evidence, and test results rather than private internal reasoning.

Role prompting and structured problem-solving patterns, mapped where appropriate to Copilot customisation files.

Three things are worth knowing before you use these patterns:

- **Roles and reasoning instructions are just plain-text prompt content.** There
  is no special "role" API. `Acting as a <role>, ...` and structured reasoning requests
  work as prose :  typed into chat, or embedded in a
  `.github/copilot-instructions.md`, a `.prompt.md`, an `.agent.md`, or a
  `SKILL.md`.
- **Copilot has native mechanics that overlap with several CoT variations** :
  Plan mode, custom agents, agent-mode todo tracking, and prompt files. Where a
  pattern maps onto one of these, it is called out, so you use the built-in
  mechanism instead of hand-rolling it in a prompt every time.
- **A pattern you use twice belongs in a file.** The whole point of the
  customisation layer is that a good prompt stops being something you retype.
  Part 3 covers where each pattern should live.

---

## Part 1 :  Role Prompting

Use as: `Acting as a <role>, ...`

The role shifts Copilot's lens :  what it prioritises, what it flags, what
vocabulary it uses. The underlying model does not change; only emphasis does.

### Four ways to apply a role in Copilot

1. **Inline, one-off** :  prefix your message:
   `Acting as a senior SRE, review this deployment script for single points of failure.`
2. **Persistent, project-wide** :  put the role in `.github/copilot-instructions.md`
   (e.g. "When reviewing SQL in this repo, act as a DBA focused on production
   safety") so supported chat requests can include it automatically. This does not mean every Copilot surface, such as inline completions, uses it identically.
3. **Persistent, scoped to a path** :  put it in
   `.github/instructions/<name>.instructions.md` with an `applyTo` glob, to associate the DBA guidance with matching SQL files. Other discovery mechanisms or explicit attachment can also make instructions relevant. Preferred over the repo-wide
   file when the role is only right for part of the codebase.
4. **Delegated and isolated** :  define it as a custom agent in
   `.github/agents/<name>.agent.md`, with its own tool restrictions. This provides a named configuration and tool selection. It does not create a separate OS identity or isolated conversation automatically. Exclude terminal and other indirect write capabilities when designing a read-only reviewer.

> **Which to use.** Inline for a one-off. A path-scoped instructions file when
> the lens should always apply to certain files. A custom agent when you want to
> *switch into* the persona deliberately, and when tool restriction matters.

### Engineering Roles

| Role | What it shifts |
|---|---|
| Senior TypeScript / Java / Python / Go engineer | Language idioms, best practices for that ecosystem |
| Backend engineer | API design, data access patterns, server-side concerns |
| Frontend engineer | Component design, accessibility, bundle size awareness |
| Full-stack developer | End-to-end tradeoffs, API contract ownership |
| Systems programmer | Memory management, performance, low-level concerns |
| Embedded / firmware engineer | Resource constraints, determinism, no dynamic allocation |
| DevOps / Platform engineer | Infra-as-code, CI/CD, observability, deployment safety |
| Site Reliability Engineer (SRE) | Reliability, SLOs, error budgets, graceful degradation |
| Data engineer | Pipeline design, schema evolution, idempotency |
| ML engineer | Data preprocessing, model integration, inference efficiency |

### Architecture Roles

| Role | What it shifts |
|---|---|
| Software architect | Design patterns, SOLID, long-term maintainability |
| Solution architect | System-level tradeoffs, component boundaries, vendor choice |
| Enterprise architect | Governance, standards compliance, org-level consistency |
| API designer | REST/GraphQL conventions, versioning, consumer-first thinking |
| Database architect | Normalisation, indexing strategy, query performance |
| Cloud architect (AWS / Azure / GCP) | Managed services, cost optimisation, cloud-native patterns |
| Microservices architect | Service boundaries, coupling, distributed systems tradeoffs |
| Event-driven architect | Messaging patterns, eventual consistency, idempotency |

### Security Roles

| Role | What it shifts |
|---|---|
| Application security engineer | OWASP Top 10, input validation, secure defaults |
| Penetration tester | Attacker mindset :  "how would I exploit this?" |
| Security auditor | Compliance evidence, audit trail, policy adherence |
| Cryptographer | Algorithm selection, key management, random number generation |
| Identity / IAM engineer | Auth flows, token handling, privilege escalation risks |
| Data privacy engineer | PII exposure, GDPR / DPDP compliance, data minimisation |

> **Custom workflow example:** create and supply a `security-review.prompt.md` file with the checks and output format you need. It is not included automatically. A custom reviewer can limit tools to `search` and `read`; validate its complete tool configuration and do not grant terminal access if writes must be excluded.

### Quality & Testing Roles

| Role | What it shifts |
|---|---|
| Senior code reviewer | Readability, naming, abstraction leaks, PR comments |
| QA / Test engineer | Edge cases, boundary conditions, test coverage gaps |
| Performance engineer | Algorithmic complexity, memory allocation, profiling approach |
| Accessibility expert | WCAG compliance, screen reader compatibility, keyboard navigation |
| Localisation engineer | i18n patterns, string externalisation, locale-aware formatting |

> **Copilot native equivalent:** for review of a pull request specifically,
> request a review from Copilot on the PR itself rather than prompting "acting
> as a senior code reviewer". It produces line-anchored suggestions you can
> commit directly, and it reads your instructions files :  so your team's
> standards are applied automatically.

### Data & Database Roles

| Role | What it shifts |
|---|---|
| Database administrator (DBA) | Index strategy, locking, connection pooling, vacuum/maintenance |
| SQL expert | Query optimisation, execution plans, join strategy |
| Data modeller | Entity relationships, normal forms, schema evolution |
| Elasticsearch engineer | Mapping design, query DSL, relevance tuning |
| Redis architect | Data structure selection, eviction policy, persistence tradeoffs |

### Documentation & Communication Roles

| Role | What it shifts |
|---|---|
| Technical writer | Clarity, audience-appropriate language, structure |
| API documentation specialist | OpenAPI conventions, examples, error descriptions |
| Developer advocate | Tutorial-style explanation, onboarding experience |
| Rubber duck debugger | Forces step-by-step reasoning aloud :  great for debugging prompts |

### Domain Expert Roles (Industry)

| Role | What it shifts |
|---|---|
| Financial systems engineer | Precision arithmetic, audit requirements, regulatory constraints |
| Payments engineer | PCI-DSS awareness, idempotency, double-spend prevention |
| Healthcare data engineer | HIPAA / HL7 / FHIR, PHI handling, consent management |
| E-commerce engineer | Inventory concurrency, cart consistency, tax calculation edge cases |
| Compliance engineer | Regulatory mapping, evidence collection, policy implementation |

### Teaching & Explanation Roles

| Role | What it shifts |
|---|---|
| Senior engineer mentoring a junior | Explains the why, not just the what. Adds comments. |
| Computer science professor | Theory-first, complexity analysis, formal definitions |
| Code explainer | Line-by-line walkthrough, plain English, no jargon |
| Interviewer | Asks clarifying questions before answering :  surfaces assumptions |

### Quick Examples

```
Acting as a senior SRE, review this deployment script for single points of failure.

Acting as a penetration tester, identify how this login endpoint could be abused.

Acting as a DBA, rewrite this query to avoid a full table scan.

Acting as a technical writer, rewrite this README for a developer new to the codebase.

Acting as a payments engineer, review this refund flow for idempotency issues.

Acting as a senior code reviewer, give me the 3 most important comments you would
leave on this pull request.

Acting as a computer science professor, explain the time complexity of this algorithm
and suggest a more efficient approach.
```

### Tips for Role Prompting

- **Be specific.** "Senior TypeScript engineer" produces better output than
  "software engineer."
- **Combine roles when needed:** "Acting as a senior Java engineer with a focus
  on Spring Security..."
- **The role changes emphasis, not facts.** Copilot still uses the same model :
  the role shifts what it prioritises and flags.
- **Stack with constraints.** Role prompting plus explicit constraints gives very
  precise output.

```
Acting as a DBA reviewing for production safety.
CONSTRAINTS: flag anything that could cause a table lock, full scan, or N+1 query.
```

- **Stack with context variables.** A role with no context is a personality with
  no information. Pin what it should look at:

```
Acting as an application security engineer, audit #file:src/auth/authService.js
for authentication bypasses.
```

- **Request an independent review explicitly.** Switching custom agents changes configuration but does not guarantee a fresh conversation. Start a new chat or invoke an isolated subagent and give it the original requirements, code, and evidence. A fork inherits the earlier conversation.

---

## Part 2 :  Chain of Thought (CoT) Variations

These author-defined patterns structure the requested work and visible output. They do not control or expose private model reasoning, and outcomes vary by model and context. Mappings to Plan, tools, prompt files, and skills are workflow suggestions.

### 1. Basic CoT :  List then Build

The simplest form. Force enumeration before generation.

```
Before writing any code, list every edge case that
parseAmount(value: string): number must handle.
Then write the function addressing each one.
```

### 2. Step-by-Step CoT

A request for a structured explanation. Test its usefulness on your task.

```
Outline the design decisions and trade-offs for a rate limiter
that supports multiple algorithms (fixed window, sliding window,
token bucket) without changing the calling code?
```

### 3. Plan-then-Execute

Produce a plan first. Execute only after the plan is approved.

> **Copilot native equivalent:** this is what **Plan** mode is for. Select it in
> the agent dropdown, or set `agent: plan` in a prompt file's frontmatter.
> Copilot researches and proposes a reviewable plan. Review it and explicitly hand it to an implementation agent when ready. Planning behaviour and available tools depend on the client and configuration; do not promise that no planning artifact can ever be written.

```
First, write a numbered implementation plan for adding
soft-delete to the User entity without breaking existing queries.
Do not write any code yet.

(Review the plan, then follow up:)

The plan looks good. Now execute step 3 only.
```

### 4. Self-Critique CoT

Write it. Critique it. Improve it. Three passes in one prompt.

```
Write a function that merges two sorted arrays.
Then critique your own implementation :  identify any edge cases
missed, any inefficiencies, or any readability issues.
Then write an improved version based on your critique.
```

> For critiquing *existing* code rather than something just written, request a
> Copilot review on the pull request :  you get line-anchored, committable
> suggestions instead of prose, and it applies your instructions files.

### 5. Failure Mode Analysis

Enumerate ways it breaks in production before writing anything.

```
Before implementing this caching layer, list every way it could
fail or cause incorrect behaviour in production:
- race conditions
- cache invalidation problems
- memory leaks
- stale data scenarios
- failure when the cache is unavailable

Then write the implementation addressing each failure mode.
```

### 6. Adversarial CoT (Red Team)

Argue against your own approach first.

```
I want to use a single global event bus for inter-service
communication in our monolith.

First, give me the strongest 3 arguments AGAINST this approach.
Then, given those arguments, recommend whether to proceed and
what mitigations to apply if we do.
```

### 7. Hypothesis Testing

Form a hypothesis. Test it against the code.

```
The bug is that orders occasionally get a 'duplicate key' error
on insert. My hypothesis is that the UUID generation is not
truly unique under concurrent load.

What evidence in #codebase would support or refute this hypothesis?
Test it systematically.
```

### 8. Reverse CoT (Work Backwards)

Start from the output, reason backwards to the cause.

```
This function is producing incorrect totals for orders that
contain discount codes. Here is the wrong output:

Input: [{ price: 100, qty: 2 }, { price: 50, qty: 1 }], discount: 0.1
Expected total: 225
Actual total: 240

Work backwards from the incorrect output to identify where
in the calculation the error occurs, then fix it.
```

> Pair this with agent mode. Once it has a hypothesis it can add a failing test,
> run the suite, and confirm the diagnosis rather than asserting it.

### 9. Analogical CoT

Use an analogy to shape the reasoning.

```
Think of a database connection pool like a car park with
a fixed number of spaces. Using that mental model, explain
why the following configuration will cause timeouts under
load, and what the correct settings should be:

max: 5
idleTimeoutMillis: 30000
connectionTimeoutMillis: 2000
```

### 10. Least-to-Most CoT

Solve the simplest sub-problem first, build up to the full problem.

> **Copilot native equivalent:** in agent mode, ask it to track the stages as a
> todo list. Each step stays visible and is checked off as it completes, which
> mirrors this pattern's incremental structure :  and gives you a place to
> interrupt if step 2 goes wrong, instead of discovering it at step 4.

```
Solve this in increasing complexity:

Step 1: Write a function that checks if a single password
        meets length requirements (min 8 chars).

Step 2: Extend it to also check for at least one uppercase
        and one digit.

Step 3: Extend it to return structured validation errors
        (not just true/false) so the UI can show specific messages.

Step 4: Make it configurable :  accept a PasswordPolicy object
        so rules can change without modifying the function.
```

### 11. Contrastive CoT

Show a bad reasoning path alongside the good one. The contrast teaches.

```
Here are two approaches to handling the N+1 query problem.

BAD reasoning:
"Just add .include() everywhere and it'll be fine."
Result: loads 10,000 records when you need 10.

GOOD reasoning:
"Identify the access pattern first. Load only what the caller
will use. Use a DataLoader for batching if called in a loop."

Apply the GOOD reasoning pattern to fix #selection
```

> If Copilot keeps repeating a pattern you dislike, do not keep correcting it in
> chat. A contrastive example in `.github/copilot-instructions.md` can guide future supported requests. Validate compliance; instructions do not guarantee permanent behaviour.

### 12. Socratic CoT

Copilot asks clarifying questions before answering.

```
I want to add full-text search to our product catalogue.
Before recommending an approach, ask me the 5 most important
clarifying questions whose answers would change your recommendation.
Then, after I answer, give your recommendation.
```

### 13. Complexity-First CoT

Reason about the optimal solution before implementing.

```
Before writing any code:
1. What is the optimal time complexity for finding the k most
   frequent elements in an array?
2. What data structure achieves that complexity?
3. What are the tradeoffs vs a simpler O(n log n) approach?

Then implement the optimal solution with that reasoning as comments.
```

### 14. Test-First CoT

Reason about the tests before writing the implementation.

> **Custom skill example:** create or install a `write-tests` skill that defines this workflow. It is not a guaranteed built-in skill. Automatic selection depends on relevance and description; invoke it explicitly when needed. Use CI tests or required checks for mandatory validation.

```
Before implementing calculateShippingCost(order: Order): Money:

1. List the test cases that a correct implementation must pass,
   grouped by: happy path / boundary conditions / error cases.

2. Then write the implementation that would pass all of them.
```

### 15. Security-First CoT

Reason about threats before implementing.

> **Custom workflow example:** for a full pass rather than an inline prompt,
> `/security-review` can run your defined checks after you create and install the corresponding prompt file. Its behaviour depends on the file contents and available tools.

```
Before implementing the file upload endpoint:

1. List every security risk this feature introduces.
2. For each risk, state the mitigation.
3. Then write the implementation with those mitigations built in from the start.
```

### Quick Comparison

| Variation | Best for | Native mechanism |
|---|---|---|
| Basic CoT | Edge case discovery | :  |
| Step-by-step | General reasoning on any complex task | :  |
| Plan-then-execute | Large changes you want to review first | **Plan mode** |
| Self-critique | Getting a better answer than the first pass | PR review |
| Failure mode analysis | Anything touching production data or state | :  |
| Adversarial | Architecture decisions :  stress-test your own idea | :  |
| Hypothesis testing | Debugging :  structured root cause analysis | Agent mode |
| Reverse CoT | Bug fixing from observed wrong output | Agent mode |
| Analogical | Explaining or reasoning about complex abstractions | :  |
| Least-to-most | Teaching, or building logic incrementally | Todo tracking |
| Contrastive | Correcting a pattern Copilot keeps repeating badly | Instructions file |
| Socratic | When you are not sure what information Copilot needs | :  |
| Complexity-first | Algorithm design, performance-sensitive code | :  |
| Test-first | TDD workflow, acceptance criteria from requirements | Custom `write-tests` skill, if installed |
| Security-first | Auth, file handling, external input, payments | Custom `/security-review` prompt, if created |

### Combining Variations

Variations stack. The most powerful patterns combine two:

```
/* Plan-then-Execute + Failure Mode Analysis */

Plan the implementation of our webhook signature verification.
Before the plan, list every way signature verification can be
bypassed or fail silently. Address each in the plan.
Then execute step 1 of the plan only.
```

```
/* Self-Critique + Security-First */

Write the password reset flow.
Then critique it as a penetration tester looking for
account takeover vulnerabilities.
Then produce a final version with all vulnerabilities addressed.
```

### Combining Part 1 and Part 2

Role prompting and CoT variations compose freely :  a role sets *whose* lens is
applied, a CoT variation sets *how* the reasoning unfolds:

```
Acting as a payments engineer, use Failure Mode Analysis before
implementing the refund endpoint: list every way a refund could be
double-processed or lost, then implement addressing each one.
```

---

## Part 3 :  Where a Pattern Should Live

This is the part that has no equivalent in a plain prompting guide, and it is
where most of the leverage is. A pattern you type twice belongs in a file.

| If the pattern... | Put it in | Why |
|---|---|---|
| Applies to every request in the repo | `.github/copilot-instructions.md` | Automatically included in supported requests |
| Applies only to certain files | `.github/instructions/*.instructions.md` | `applyTo` matching; keep guidance focused |
| Is a task you consciously start | `.github/prompts/*.prompt.md` | Becomes `/your-command` |
| Should fire on recognition, unprompted | `.github/skills/<n>/SKILL.md` | Copilot decides when it applies |
| Is a persona that needs tool limits | `.github/agents/*.agent.md` | Restricted tools are a real control |
| Must happen regardless of the model | `.github/hooks/*.json` | Supported lifecycle checks; correct event/output handling required |

### The promotion path

Most good team configuration arrives the same way:

```
1. You type a prompt in chat.                 (once)
2. You type it again next week.               (twice :  stop)
3. Local agent: save a .prompt.md; Agent Host: create a skill.
4. You notice you run it every single time.   (it should not need you)
5. Promote it to a SKILL.md.                  (available when relevant)
6. You notice the model sometimes ignores it. (it is advice, not a control)
7. Add tested hooks or CI checks.             (enforce supported checks)
```

Not every pattern needs to reach step 7. Choose a prompt file or skill according to the target session type. But knowing
the ladder exists tells you what to do when a prompt is not sticking :  and the
answer is almost never "write a longer prompt".

### One caution

Every instruction file loads into context on relevant requests, competing with
your actual code for room. An oversized instructions file can crowd out relevant task context. Keep the repo-wide file tight, push specifics into path-scoped
files, and delete patterns nobody uses. Prompt engineering has a budget.


## Official sources

- [Custom agents and handoffs](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)
- [Agent skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)
- [Hooks](https://code.visualstudio.com/docs/agent-customization/hooks)
- [VS Code feature reference](https://code.visualstudio.com/docs/agents/reference/ai-features-cheat-sheet)
