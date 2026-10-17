
import test from "node:test";
import assert from "node:assert/strict";
import { analyzeHistory } from "../src/analyzer.js";

test("analyzes commits and changed files", () => {
  const commits = [
    {
      hash: "abc1",
      author: "Asha",
      date: "2026-10-16",
      message: "Add API",
      files: ["src/api.js", "package.json"]
    },
    {
      hash: "abc2",
      author: "Ravi",
      date: "2026-10-16",
      message: "Fix API",
      files: ["src/api.js"]
    }
  ];

  const result = analyzeHistory(commits);

  assert.equal(result.summary.totalCommits, 2);
  assert.equal(result.summary.totalFiles, 2);
  assert.equal(result.summary.totalDevelopers, 2);

  // The API file changed in both commits.
  assert.equal(result.files[0].file, "src/api.js");
  assert.equal(result.files[0].changes, 2);

  // Both files changed together in one commit.
  assert.equal(result.coupledFiles[0].coChanges, 1);
});


test("handles an empty commit history", () => {
  const result = analyzeHistory([]);

  assert.deepEqual(result.summary, {
    totalCommits: 0,
    totalFiles: 0,
    totalDevelopers: 0
  });

  assert.deepEqual(result.files, []);
  assert.deepEqual(result.developers, []);
  assert.deepEqual(result.coupledFiles, []);
  assert.deepEqual(result.ownership, []);
});
