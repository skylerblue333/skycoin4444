from pathlib import Path
import csv
import re

ROOT = Path(__file__).resolve().parents[1] / "client/src/pages"
OUTPUT = Path(__file__).resolve().parents[1] / "docs/hard-coded-money-audit.csv"
MONEY = re.compile(r"\$\s?[0-9][0-9,]*(?:\.[0-9]+)?")
FINANCE = re.compile(r"\b(?:APY|APR|TVL|USD|USDT|BTC|ETH|SOL|SKY444|portfolio|wallet|balance|staking|mining|yield|exchange|trading|invest|revenue|profit|volume|market cap|hashrate|reward)\b", re.I)
PERCENT_FINANCE = re.compile(r"[0-9]+(?:\.[0-9]+)?\s?%.*(?:APY|APR|yield|return|profit|success|uptime|volume|market|staking|reward)|(?:APY|APR|yield|return|profit|success|uptime|volume|market|staking|reward).*?[0-9]+(?:\.[0-9]+)?\s?%", re.I)
EDUCATIONAL = re.compile(r"education|educational|example|documentation|demo|test|fixture|placeholder|unavailable", re.I)
CSS_NOISE = re.compile(r"className|style=|linear-gradient|translate|opacity|width:|height:|rounded|top:|left:", re.I)
rows = []
for path in sorted(ROOT.glob("*.tsx")):
    rel = path.relative_to(Path(__file__).resolve().parents[1])
    for line_no, line in enumerate(path.read_text(errors="ignore").splitlines(), 1):
        if CSS_NOISE.search(line) and not MONEY.search(line):
            continue
        matches = MONEY.findall(line)
        if PERCENT_FINANCE.search(line):
            matches.extend(re.findall(r"[0-9]+(?:\.[0-9]+)?\s?%", line))
        if not matches or not FINANCE.search(line):
            continue
        purpose = "static UI or data claim"
        classification = "REVIEW-REQUIRED"
        remediation = "Verify authoritative source; otherwise remove or replace with truthful unavailable/empty state."
        if EDUCATIONAL.search(line):
            purpose = "possible educational/example text"
            classification = "EDUCATIONAL-OR-DOCUMENTATION-REVIEW"
            remediation = "Confirm context is clearly labeled educational/example content and not production telemetry."
        rows.append({
            "route_or_file": str(rel),
            "line": line_no,
            "hard_coded_value": "; ".join(matches),
            "source_text": line.strip()[:240],
            "purpose": purpose,
            "classification": classification,
            "remediation": remediation,
            "validation_result": "inventory-generated; manual review required",
        })
with OUTPUT.open("w", newline="") as handle:
    writer = csv.DictWriter(handle, fieldnames=list(rows[0]) if rows else ["route_or_file"])
    writer.writeheader()
    writer.writerows(rows)
print(f"rows={len(rows)}")
print(f"output={OUTPUT}")
