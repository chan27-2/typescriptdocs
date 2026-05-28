---
title: TypeScript 5.9

oneline: TypeScript 5.9 Release Notes
---

## Minimal and Updated `tsc --init`

For a long time, TypeScript has generated a verbose `tsconfig.json` when running `tsc --init`, filled with extensive commented-out options. Most users immediately deleted these comments after generation. TypeScript 5.9 streamlines this into a minimal, prescriptive configuration that addresses common pain points and encourages modern defaults.

```json
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    // "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig_modules
    "module": "nodenext",
    "target": "esnext",
    "types": [],

    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  }
}
```

The new defaults encourage ES modules, modern targets, and stricter type-checking out of the box. Users are expected to lean on editor auto-complete and the [tsconfig reference](https://www.typescriptlang.org/tsconfig/) to discover additional options.

## Support for `import defer`

TypeScript 5.9 introduces support for ECMAScript's [deferred module evaluation proposal](https://github.com/tc39/proposal-defer-import-eval/) via the new `import defer` syntax. This allows a module to be imported without immediately executing its top-level code and side-effects.

```ts
import defer * as feature from "./some-feature.js";
```

Only namespace imports are permitted with `import defer` — named and default imports are not allowed:

```ts
// ❌ Not allowed
import defer { doSomething } from "some-module";

// ❌ Not allowed
import defer defaultExport from "some-module";

// ✅ Only this syntax is supported
import defer * as feature from "some-module";
```

The module is fully loaded and ready to run, but its statements and declarations are only executed once one of its exports is first accessed:

```ts
// ./some-feature.ts
initializationWithSideEffects();

function initializationWithSideEffects() {
  specialConstant = 42;
  console.log("Side effects have occurred!");
}

export let specialConstant: number;
```

```ts
import defer * as feature from "./some-feature.js";

// No side effects have occurred yet.
// ...

// As soon as `specialConstant` is accessed, the module body runs.
console.log(feature.specialConstant); // 42
```

`import defer` is not transformed or downleveled by TypeScript — it only works with `--module preserve` and `--module esnext`. This is useful for modules with expensive initialization where the work should be deferred until needed.

## Support for `--module node20`

TypeScript 5.9 brings a new stable option called `node20` for both `--module` and `--moduleResolution`, modeling the behavior of Node.js v20.

Key differences from `nodenext`:

- `node20` is unlikely to receive new behaviors in the future (unlike `nodenext`, which floats).
- Specifying `--module node20` implies `--target es2023` unless otherwise configured.
- `--module nodenext` implies the floating `--target esnext`.
- Supports `require()` of ECMAScript modules from CommonJS modules.
- Correctly rejects legacy import assertions in favor of standards-bound [import attributes](https://github.com/tc39/proposal-import-attributes).

## Summary Descriptions in DOM APIs

TypeScript now includes summary descriptions for many DOM APIs based on MDN documentation. Hovering a DOM type or method in your editor now shows a short explanation of what it does, without leaving the editor.

## Expandable Hovers (Preview)

Quick info tooltips now support expandable / collapsible views. When hovering a value or type reference, the editor surfaces `+` and `-` buttons to expand and collapse nested type information inline — for example, hovering a parameter `options: Options` lets you expand `Options` without jumping to its definition.

This feature is currently in preview and the TypeScript team is gathering feedback from VS Code partners.

## Configurable Maximum Hover Length

The TypeScript 5.9 language server supports a configurable hover length via the `js/ts.hover.maximumLength` setting in VS Code. The new default hover length is substantially larger, so more information is shown by default in hover tooltips.

## Optimizations

### Cache Instantiations on Mappers

TypeScript now caches intermediate instantiations when replacing type parameters with type arguments. This avoids excessive type instantiation depth errors in complex libraries such as Zod and tRPC.

### Avoiding Closure Creation in `fileOrDirectoryExistsUsingSource`

Eliminated unnecessary closure allocations in file existence checks. This produced roughly an 11% speed-up in projects with many existence checks.

## Notable Behavioral Changes

### `lib.d.ts` Changes

Changes to DOM API types may impact type-checking. One notable change: `ArrayBuffer` is no longer a supertype of several `TypedArray` types, including `Buffer` from Node.js.

You may see new errors like:

```
error TS2345: Argument of type 'ArrayBufferLike' is not assignable to parameter of type 'BufferSource'.
error TS2322: Type 'ArrayBufferLike' is not assignable to type 'ArrayBuffer'.
error TS2322: Type 'Buffer' is not assignable to type 'Uint8Array<ArrayBufferLike>'.
error TS2345: Argument of type 'Buffer' is not assignable to parameter of type 'string | Uint8Array<ArrayBufferLike>'.
```

Solutions:

1. Update `@types/node`:

```bash
npm update @types/node --save-dev
```

2. Specify a more specific buffer type instead of the default `ArrayBufferLike`:

```ts
new Uint8Array<ArrayBuffer>();
```

3. Access the `.buffer` property when passing a `TypedArray` to a function expecting `ArrayBuffer`:

```diff
let data = new Uint8Array([0, 1, 2, 3, 4]);
- someFunc(data)
+ someFunc(data.buffer)
```

### Type Argument Inference Changes

TypeScript 5.9 fixes "leaks" of type variables during inference. This can introduce new errors in some codebases that are hard to predict in advance. They can typically be resolved by adding explicit type arguments to generic function calls.

## What's Next

TypeScript 6.0 is planned as a transition point toward TypeScript 7.0, the native TypeScript port. 6.0 introduces deprecations and behavior adjustments designed to make projects ready for 7.0. Previews of the native port are available on npm as `@typescript/native-preview` and via a VS Code extension.
