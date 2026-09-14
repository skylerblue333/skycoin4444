import ControlledBetaWorkbench from "@/components/ControlledBetaWorkbench";
export default function RebalancingTools() {
  return <ControlledBetaWorkbench title="Rebalancing Tools" description="A controlled engineering-beta workbench for evaluating this product area." boundary="No external service, payment, wallet, message, account change, or production claim is executed by this controlled local beta surface." steps={["Review the rebalancing tools goal", "Identify the inputs and expected output", "Check safety, privacy, and accessibility assumptions", "Record a manual tester observation"]} recovery={[{ label: "Home", href: "/" }, { label: "Route Health", href: "/route-health" }]} />;
}
