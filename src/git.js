
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// Run Git without passing user input through a shell.
function runGit(args, repoPath) {
  return execFileSync("git", args, {
    cwd: repoPath,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

export function validateRepository(repoPath) {
  const absolutePath = path.resolve(repoPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Path does not exist: ${absolutePath}`);
  }

  // Confirm that the path belongs to a Git work tree.
  runGit(["rev-parse", "--is-inside-work-tree"], absolutePath);

  return absolutePath;
}

export function getCommits(repoPath, limit = 100) {
  // Use a separator to distinguish commit metadata fields.
  const format = "%H%x1f%an%x1f%aI%x1f%s";

  const output = runGit(
    [
      "log",
      `-n`,
      String(limit),
      `--format=${format}`,
      "--name-only"
    ],
    repoPath
  );

  if (!output.trim()) return [];

  // Each commit starts with its hash and metadata.
  const blocks = output.split(
    /(?=^[0-9a-f]{40,64}\x1f)/m
  );

  return blocks
    .map((block) => {
      const lines = block.trim().split("\n");
      const metadata = lines.shift();

      if (!metadata || !metadata.includes("\x1f")) {
        return null;
      }

      const [hash, author, date, message] =
        metadata.split("\x1f");

      return {
        hash,
        author,
        date,
        message,
        files: lines
          .map((file) => file.trim())
          .filter(Boolean)
      };
    })
    .filter(Boolean);
}
