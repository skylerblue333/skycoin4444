# Legacy education truth boundary

The V5 beta keeps several historical learning URLs for route compatibility, but
those routes must not advertise capabilities that the current beta does not
provide.

## Current behavior

- `/learning`, `/learning-path`, and `/my-learning` delegate to the
  canonical evidence-led SkySchool surface.
- `/school-certificate` is a learning-evidence explainer backed by the same
  bounded activity-evidence feed used by SkySchool.
- `/certificate-manager` delegates to that learning-evidence boundary instead
  of exposing an empty certificate-management shell.

## Claims intentionally removed

The retired legacy certificate page contained fixed student/instructor names,
a fixed score and completion date, a fabricated blockchain hash, and a claim
that the certificate was permanently recorded on-chain. The retired learning
page also advertised fixed SKY444 lesson rewards.

Those statements are not supported by the engineering beta and must not return.

## Product boundary

Learning completion evidence is not an accredited credential, academic credit,
professional license, employer verification, identity verification, token
reward, blockchain mint, on-chain attestation, or guaranteed full-history
transcript. HopeAI study assistance remains subject to configured provider and
tool availability.
