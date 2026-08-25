# SkyVision — Slot #98 / Lane 02

SkyVision is an **engineering-beta vision-job metadata and policy library**.

It validates caller-supplied vision jobs and result envelopes, including safe identifiers, supported task types, result-count limits, and request/completion ordering.

## Integration contract

A SKYCOIN4444 adapter may create a `VisionJob`, submit it to a separately verified vision provider, then validate provider result metadata with `validateVisionResultEnvelope` before other platform modules consume it.

The existing `server/_core/imageGeneration.ts` is image-generation/provider plumbing and is not treated as proof of a computer-vision analysis service.

## Security and truth boundaries

SkyVision does not execute a model, inspect image bytes, perform OCR, identify people, moderate content, or connect to a live vision provider. Provider authentication, binary validation, model safety, privacy controls, storage, and downstream authorization remain outside this bounded core.
