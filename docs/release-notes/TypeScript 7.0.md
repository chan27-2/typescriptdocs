---
title: TypeScript 7.0

oneline: TypeScript 7.0 Release Notes
---

TypeScript 7.0 is the first stable release built on TypeScript's **native compiler** — a faithful port of the existing TypeScript codebase into Go. The language itself is unchanged: 7.0 checks the same types, reports the same errors, and emits the same JavaScript as 6.0. What changes is how fast it does it, and which long-deprecated compiler options survive.

Everything deprecated in [TypeScript 6.0](/release-notes/TypeScript%206.0) is now removed. If your project builds cleanly on 6.0 with no deprecation warnings, it should build on 7.0.

## The Native Compiler

The compiler was previously a self-hosted TypeScript program that shipped as JavaScript and ran on Node.js. In 7.0 it is a native binary compiled from Go. Typical full builds are **8–12x faster**, from two independent sources:

- **~3–4x** from executing as a native binary instead of on a JavaScript VM.
- **~2–3x** from real shared-memory parallelism — type-checking work is split across cores using goroutines, which the JavaScript implementation could not do.

Full-build times measured on real codebases:

| Project | TypeScript 6.0 | TypeScript 7.0 | Speedup |
| --- | --- | --- | --- |
| VS Code | 125.7s | 10.6s | 11.9x |
| Sentry | 139.8s | 15.7s | 8.9x |
| Bluesky | 24.3s | 2.8s | 8.7x |
| Playwright | 12.8s | 1.47s | 8.7x |
| TLDraw | 11.2s | 1.46s | 7.7x |

Peak memory use is also down — VS Code from 5.2GB to 4.2GB (-18%), Bluesky from 1.8GB to 1.3GB (-26%), Sentry from 4.9GB to 4.6GB (-6%).

Editor responsiveness improves for the same reason. Loading the VS Code codebase and reporting errors across the project went from 17.5s to 1.3s — roughly 13x faster.

## Controlling Parallelism

Because type-checking now runs across multiple workers, 7.0 adds flags to control how many:

- `--checkers <n>` — number of type-checking workers. Defaults to `4`.
- `--builders <n>` — parallelism across project references in `--build` mode.
- `--singleThreaded` — disables parallelism entirely. Useful for benchmarking, debugging, and constrained CI runners.

Raising `--checkers` past the default helps on large projects with many cores. On the VS Code codebase, `--checkers 8` reaches a 16.7x speedup over 6.0 instead of 11.9x. Small projects generally see nothing, since there isn't enough work to distribute.

```sh
# Use 8 type-checking workers
tsc --checkers 8

# Reproducible, sequential run
tsc --singleThreaded
```

## Rebuilt Watch Mode

`--watch` sits on a new foundation in 7.0: Parcel's file-watcher, ported to Go. Previously the native watcher required a C++ toolchain to build, which made it impractical to ship. Going through Go removes that constraint, so 7.0 gets real OS-level file watching on every supported platform, with lower idle CPU and memory than the 6.0 polling-and-fallback approach.

## Unicode-Correct Template Literal Types

The Go implementation iterates strings by Unicode code point rather than by UTF-16 code unit, which fixes a long-standing class of bugs where template literal type inference split surrogate pairs:

```ts
type HeadTail<S> = S extends `${infer Head}${infer Tail}` ? [Head, Tail] : never;

// TypeScript 6.0: ["\ud83d", "\ude00abc"]  — a broken half-emoji
// TypeScript 7.0: ["😀", "abc"]
type Result = HeadTail<"😀abc">;
```

Any type-level string manipulation over non-BMP characters (emoji, many CJK extensions, mathematical alphanumerics) now behaves the way you would expect.

## No Stable Programmatic API Yet

TypeScript 7.0 ships **without a stable programmatic API**. The `typescript` package no longer exports the classic compiler API (`createProgram`, `ScriptTarget`, the `ts` namespace, and so on) from its main entry point; only `version` and a set of explicitly-unstable `typescript/unstable/*` entry points are available. The stable API is expected in 7.1.

That has a concrete consequence: tools built on the compiler API do not work with 7.0 yet. As of this release that includes:

- `typescript-eslint`
- Vue, Svelte, Astro, and MDX language tooling
- Angular template type-checking

These workflows still need TypeScript 6.0. This is also why documentation sites, ESLint setups, and build tooling that `import` from `"typescript"` should stay on 6.x for now.

## Installing 6.0 and 7.0 Side by Side

Because 7.0 covers CLI type-checking but not yet the API, running both is a normal setup during the transition. TypeScript 6.0 is republished under `@typescript/typescript6`:

```sh
npm install -D typescript@npm:@typescript/typescript6
```

Or pin both explicitly:

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@^7.0.2",
    "typescript": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

A common arrangement for Angular, Vue, or ESLint-heavy projects is to run `tsc` from 7.0 in CI for fast type-checking, while the editor and lint step continue to use 6.0.

## Breaking Changes

### Default Option Changes

| Option | 6.0 default | 7.0 default |
| --- | --- | --- |
| `strict` | `false` | `true` |
| `module` | inferred from `target` | `esnext` |
| `target` | `es5` | current stable ES version |
| `noUncheckedSideEffectImports` | `false` | `true` |
| `rootDir` | inferred from input files | `./` |
| `types` | `["*"]` | `[]` |
| `stableTypeOrdering` | `false` | `true` — cannot be disabled |

Each of these except `stableTypeOrdering` can be set back explicitly in `tsconfig.json`. `--stableTypeOrdering` is no longer a flag you control; the native checker's deterministic content-based type ordering is the only behavior.

`rootDir` defaulting to the config directory is the change most likely to surprise you. The symptom is output landing in `./dist/src/index.js` instead of `./dist/index.js`:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["./src"]
}
```

And `types: []` means global-affecting `@types` packages must be listed:

```json
{
  "compilerOptions": {
    "types": ["node", "jest"]
  }
}
```

`"types": ["*"]` restores the old "everything in `node_modules/@types`" behavior, at the old cost.

### Removed Options

These were deprecated in 6.0 — where `"ignoreDeprecations": "6.0"` silenced the warning — and are hard errors in 7.0. `ignoreDeprecations` no longer suppresses them.

- `target: es5` — ES2015 is the lowest supported target.
- `downlevelIteration` — only ever affected ES5 emit.
- `moduleResolution: node` / `node10` — migrate to `nodenext` or `bundler`.
- `moduleResolution: classic` — migrate to `nodenext` or `bundler`.
- `module: amd`, `umd`, `systemjs`, `none` — use ESM or a bundler.
- `baseUrl` — inline the prefix into each `paths` entry instead.
- `esModuleInterop: false` and `allowSyntheticDefaultImports: false` — safer interop is always on.
- `alwaysStrict: false` — all code is strict mode.
- `outFile` — use a bundler.
- `module Foo { }` namespace syntax — write `namespace Foo { }`. Ambient `declare module "pkg"` is unaffected.
- `import x from "./f.json" asserts { type: "json" }` — use `with` instead of `asserts`.
- `/// <reference no-default-lib="true" />` — use `--noLib` or `--libReplacement`.
- Passing file paths on the CLI while a `tsconfig.json` exists — pass `--ignoreConfig` to opt out of the config.

The experimental [`ts5to6`](https://github.com/andrewbranch/ts5to6) codemod handles many of these mechanically.

### JavaScript File Checking

Checking `.js` files with `checkJs` or `allowJs` is stricter in 7.0. Several tolerated-but-undocumented JSDoc behaviors are gone:

- A value can't be used where a type is expected — write `typeof someValue`.
- `@enum` is no longer special-cased — use `@typedef`.
- A bare `?` is not a valid type — use `any`.
- `@class` no longer turns a function into a constructor — use a `class` declaration.
- Postfix `!` is unsupported — write `T`, not `T!`.
- Type names must appear in `@typedef` tag syntax.
- Closure-style function type syntax is unsupported — use TypeScript's shorthands.

## Upgrading

```sh
npm install -D typescript
```

VS Code users can install the dedicated extension from the marketplace; Visual Studio enables 7.0 automatically based on the workspace's installed version. Nightly builds track `typescript@next`.

The recommended path is to land on 6.0 first, clear every deprecation warning there, then move to 7.0 — at which point the upgrade is usually just the install. Keep 6.0 around for anything that touches the compiler API until 7.1 ships the stable one.
