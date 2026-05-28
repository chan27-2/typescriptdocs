---
title: TypeScript 6.0

oneline: TypeScript 6.0 Release Notes
---

TypeScript 6.0 is a significant transition release, designed to prepare developers for TypeScript 7.0 — a native port of the TypeScript compiler written in Go. While 6.0 maintains full compatibility with your existing TypeScript knowledge and API-compatibility with TypeScript 5.9, it introduces a number of new features, deprecations, and breaking changes that set the stage for 7.0.

## Less Context-Sensitivity on `this`-less Functions

When parameters don't have explicit types written out, TypeScript can usually infer them based on an expected type, or even through other arguments in the same function call.

```ts
declare function callIt<T>(obj: {
  produce: (x: number) => T;
  consume: (y: T) => void;
}): void;

// Works, no issues.
callIt({
  produce: (x: number) => x * 2,
  consume: y => y.toFixed(),
});

// Works, no issues even though the order of the properties is flipped.
callIt({
  consume: y => y.toFixed(),
  produce: (x: number) => x * 2,
});
```

But when the same functions were written using _method syntax_ instead of arrow function syntax, the order would matter:

```ts
callIt({
  consume(y) { return y.toFixed(); },
  //                  ~
  // error: 'y' is of type 'unknown'.
  produce(x: number) { return x * 2; },
});
```

The reason is subtle: method-syntax functions have an implicit `this` parameter, and any usage of `this` could force TypeScript to "pull" on the type of `T`. Arrow functions don't have their own `this`, so they don't have that problem.

TypeScript 6.0 takes this into account when it decides if a function is contextually sensitive. If `this` is never actually used inside the function body, the function is treated as if it had no `this` — meaning it's higher-priority during inference. All of the examples above now work.

## Subpath Imports Starting with `#/`

Node.js [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) let packages declare internal aliases inside their own `package.json`:

```json
{
  "name": "my-package",
  "type": "module",
  "imports": {
    "#root/*": "./dist/*"
  }
}
```

Previously, you always had to write _something_ after the `#`. Bundler conventions like `@/` are common, but Node didn't support a bare `#/` prefix — until recently. Node.js [now supports subpath imports starting with `#/`](https://github.com/nodejs/node/pull/60864):

```json
{
  "imports": {
    "#/*": "./dist/*"
  }
}
```

TypeScript 6.0 now supports this under `nodenext` and `bundler` module resolution.

## Combining `--moduleResolution bundler` with `--module commonjs`

`--moduleResolution bundler` was previously only allowed with `--module esnext` or `--module preserve`. With the deprecation of `--moduleResolution node` (a.k.a. `node10`), allowing `bundler` + `commonjs` is often the most suitable upgrade path for many projects. Projects will usually want to plan a migration toward one of:

- `--module preserve` + `--moduleResolution bundler`
- `--module nodenext`

depending on whether the project is a bundled web app, a Bun app, or a Node.js app.

## The `--stableTypeOrdering` Flag

As part of ongoing work on TypeScript's native port, 6.0 introduces a new `--stableTypeOrdering` flag intended to assist with 6.0-to-7.0 migrations.

TypeScript assigns type IDs in the order types are encountered, and uses these IDs to sort union types and properties. As a result, declaration order can affect declaration emit and, in rare cases, error visibility. TypeScript 7's parallel type checker uses a deterministic, content-based ordering algorithm instead — so the same program always produces the same emit.

`--stableTypeOrdering` makes 6.0 match 7.0's ordering behavior, reducing diffs between the two compilers. Note that it can add up to a 25% slowdown to type-checking — this is a diagnostic flag, not a long-term setting.

If you hit a type error only with `--stableTypeOrdering` enabled, the fix is usually to add an explicit type:

```diff
- someFunctionCall(/*...*/);
+ someFunctionCall<SomeExplicitType>(/*...*/);
```

or annotate a variable:

```diff
- const someVariable = { /*... some complex object ...*/ };
+ const someVariable: SomeExplicitType = { /*... some complex object ...*/ };
  someFunctionCall(someVariable);
```

## `es2025` for `target` and `lib`

TypeScript 6.0 adds `es2025` as an option for both `target` and `lib`. There are no new JavaScript language features at this target, but it includes new types for built-in APIs (e.g. `RegExp.escape`) and moves several declarations from `esnext` into `es2025` (e.g. `Promise.try`, `Iterator` methods, `Set` methods).

## New Types for `Temporal`

The [Temporal proposal](https://github.com/tc39/proposal-temporal) has reached stage 4. TypeScript 6.0 ships built-in types for the Temporal API under `--target esnext`, `"lib": ["esnext"]`, or the more granular `esnext.temporal`:

```ts
let yesterday = Temporal.Now.instant().subtract({ hours: 24 });
let tomorrow = Temporal.Now.instant().add({ hours: 24 });

console.log(`Yesterday: ${yesterday}`);
console.log(`Tomorrow:  ${tomorrow}`);
```

## New "upsert" Methods on `Map` and `WeakMap`

The [upsert proposal](https://github.com/tc39/proposal-upsert) introduces `getOrInsert` and `getOrInsertComputed` on `Map` and `WeakMap`. Both are now typed in the `esnext` lib.

```ts
// Before
let strictValue: unknown;
if (compilerOptions.has("strict")) {
  strictValue = compilerOptions.get("strict");
} else {
  strictValue = true;
  compilerOptions.set("strict", strictValue);
}

// After
let strictValue = compilerOptions.getOrInsert("strict", true);
```

Use `getOrInsertComputed` when the default value is expensive to compute. The callback only runs when the key isn't present:

```ts
someMap.getOrInsertComputed("someKey", () => computeSomeExpensiveValue());
```

## `RegExp.escape`

The [RegExp Escaping proposal](https://github.com/tc39/proposal-regex-escaping) has reached stage 4. TypeScript 6.0 includes types for `RegExp.escape` under the `es2025` lib:

```ts
function matchWholeWord(word: string, text: string) {
  const escapedWord = RegExp.escape(word);
  const regex = new RegExp(`\\b${escapedWord}\\b`, "g");
  return text.match(regex);
}
```

## `dom` lib Now Contains `dom.iterable` and `dom.asynciterable`

In TypeScript 6.0, the contents of `lib.dom.iterable.d.ts` and `lib.dom.asynciterable.d.ts` are fully included in `lib.dom.d.ts`. You can still reference `dom.iterable` and `dom.asynciterable` in your `"lib"` array, but they are now empty.

```ts
// Before TS 6.0, this required "lib": ["dom", "dom.iterable"].
// Now it works with just "lib": ["dom"].
for (const element of document.querySelectorAll("div")) {
  console.log(element.textContent);
}
```

## Breaking Changes and Deprecations in TypeScript 6.0

TypeScript 6.0 introduces a number of deprecations and behavior changes that reflect the modern JavaScript ecosystem and prepare projects for TypeScript 7.0. Deprecation messages can be silenced in 6.0 by setting `"ignoreDeprecations": "6.0"` in your tsconfig — but TypeScript 7.0 will not support any of these deprecated options.

The experimental [`ts5to6`](https://github.com/andrewbranch/ts5to6) tool can automatically apply many of the required adjustments.

### Up-Front Adjustments

Many projects will need to do at least one of the following:

- Set `"types"` explicitly in tsconfig, typically `"types": ["node"]`. `"types": ["*"]` restores the 5.9 default but is not recommended.
- Set `"rootDir": "./src"` if you previously relied on it being inferred — symptom: files emit to `./dist/src/index.js` instead of `./dist/index.js`.

### Simple Default Changes

- **`strict`** is now `true` by default.
- **`module`** defaults to `esnext`.
- **`target`** defaults to the current-year ES version (currently `es2025`).
- **`noUncheckedSideEffectImports`** is now `true` by default.
- **`libReplacement`** is now `false` by default.

If any of these new defaults breaks your project, you can specify the old value explicitly in `tsconfig.json`.

### `rootDir` Now Defaults to `.`

`rootDir` previously was inferred from the common directory of all non-declaration input files. In 6.0, it defaults to the directory containing `tsconfig.json`, and is only inferred when running `tsc` from the command line without a config file. If your sources sit any level deeper than your config, set `rootDir` explicitly:

```diff
{
  "compilerOptions": {
+   "rootDir": "./src"
  },
  "include": ["./src"]
}
```

### `types` Now Defaults to `[]`

Previously, `types` effectively defaulted to "everything in `node_modules/@types`". This was often very expensive on real projects. In 6.0, the default is `[]`. Most projects will need to explicitly list the global-affecting packages they actually use:

```diff
{
  "compilerOptions": {
+   "types": ["node", "jest"]
  }
}
```

You can specify `"types": ["*"]` to re-enable the previous behavior.

### Deprecated: `target: es5`

ES2015 is now the lowest supported target. If you still need ES5 output, use an external compiler to either compile TypeScript directly or post-process TypeScript's output.

### Deprecated: `--downlevelIteration`

Only had effects on ES5 emit. Now an error if set.

### Deprecated: `--moduleResolution node` (a.k.a. `node10`)

Migrate to `nodenext` (for Node) or `bundler` (for bundlers/Bun).

### Deprecated: `amd`, `umd`, `systemjs`, and `none` values of `module`

Migrate to ESM, use a bundler, or stay on TypeScript 5.x.

### Deprecated: `--baseUrl`

`baseUrl` is no longer considered a look-up root for module resolution. Migrate by inlining the prefix into your `paths`:

```diff
{
  "compilerOptions": {
-   "baseUrl": "./src",
    "paths": {
-     "@app/*": ["app/*"],
-     "@lib/*": ["lib/*"]
+     "@app/*": ["./src/app/*"],
+     "@lib/*": ["./src/lib/*"]
    }
  }
}
```

### Deprecated: `--moduleResolution classic`

Removed. Migrate to `nodenext` or `bundler`.

### Deprecated: `--esModuleInterop false` and `--allowSyntheticDefaultImports false`

These can no longer be set to `false`. The safer interop behavior is always enabled. You may need to update import syntax:

```ts
// Before
import * as express from "express";

// After
import express from "express";
```

### Deprecated: `--alwaysStrict false`

All code is now assumed to be in JavaScript strict mode.

### Deprecated: `outFile`

Removed. Use an external bundler (Webpack, Rollup, esbuild, Vite, Parcel, etc.).

### Deprecated: Legacy `module` Syntax for Namespaces

The legacy `module Foo { ... }` block syntax is now an error. Use `namespace Foo { ... }`:

```ts
// ❌ Now an error.
module Foo {
  export const bar = 10;
}

// ✅ Correct.
namespace Foo {
  export const bar = 10;
}
```

Ambient module declarations are unchanged:

```ts
// ✅ Still supported.
declare module "some-module" {
  export function doSomething(): void;
}
```

### Deprecated: `asserts` Keyword on Imports

The original "import assertions" proposal evolved into [import attributes](https://github.com/tc39/proposal-import-attributes), which uses `with` instead of `asserts`:

```ts
// ❌ Now an error.
import blob from "./blob.json" asserts { type: "json" };

// ✅ Use `with`.
import blob from "./blob.json" with { type: "json" };
```

### Deprecated: `no-default-lib` Directives

`/// <reference no-default-lib="true"/>` is no longer supported. Use `--noLib` or `--libReplacement` instead.

### Specifying Command-Line Files When `tsconfig.json` Exists is Now an Error

Running `tsc foo.ts` in a directory containing a `tsconfig.json` previously silently ignored the config. In 6.0, this errors:

```
error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.
```

To explicitly ignore the config and use TypeScript defaults:

```sh
tsc --ignoreConfig foo.ts
```

## Preparing for TypeScript 7.0

TypeScript 6.0 is a transition release. Options deprecated in 6.0 will be **removed entirely in 7.0**. Address deprecation warnings before adopting 7.0 (or trying the [native preview](https://www.npmjs.com/package/@typescript/native-preview)). The native port is already substantially complete and available as `@typescript/native-preview` on npm and as a VS Code extension.
