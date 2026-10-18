
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";

// Locate the CLI entry point.
const cliPath = path.resolve("src/cli.js");

// Test 1: Reject a zero commit limit.
test("rejects a zero commit limit", () => {
  const result = spawnSync(
    process.execPath,
    [cliPath, "./test-repo", "--limit", "0"],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Limit must be a positive integer/);
});

// Test 2: Reject a non-numeric commit limit.
test("rejects a non-numeric commit limit", () => {
  const result = spawnSync(
    process.execPath,
    [cliPath, "./test-repo", "--limit", "abc"],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Limit must be a positive integer/);
});

// Test 3: Reject a repository path that does not exist.
test("rejects a repository path that does not exist", () => {
  const result = spawnSync(
    process.execPath,
    [cliPath, "./path-that-does-not-exist"],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Strata error:/);
});

// Test 4: Display CLI help information.
test("displays help information", () => {
  const result = spawnSync(
    process.execPath,
    [cliPath, "--help"],
    { encoding: "utf8" }
  );

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage: strata/);
  assert.match(result.stdout, /Analyze Git repository history/);
  assert.match(result.stdout, /--limit/);
  assert.match(result.stdout, /--json/);
  assert.match(result.stdout, /--html/);
});
