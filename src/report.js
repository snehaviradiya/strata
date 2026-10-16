
import chalk from "chalk";

export function printReport(result, repoPath) {
  console.log("\n" + chalk.green.bold("🌿 STRATA"));
  console.log(chalk.gray("Git Repository History Analysis"));
  console.log(chalk.gray(`Repository: ${repoPath}`));

  console.log("\n" + chalk.cyan.bold("SUMMARY"));
  console.log(`Commits analyzed: ${result.summary.totalCommits}`);
  console.log(`Files changed: ${result.summary.totalFiles}`);
  console.log(`Developers: ${result.summary.totalDevelopers}`);

  console.log("\n" + chalk.cyan.bold("MOST CHANGED FILES"));

  for (const file of result.files.slice(0, 10)) {
    console.log(
      `${chalk.yellow(String(file.changes).padStart(4))}  ${file.file}`
    );
  }

  console.log("\n" + chalk.cyan.bold("TOP CONTRIBUTORS"));

  for (const dev of result.developers.slice(0, 5)) {
    console.log(
      `${dev.author}: ${dev.commits} commits, ` +
      `${dev.filesChanged} file touches`
    );
  }

  console.log("\n" + chalk.cyan.bold("FILES OFTEN CHANGED TOGETHER"));

  for (const pair of result.coupledFiles.slice(0, 5)) {
    console.log(
      `${pair.files.join(" + ")} (${pair.coChanges} commits)`
    );
  }

  console.log("\n" + chalk.cyan.bold("CONCENTRATED OWNERSHIP"));

  for (const item of result.ownership
    .filter((entry) => entry.ownershipShare >= 0.7)
    .slice(0, 5)) {
    console.log(
      `${item.file}: ${item.topDeveloper} ` +
      `(${Math.round(item.ownershipShare * 100)}%)`
    );
  }

  console.log(chalk.green("\nAnalysis complete.\n"));
}
