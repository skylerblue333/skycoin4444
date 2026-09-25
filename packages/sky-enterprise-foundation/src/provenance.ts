export const ENTERPRISE_FOUNDATION_PROVENANCE = Object.freeze([
  Object.freeze({
    repository: "skylerblue333/Sky-SkyEnterprise",
    commit: "d64edb7f7787393229de99cd9393e4542fecc490",
    license: "MIT",
    capabilities: Object.freeze([
      "organization-membership",
      "project-registry",
      "contract-registry",
    ]),
  }),
  Object.freeze({
    repository: "skylerblue333/skycoin-security",
    commit: "be04350399870257e60702819cc931d1e76f990c",
    license: "MIT",
    capabilities: Object.freeze([
      "default-deny-policy",
      "aes-256-gcm-envelope",
    ]),
  }),
  Object.freeze({
    repository: "skylerblue333/skycoin-analytics",
    commit: "170b5f197a618880d36160c2947de147511413da",
    license: "MIT",
    capabilities: Object.freeze(["bounded-event-aggregation"]),
  }),
] as const);
