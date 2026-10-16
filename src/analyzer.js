
export function analyzeHistory(commits) {
  const fileStats = new Map();
  const developerStats = new Map();
  const coChanges = new Map();

  for (const commit of commits) {
    const uniqueFiles = [...new Set(commit.files)];

    // Count each file once per commit.
    for (const file of uniqueFiles) {
      if (!fileStats.has(file)) {
        fileStats.set(file, {
          file,
          changes: 0,
          developers: new Set()
        });
      }

      const stats = fileStats.get(file);
      stats.changes++;
      stats.developers.add(commit.author);

      if (!developerStats.has(commit.author)) {
        developerStats.set(commit.author, {
          author: commit.author,
          commits: 0,
          filesChanged: 0
        });
      }

      const developer = developerStats.get(commit.author);
      developer.filesChanged++;
    }

    // Count commits separately from file touches.
    if (developerStats.has(commit.author)) {
      developerStats.get(commit.author).commits++;
    }

    // Count pairs of files changed in the same commit.
    for (let i = 0; i < uniqueFiles.length; i++) {
      for (let j = i + 1; j < uniqueFiles.length; j++) {
        const pair = [uniqueFiles[i], uniqueFiles[j]].sort();
        const key = JSON.stringify(pair);
        coChanges.set(key, (coChanges.get(key) || 0) + 1);
      }
    }
  }

  const files = [...fileStats.values()]
    .map((item) => ({
      file: item.file,
      changes: item.changes,
      developers: [...item.developers].sort(),
      developerCount: item.developers.size
    }))
    .sort((a, b) => b.changes - a.changes);

  const developers = [...developerStats.values()]
    .sort((a, b) => b.commits - a.commits);

  const coupledFiles = [...coChanges.entries()]
    .map(([key, count]) => ({
      files: JSON.parse(key),
      coChanges: count
    }))
    .sort((a, b) => b.coChanges - a.coChanges);

  // Measure how concentrated each file's changes are.
  const ownership = files.map((file) => {
    const touches = new Map();

    for (const commit of commits) {
      if (commit.files.includes(file.file)) {
        touches.set(
          commit.author,
          (touches.get(commit.author) || 0) + 1
        );
      }
    }

    const ranked = [...touches.entries()]
      .sort((a, b) => b[1] - a[1]);

    const topDeveloper = ranked[0];

    return {
      file: file.file,
      topDeveloper: topDeveloper?.[0] ?? null,
      topDeveloperChanges: topDeveloper?.[1] ?? 0,
      ownershipShare: file.changes
        ? (topDeveloper?.[1] ?? 0) / file.changes
        : 0
    };
  });

  return {
    summary: {
      totalCommits: commits.length,
      totalFiles: files.length,
      totalDevelopers: developers.length
    },
    files,
    developers,
    coupledFiles,
    ownership
  };
}
