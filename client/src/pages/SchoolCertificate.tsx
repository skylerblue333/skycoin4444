// Legacy compatibility entry point.
// The old standalone school surface contained synthetic enrollments, ratings,
// token rewards, and on-chain certificate claims that are not supported by the
// engineering beta. Keep the historical URL working by converging it on the
// canonical authored SkySchool experience.
export { default } from "./SkySchool";
