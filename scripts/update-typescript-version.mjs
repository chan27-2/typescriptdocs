#!/usr/bin/env node
// Checks npm for the latest stable TypeScript release and, if newer than
// anything in docs/release-notes/, scaffolds a release-notes file, bumps
// the homepage's "Latest Release" banner, and bumps the typescript
// devDependency in package.json. Designed to run on a cron from CI — see
// .github/workflows/update-typescript.yaml. The resulting branch should be
// reviewed by a human (the release-notes file is a best-effort scaffold;
// the canonical Microsoft post may have more detail).

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RELEASE_NOTES_DIR = join(REPO_ROOT, "docs", "release-notes");
const INDEX_MD = join(REPO_ROOT, "docs", "index.md");
const PACKAGE_JSON = join(REPO_ROOT, "package.json");

const VERSION_FILE_RE = /^TypeScript (\d+)\.(\d+)\.md$/;

function parseSemver(v) {
  // strips suffixes like -rc, -beta, -dev
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3], raw: v };
}

function isStable(v) {
  return /^\d+\.\d+\.\d+$/.test(v);
}

function cmpVersions(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

async function fetchLatestStableFromNpm() {
  const res = await fetch("https://registry.npmjs.org/typescript", {
    headers: { Accept: "application/vnd.npm.install-v1+json" },
  });
  if (!res.ok) throw new Error(`npm registry returned ${res.status}`);
  const data = await res.json();

  const latest = data["dist-tags"]?.latest;
  if (!latest || !isStable(latest)) {
    // fall back: scan all version keys, take the highest stable
    const stables = Object.keys(data.versions || {})
      .filter(isStable)
      .map(parseSemver)
      .sort(cmpVersions);
    if (stables.length === 0) throw new Error("no stable versions on npm");
    return stables[stables.length - 1];
  }
  return parseSemver(latest);
}

function readExistingMajorMinors() {
  if (!existsSync(RELEASE_NOTES_DIR)) return [];
  return readdirSync(RELEASE_NOTES_DIR)
    .map(f => f.match(VERSION_FILE_RE))
    .filter(Boolean)
    .map(m => ({ major: +m[1], minor: +m[2] }));
}

function buildScaffoldedReleaseNotes(major, minor) {
  const version = `${major}.${minor}`;
  const handbookUrl = `https://www.typescriptlang.org/docs/handbook/release-notes/typescript-${major}-${minor}.html`;
  const blogUrl = `https://devblogs.microsoft.com/typescript/announcing-typescript-${major}-${minor}/`;

  return `---
title: TypeScript ${version}

oneline: TypeScript ${version} Release Notes
---

> **This page is auto-scaffolded.** TypeScript ${version} was detected by our
> release watcher, but the full notes have not been written yet. In the meantime,
> please consult:
>
> - [Official release notes](${handbookUrl})
> - [Announcement blog post](${blogUrl})
>
> Contributions to flesh out this page are very welcome — see
> [CONTRIBUTING.md](https://github.com/chan27-2/typescriptdocs/blob/main/CONTRIBUTING.md).
`;
}

function bumpHomepageBanner(major, minor) {
  const version = `${major}.${minor}`;
  const src = readFileSync(INDEX_MD, "utf8");

  // Targeted replacement: rewrite only the version reference + the link inside
  // the existing latest-release block, instead of trying to rewrite the entire
  // block (which is fragile because the block has 3 nested </div>s and any
  // copy editing of the surrounding markup would break a block-level regex).
  const versionRe = /(<p>TypeScript <strong>)\d+\.\d+(<\/strong>[^<]*<\/p>)/;
  const linkRe = /(<a href="\/release-notes\/TypeScript%20)\d+\.\d+(" class="cta-button">[^<]*<\/a>)/;

  if (!versionRe.test(src) || !linkRe.test(src)) {
    console.warn("[update-ts] could not find latest-release markers in index.md");
    return false;
  }

  const next = src
    .replace(versionRe, `$1${version}$2`)
    .replace(linkRe, `$1${version}$2`);

  if (next === src) return false;
  writeFileSync(INDEX_MD, next);
  return true;
}

function bumpPackageJson(rawVersion) {
  const src = readFileSync(PACKAGE_JSON, "utf8");
  const pkg = JSON.parse(src);
  if (!pkg.devDependencies?.typescript) return false;
  const next = `^${rawVersion}`;
  if (pkg.devDependencies.typescript === next) return false;
  pkg.devDependencies.typescript = next;
  // preserve trailing newline + 2-space indent (matches existing file)
  writeFileSync(PACKAGE_JSON, JSON.stringify(pkg, null, 2) + "\n");
  return true;
}

async function main() {
  const latest = await fetchLatestStableFromNpm();
  if (!latest) {
    console.error("[update-ts] could not determine latest version");
    process.exit(1);
  }
  console.log(`[update-ts] latest stable on npm: ${latest.raw}`);

  const existing = readExistingMajorMinors();
  const hasMajorMinor = existing.some(
    e => e.major === latest.major && e.minor === latest.minor
  );

  const changes = [];

  if (!hasMajorMinor) {
    const file = join(RELEASE_NOTES_DIR, `TypeScript ${latest.major}.${latest.minor}.md`);
    writeFileSync(file, buildScaffoldedReleaseNotes(latest.major, latest.minor));
    changes.push(`scaffold release notes for ${latest.major}.${latest.minor}`);
  }

  if (bumpHomepageBanner(latest.major, latest.minor)) {
    changes.push(`bump homepage banner to ${latest.major}.${latest.minor}`);
  }

  if (bumpPackageJson(latest.raw)) {
    changes.push(`bump typescript devDependency to ^${latest.raw}`);
  }

  if (changes.length === 0) {
    console.log("[update-ts] already up to date");
    // exit code 0 with no changes — CI will detect a clean tree
    return;
  }

  for (const c of changes) console.log(`[update-ts] ${c}`);

  // Emit a machine-readable summary so the CI workflow can use it.
  const summary = {
    latest: latest.raw,
    majorMinor: `${latest.major}.${latest.minor}`,
    changes,
  };
  console.log(`::set-output name=summary::${JSON.stringify(summary)}`);
  if (process.env.GITHUB_OUTPUT) {
    const fs = await import("node:fs");
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `summary=${JSON.stringify(summary)}\n` +
        `latest=${latest.raw}\n` +
        `major_minor=${latest.major}.${latest.minor}\n` +
        `has_changes=true\n`
    );
  }
}

main().catch(err => {
  console.error("[update-ts]", err);
  process.exit(1);
});
