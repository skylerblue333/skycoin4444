# HopeAI Real Tool + Agent Runtime

HopeAI now has a bounded engineering-beta agent execution layer on top of the existing provider-backed chat workspace.

## Current verified capability

- **173 specialist agent profiles**, including Lawyer, Legal Researcher, Contract Reviewer, Software Engineer, Security Analyst, Teacher, Data Analyst, Product Manager, Writer, Operations Analyst, Creator Coach, and many others.
- **79 tool definitions** in the catalog.
- **36 tools execute locally on the SKYCOIN4444 server** today.
- **40 external tools are integration-required** and are not exposed to the model as executable until a real connector/provider is configured.
- **3 tools are disabled by default** (including secret-bearing helpers and JavaScript regex execution) and are not exposed to autonomous model tool calling.
- The agent loop permits at most 3 tool rounds, 4 calls per round, and 8 total calls in one request.
- Tool calls and their success/error results are returned to the HopeAI UI as execution evidence.

## Real executable tool families

The current executable set includes bounded deterministic utilities for:

- arithmetic, percentages, length conversion, and temperature conversion;
- text statistics, word frequency, URL/email extraction, sorting, deduplication, case conversion, slugging, literal replacement, and excerpts;
- Markdown outlines and checklist extraction;
- JSON validation/formatting/key inspection/field selection;
- simple CSV profiling and numeric summary statistics;
- date differences and timestamp conversion;
- URL and query-string parsing;
- SHA-256, base64 encoding/decoding, UUID generation, and HTML escaping;
- simple line differences, import extraction, and TODO/FIXME extraction;
- contract-clause keyword checklists and legal-document heading extraction.

These tools are deterministic local functions. They do not browse the web, modify external systems, deploy code, send messages, move money, or sign blockchain transactions.

## Specialized agents

Agent profiles are prompt-bound specializations sharing the same controlled execution engine. Examples:

- Lawyer
- Legal Researcher
- Contract Reviewer
- Compliance Analyst
- Software Engineer
- Debugger
- Software Architect
- Security Analyst
- Threat Modeler
- Data Analyst
- Data Scientist
- AI Engineer
- Model Evaluator
- Product Manager
- Project Manager
- Startup Advisor
- Business Analyst
- Teacher
- Tutor
- Math Tutor
- Language Tutor
- Writer
- Editor
- Technical Writer
- Workflow Designer
- Incident Coordinator
- Career Coach
- Interview Coach
- Community Manager
- Creator Coach

The catalog contains 173 profiles so the UI can expose focused assistants without creating separate fake products or pages.

## Lawyer boundary

The Lawyer and other legal profiles provide general legal information, issue spotting, document organization, and drafting support.

They are instructed to:

- ask for jurisdiction and relevant dates when law may vary;
- avoid inventing statutes, cases, court rules, filing requirements, deadlines, or outcomes;
- distinguish source-supported facts from assumptions;
- avoid implying a lawyer-client relationship;
- treat the local contract checklist as an issue-spotting aid only, not a determination that a contract is legally sufficient.

Current-law research still requires a real web/legal-research integration.

## External tools: fail closed

The catalog includes planned connectors such as web search, browser navigation, GitHub read/write, Gmail, calendars, cloud drives, Slack, database access, code sandboxing, shell execution, image/media tools, maps/weather, market data, blockchain RPC, wallet signing, payment submission, cloud deployment, vector search, durable memory, OCR/PDF extraction, spreadsheets, CRM, ticketing, and SMS.

These are marked `integration_required`. They are not included in the LLM tool list and direct execution returns a controlled error until a real integration is connected.

## Security boundaries

- The LLM receives only whitelisted executable tool schemas.
- Tool IDs are resolved against the server registry; unknown tools fail closed.
- Tool arguments must be JSON objects and are revalidated by each tool implementation.
- Tool-call count and rounds are bounded.
- Secret-bearing password/JWT helpers are disabled from autonomous tool calling.
- JavaScript regex execution is disabled until a time-bounded safe regex engine or isolated execution boundary is integrated.
- Tool results are capped before being returned to the model/UI, and text replacement rejects oversized projected output before allocating it.
- Regex patterns are length-bounded and obvious nested-quantifier patterns are rejected.
- No tool receives credentials, private keys, recovery phrases, or provider secrets from server configuration.
- Tool success is not inferred: the UI shows only recorded execution events.

## Product limitations

This is an engineering beta, not ChatGPT or Manus feature parity. The current runtime does not itself provide computer use, web browsing, durable cloud memory, external account access, background execution, payments, blockchain signing/broadcast, legal representation, regulatory certification, or guaranteed professional advice.

Those capabilities require separately configured integrations, authorization, provider-specific safety controls, and their own verification evidence.
