
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

// Check that duplicate files are counted only once per commit.
test("counts a file only once in a commit", () => {
  const commits = [
    {
      author: "Sneha",
      files: ["src/app.js", "src/app.js", "README.md"]
    }
  ];

  const result = analyzeHistory(commits);

  assert.equal(result.summary.totalCommits, 1);
  assert.equal(result.summary.totalFiles, 2);
  assert.equal(result.summary.totalDevelopers, 1);

  const appFile = result.files.find(
    (file) => file.file === "src/app.js"
  );

  assert.equal(appFile.changes, 1);
});

// Check ownership when one developer changes a file.
test("calculates concentrated file ownership", () => {
  const commits = [
    { author: "Sneha", files: ["src/app.js"] },
    { author: "Sneha", files: ["src/app.js"] },
    { author: "Alex", files: ["src/app.js"] }
  ];

  const result = analyzeHistory(commits);
  const ownership = result.ownership[0];

  assert.equal(ownership.file, "src/app.js");
  assert.equal(ownership.topDeveloper, "Sneha");
  assert.equal(ownership.topDeveloperChanges, 2);
  assert.equal(ownership.ownershipShare, 2 / 3);
});

// Check that files changed together are detected.
test("detects files changed together", () => {
  const commits = [
    { author: "Sneha", files: ["src/app.js", "src/api.js"] },
    { author: "Alex", files: ["src/app.js", "src/api.js"] }
  ];

  const result = analyzeHistory(commits);

  assert.equal(result.coupledFiles.length, 1);
  assert.equal(result.coupledFiles[0].coChanges, 2);
});