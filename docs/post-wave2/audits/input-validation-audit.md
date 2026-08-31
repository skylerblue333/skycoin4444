# Input validation audit

Scope: review public/domain entry points for explicit validation of identifiers, timestamps, amounts, enums, collections, nulls, and length/range constraints.

Acceptance criteria:
- inventory reusable validators and gaps;
- flag implicit coercion or unsafe defaults;
- verify integer/minor-unit and timestamp rules where applicable;
- define representative boundary regression tests;
- keep error behavior deterministic.
