
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";

// Locate the CLI entry point.
const cliPath = path.resolve("src/cli.js");

test("rejects a zero commit limit", () => {
  const result = spawnSync(
    process.execPath,
    [cliPath, "./test-repo", "--limit", "0"],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Limit must be a positive integer/);
});

test("rejects a non-numeric commit limit", () => {
  const result = spawnSync(
    process.execPath,
    [cliPath, "./test-repo", "--limit", "abc"],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Limit must be a positive integer/);
});
