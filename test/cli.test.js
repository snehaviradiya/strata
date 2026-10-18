
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

// Locate the CLI entry point.
const cliPath = path.resolve("src/cli.js");
const repoPath = path.resolve("test/test-repo");

// Check invalid commit limits.
test("rejects a zero commit limit", () => {
  const result = spawnSync(
    process.execPath,
    [cliPath, repoPath, "--limit", "0"],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Limit must be a positive integer/);
});

test("rejects a non-numeric commit limit", () => {
  const result = spawnSync(
    process.execPath,
    [cliPath, repoPath, "--limit", "abc"],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Limit must be a positive integer/);
});

// Check invalid repository paths.
test("rejects a repository path that does not exist", () => {
  const result = spawnSync(
    process.execPath,
    [cliPath, "./path-that-does-not-exist"],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Strata error:/);
});

// Check that the CLI prints its report successfully.
test("analyzes a valid repository", () => {
  const result = spawnSync(
    process.execPath,
    [cliPath, repoPath],
    { encoding: "utf8" }
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /SUMMARY/);
  assert.match(result.stdout, /Analysis complete/);
});

// Check JSON export.
test("exports a JSON report", (t) => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), "strata-json-"));
  t.after(() => fs.rmSync(folder, { recursive: true, force: true }));

  const output = path.join(folder, "report.json");
  const result = spawnSync(
    process.execPath,
    [cliPath, repoPath, "--json", output],
    { encoding: "utf8" }
  );

  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(output));

  const report = JSON.parse(fs.readFileSync(output, "utf8"));
  assert.ok(report.summary);
});

// Check HTML export.
test("exports an HTML report", (t) => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), "strata-html-"));
  t.after(() => fs.rmSync(folder, { recursive: true, force: true }));

  const output = path.join(folder, "report.html");
  const result = spawnSync(
    process.execPath,
    [cliPath, repoPath, "--html", output],
    { encoding: "utf8" }
  );

  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(output));

  const html = fs.readFileSync(output, "utf8");
  assert.match(html, /Strata Repository Report/);
});
