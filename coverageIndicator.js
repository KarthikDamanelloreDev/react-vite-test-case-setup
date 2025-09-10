import fs from "fs";
import path from "path";

const coverageSummaryPath = path.resolve(
  "./html/coverage/coverage-summary.json"
);

if (!fs.existsSync(coverageSummaryPath)) {
  console.log("Coverage summary not found. Run `npm run coverage` first.");
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(coverageSummaryPath, "utf-8")).total;

function indicator(percent) {
  if (percent < 30) return "🔴 Low";
  if (percent < 60) return "🟠 Medium";
  if (percent < 80) return "🟡 Good";
  if (percent <= 100) return "🟢 Very Good";
  return "⚪ Unknown";
}

console.log("\n📊 Coverage Summary:");
console.log(
  `Statements: ${summary.statements.pct}% - ${indicator(
    summary.statements.pct
  )}`
);
console.log(
  `Branches  : ${summary.branches.pct}% - ${indicator(summary.branches.pct)}`
);
console.log(
  `Functions : ${summary.functions.pct}% - ${indicator(summary.functions.pct)}`
);
console.log(
  `Lines     : ${summary.lines.pct}% - ${indicator(summary.lines.pct)}\n`
);
