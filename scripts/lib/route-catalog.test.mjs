import { describe, expect, it } from "vitest";
import {
  classifyDomain,
  implementationSignal,
  inspectSource,
  labelFor,
  parseComponentImports,
  parseStaticRoutes,
  summarizeCapabilityAudit,
} from "./route-catalog.mjs";

describe("V3 route catalog primitives", () => {
  it("creates readable labels for acronym-heavy components", () => {
    expect(labelFor("AICodeStudio")).toBe("AI Code Studio");
    expect(labelFor("APIDocumentation")).toBe("API Documentation");
  });

  it("parses static routes while excluding parameterized routes and duplicate paths", () => {
    const source = `
      <Route path="/wallet" component={Wallet} />
      <Route path="/wallet" component={WalletDuplicate} />
      <Route path="/users/:id" component={UserDetail} />
      <Route path="/ai-code-studio" component={AICodeStudio} />
    `;
    expect(parseStaticRoutes(source)).toEqual([
      { path: "/ai-code-studio", component: "AICodeStudio", label: "AI Code Studio" },
      { path: "/wallet", component: "Wallet", label: "Wallet" },
    ]);
  });

  it("maps both direct and lazy page imports", () => {
    const imports = parseComponentImports(`
      import Home from "./pages/Home";
      const Wallet = lazy(() => import('./pages/Wallet'));
    `);
    expect(imports.get("Home")).toBe("./pages/Home");
    expect(imports.get("Wallet")).toBe("./pages/Wallet");
  });

  it("classifies representative product domains", () => {
    expect(classifyDomain({ path: "/ai-agent", label: "AI Agent", component: "AIAgent" })).toBe("ai");
    expect(classifyDomain({ path: "/checkout", label: "Checkout", component: "Checkout" })).toBe("commerce");
    expect(classifyDomain({ path: "/wallet", label: "Wallet", component: "Wallet" })).toBe("crypto-web3");
    expect(classifyDomain({ path: "/courses", label: "Courses", component: "Courses" })).toBe("education");
  });

  it("reports implementation signals without presenting them as readiness certification", () => {
    const substantial = inspectSource(`
      import { useState } from "react";
      export default function Screen() {
        const [value, setValue] = useState(0);
        return <button onClick={() => setValue(value + 1)}>{value}</button>;
      }
      ${"const detail = 1;\n".repeat(150)}
    `);
    expect(implementationSignal(substantial)).toBe("substantial");

    const thin = inspectSource("export default function Screen() { return <div>Hi</div>; }");
    expect(implementationSignal(thin)).toBe("thin");
    expect(implementationSignal(null)).toBe("unmapped");
  });

  it("summarizes mapping, markers, domains, and implementation signals", () => {
    const routes = [
      {
        domain: "ai",
        source: "client/src/pages/AIAgent.tsx",
        implementationSignal: "substantial",
        metrics: { markerCount: 0 },
      },
      {
        domain: "commerce",
        source: null,
        implementationSignal: "unmapped",
        metrics: null,
      },
      {
        domain: "commerce",
        source: "client/src/pages/Checkout.tsx",
        implementationSignal: "needs-review",
        metrics: { markerCount: 2 },
      },
    ];
    expect(summarizeCapabilityAudit(routes)).toEqual({
      routeCount: 3,
      sourceMappedCount: 2,
      sourceMappedRate: 0.6667,
      markerRouteCount: 1,
      markerOccurrences: 2,
      domains: { ai: 1, commerce: 2 },
      implementationSignals: { substantial: 1, unmapped: 1, "needs-review": 1 },
    });
  });
});
