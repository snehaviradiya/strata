# Strata — Git Repository History Analyzer

Strata is a command-line tool that analyzes Git repository history to help developers understand how a codebase changes over time.

## Features

- Analyze Git commit history
- Identify frequently modified files
- Find files that are often changed together
- Summarize developer contributions
- Identify files with concentrated ownership
- Display a coloured terminal report
- Export analysis as JSON
- Generate standalone HTML reports
- Validate repository paths and commit limits

## Requirements

- Node.js
- npm
- Git

## Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/snehaviradiya/strata.git
cd strata
npm install
```

## Usage

Analyze the current repository:

```bash
npm start -- .
```

Analyze another Git repository:

```bash
npm start -- ./test-repo
```

Analyze a maximum of 200 commits:

```bash
npm start -- ./test-repo --limit 200
```

Export a JSON report:

```bash
npm start -- ./test-repo --json report.json
```

Export an HTML report:

```bash
npm start -- ./test-repo --html report.html
```

Generate both reports:

```bash
npm start -- ./test-repo --json report.json --html report.html
```

## Analysis Metrics

- **File changes:** Number of analyzed commits in which each file was modified.
- **Co-changes:** Number of commits in which a pair of files was modified together.
- **Developer contributions:** Commit counts and file touches for each author.
- **Ownership concentration:** Share of a file's recorded changes associated with its most frequent contributor.

These metrics describe historical patterns and should not be treated as definitive proof of code quality or individual expertise.

## Testing

Run the automated tests:

```bash
npm test
```

## License

MIT


## Test Coverage

The automated test suite covers:

- Git history analysis and changed-file statistics
- Empty commit history
- JSON report generation and output validation
- HTML report generation
- HTML escaping of special characters
- Rejection of invalid commit limits
- Rejection of nonexistent repository paths

Run all tests with:

```bash
npm test
```
