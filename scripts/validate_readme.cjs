const fs = require("fs");
const text = fs.readFileSync("README.md", "utf8");
const local = [...text.matchAll(/\]\((\.\/[^)]+)\)/g)].map((match) => match[1]);
const missing = local.filter((path) => !fs.existsSync(path.slice(2)));
const headings = (text.match(/^#{1,6} /gm) || []).length;
const tableRows = (text.match(/^\|.*\|$/gm) || []).length;
const result = {
  lines: text.split(/\n/).length,
  headings,
  tableRows,
  localLinks: local.length,
  missingLinks: missing,
};
console.log(JSON.stringify(result, null, 2));
if (missing.length > 0) process.exit(1);
