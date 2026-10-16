
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { exportJson, exportHtml } from "../src/exporters.js";

// Sample analysis result for testing both exporters.
const sampleResult = {
  summary: {
    totalCommits: 2,
    totalFiles: 2,
    totalDevelopers: 1
  },
  files: [
    {
      file: "src/api.js",
      changes: 2,
      developerCount: 1
    }
  ],
  developers: [
    {
      author: "Asha",
      commits: 2,
      filesChanged: 2
    }
  ],
  coupledFiles: [
    {
      files: ["src/api.js", "package.json"],
      coChanges: 1
    }
  ],
  ownership: []
};

// Check that JSON export creates valid JSON.
test("exports analysis as JSON", (t) => {
  const folder = fs.mkdtempSync(
    path.join(os.tmpdir(), "strata-json-")
  );
  t.after(() => fs.rmSync(folder, { recursive: true, force: true }));

  const output = path.join(folder, "report.json");
  exportJson(sampleResult, output);

  assert.equal(fs.existsSync(output), true);

  const saved = JSON.parse(fs.readFileSync(output, "utf8"));
  assert.deepEqual(saved, sampleResult);
});

// Check that HTML export creates a readable report.
test("exports analysis as HTML", (t) => {
  const folder = fs.mkdtempSync(
    path.join(os.tmpdir(), "strata-html-")
  );
  t.after(() => fs.rmSync(folder, { recursive: true, force: true }));

  const output = path.join(folder, "report.html");
  exportHtml(sampleResult, output);

  assert.equal(fs.existsSync(output), true);

  const html = fs.readFileSync(output, "utf8");

  assert.match(html, /Strata Repository Report/);
  assert.match(html, /src\/api\.js/);
  assert.match(html, /Developer Contributions/);
});
