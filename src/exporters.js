
import fs from "node:fs";
import path from "node:path";

// Save analysis results as formatted JSON.
export function exportJson(result, outputPath) {
  const absolutePath = path.resolve(outputPath);

  fs.mkdirSync(path.dirname(absolutePath), {
    recursive: true
  });

  fs.writeFileSync(
    absolutePath,
    JSON.stringify(result, null, 2),
    "utf8"
  );

  console.log(`JSON report saved to: ${absolutePath}`);
}

// Escape text before placing it in HTML.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// Generate a standalone HTML report.
export function exportHtml(result, outputPath) {
  const absolutePath = path.resolve(outputPath);

  const fileRows = result.files.map((file) => `
    <tr>
      <td>${escapeHtml(file.file)}</td>
      <td>${file.changes}</td>
      <td>${file.developerCount}</td>
    </tr>
  `).join("");

  const developerRows = result.developers.map((dev) => `
    <tr>
      <td>${escapeHtml(dev.author)}</td>
      <td>${dev.commits}</td>
      <td>${dev.filesChanged}</td>
    </tr>
  `).join("");

  const pairRows = result.coupledFiles.map((pair) => `
    <tr>
      <td>${pair.files.map(escapeHtml).join(" + ")}</td>
      <td>${pair.coChanges}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Strata Repository Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 1000px;
      margin: 40px auto;
      padding: 0 20px;
      background: #f4f6f8;
      color: #202938;
    }
    h1 { color: #087f5b; }
    h2 { margin-top: 32px; }
    .cards {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      flex: 1;
      min-width: 150px;
      box-shadow: 0 2px 8px #0001;
    }
    .number { font-size: 28px; font-weight: bold; }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      overflow-wrap: anywhere;
    }
    th { background: #e6f4ef; }
  </style>
</head>
<body>
  <h1>Strata Repository Report</h1>
  <p>Git repository history analysis</p>

  <div class="cards">
    <div class="card">
      Commits
      <div class="number">${result.summary.totalCommits}</div>
    </div>
    <div class="card">
      Files changed
      <div class="number">${result.summary.totalFiles}</div>
    </div>
    <div class="card">
      Developers
      <div class="number">${result.summary.totalDevelopers}</div>
    </div>
  </div>

  <h2>Most Changed Files</h2>
  <table>
    <tr><th>File</th><th>Changes</th><th>Developers</th></tr>
    ${fileRows || "<tr><td colspan='3'>No files found</td></tr>"}
  </table>

  <h2>Developer Contributions</h2>
  <table>
    <tr><th>Developer</th><th>Commits</th><th>File touches</th></tr>
    ${developerRows || "<tr><td colspan='3'>No developers found</td></tr>"}
  </table>

  <h2>Files Changed Together</h2>
  <table>
    <tr><th>File pair</th><th>Co-changes</th></tr>
    ${pairRows || "<tr><td colspan='2'>No pairs found</td></tr>"}
  </table>
</body>
</html>`;

  fs.mkdirSync(path.dirname(absolutePath), {
    recursive: true
  });

  fs.writeFileSync(absolutePath, html, "utf8");
  console.log(`HTML report saved to: ${absolutePath}`);
}
