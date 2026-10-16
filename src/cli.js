
import { Command } from "commander";
import { validateRepository, getCommits } from "./git.js";
import { analyzeHistory } from "./analyzer.js";
import { printReport } from "./report.js";
import { exportJson, exportHtml } from "./exporters.js";

const program = new Command();

program
  .name("strata")
  .description("Analyze Git repository history")
  .version("1.0.0")
  .argument("[path]", "Path to a Git repository", ".")
  .option("-n, --limit <number>", "Number of commits", "100")
  .option("--json <file>", "Export analysis as JSON")
  .option("--html <file>", "Export analysis as HTML")
  .action((repoPath, options) => {
    try {
      const limit = Number(options.limit);

      // Validate the commit limit.
      if (!Number.isInteger(limit) || limit < 1) {
        throw new Error("Limit must be a positive integer.");
      }

      // Read and analyze Git history.
      const validPath = validateRepository(repoPath);
      const commits = getCommits(validPath, limit);
      const result = analyzeHistory(commits);

      printReport(result, validPath);

      // Generate requested exports.
      if (options.json) {
        exportJson(result, options.json);
      }

      if (options.html) {
        exportHtml(result, options.html);
      }
    } catch (error) {
      console.error(`\nStrata error: ${error.message}\n`);
      process.exitCode = 1;
    }
  });

program.parse();
