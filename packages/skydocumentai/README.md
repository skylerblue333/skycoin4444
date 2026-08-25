# SkyDocumentAI — Wave 2 Slot #97

SkyDocumentAI is an **engineering-beta local document extraction pipeline**. It deterministically processes caller-supplied UTF-8 text, Markdown, or JSON and returns normalized text, byte/line/word metrics, and a SHA-256 content digest.

## SKYCOIN4444 integration contract

Other modules can submit already-retrieved textual document content with an application-local document ID. The returned digest can be used to detect content changes before handing text to a separate search, knowledge, or model layer.

## Boundaries

This package does not fetch URLs, parse PDF/Office files, run OCR, call an AI/model provider, classify documents, persist extracted content, or claim semantic accuracy. JSON parsing uses the platform runtime and rejects malformed input. Inputs are capped at 1,000,000 UTF-8 bytes to keep local processing bounded.

Callers are responsible for authorization, malware scanning of uploaded files before text reaches this package, retention policy, privacy controls, and any model/provider use performed after extraction.

## Validation

```sh
pnpm --filter @skycoin/skydocumentai test
pnpm run check:packages
pnpm --filter @skycoin/skydocumentai format:check
```
