from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "client/src/pages"
RISK = re.compile(r"mock|demo|hard-coded|hardcoded|synthetic|fake|success rate|live market|APY|APR|TVL|hashrate|balance|portfolio|wallet|exchange|staking|mining|yield|invest|transaction", re.I)
GATE = re.compile(r"UnavailableFeature")
for path in sorted(ROOT.glob("*.tsx")):
    text = path.read_text(errors="ignore")
    if RISK.search(text) and not GATE.search(text):
        print(path.name)
