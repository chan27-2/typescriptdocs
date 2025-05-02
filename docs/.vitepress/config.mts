import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Typescript Docs",
  description: "A beautiful typescript documentation",
  markdown: {
    codeTransformers: [
      transformerTwoslash({
        explicitTrigger: true,
      }),
    ],
    languages: ["js", "jsx", "ts", "tsx"] as any,
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Get Started",
        collapsed: false,
        items: [
          {
            text: "For New Programmers",
            link: "/get-started/ts-for-new-programmers",
          },
          {
            text: "For JS Programmers",
            link: "/get-started/ts-for-js-programmers",
          },
          {
            text: "For Java/C# Programmers",
            link: "/get-started/ts-for-java-csharp-programmers",
          },
          {
            text: "For Functional Programmers",
            link: "/get-started/ts-for-functional-programmers",
          },
          {
            text: "Typescript Tooling",
            link: "/get-started/typescript-tooling",
          },
        ],
      },
      {
        text: "Handbook",
        collapsed: false,
        items: [
          { text: "The Handbook", link: "/handbook/the-handbook" },
          { text: "The Basics", link: "/handbook/basics" },
          { text: "Everyday Types", link: "/handbook/everyday-types" },
          { text: "Narrowing", link: "/handbook/narrowing" },
          { text: "More on Functions", link: "/handbook/more-on-functions" },
          { text: "Object Types", link: "/handbook/object-types" },
          {
            text: "Type Manipulation",
            link: "/handbook/type-manipulation/creating-types-from-types",
            collapsed: true,
            items: [
              {
                text: "Creating Types from Types",
                link: "/handbook/type-manipulation/creating-types-from-types",
              },
              {
                text: "Generics",
                link: "/handbook/type-manipulation/generics",
              },
              {
                text: "Keyof Type Operator",
                link: "/handbook/type-manipulation/keyof-type-operator",
              },
              {
                text: "Typeof Type Operator",
                link: "/handbook/type-manipulation/typeof-type-operator",
              },
              {
                text: "Indexed Access Types",
                link: "/handbook/type-manipulation/indexed-access-types",
              },
              {
                text: "Conditional Types",
                link: "/handbook/type-manipulation/conditional-types",
              },
              {
                text: "Mapped Types",
                link: "/handbook/type-manipulation/mapped-types",
              },
              {
                text: "Template Literal Types",
                link: "/handbook/type-manipulation/template-literal-types",
              },
            ],
          },
          { text: "Classes", link: "/handbook/classes" },
          { text: "Modules", link: "/handbook/modules" },
          { text: "Type Declarations", link: "/handbook/type-declarations" },
          {
            text: "Understanding Errors",
            link: "/handbook/understanding-errors",
          },
        ],
      },
      {
        text: "Reference",
        collapsed: false,
        items: [
          { text: "Advanced Types", link: "/reference/advanced-types" },
          {
            text: "Declaration Merging",
            link: "/reference/declaration-merging",
          },
          { text: "Decorators", link: "/reference/decorators" },
          { text: "Enums", link: "/reference/enums" },
          {
            text: "Iterators and Generators",
            link: "/reference/iterators-and-generators",
          },
          { text: "JSX", link: "/reference/jsx" },
          { text: "Mixins", link: "/reference/mixins" },
          { text: "Namespaces", link: "/reference/namespaces" },
          {
            text: "Namespaces and Modules",
            link: "/reference/namespaces-and-modules",
          },
          { text: "Symbols", link: "/reference/symbols" },
          {
            text: "Triple-Slash Directives",
            link: "/reference/triple-slash-directives",
          },
          { text: "Type Compatibility", link: "/reference/type-compatibility" },
          { text: "Type Inference", link: "/reference/type-inference" },
          { text: "Utility Types", link: "/reference/utility-types" },
          {
            text: "Variable Declarations",
            link: "/reference/variable-declarations",
          },
        ],
      },
      {
        text: "Modules Reference",
        collapsed: false,
        items: [
          { text: "Introduction", link: "/modules-reference/introduction" },
          { text: "Theory", link: "/modules-reference/theory" },
          { text: "Reference", link: "/modules-reference/reference" },
          {
            text: "Guides",
            collapsed: true,
            items: [
              {
                text: "Choosing Compiler Options",
                link: "/modules-reference/guides/choosing-compiler-options",
              },
            ],
          },
          {
            text: "Appendices",
            collapsed: true,
            items: [
              {
                text: "ESM/CJS Interoperability",
                link: "/modules-reference/appendices/esm-cjs-interop",
              },
            ],
          },
        ],
      },
      {
        text: "Guides",
        collapsed: false,
        items: [
          {
            text: "Choosing Compiler Options",
            link: "/guides/compiler-options",
          },
        ],
      },
      {
        text: "Appendices",
        collapsed: true,
        link: "/appendices/",
      },
      {
        text: "Tutorials",
        collapsed: true,
        link: "/tutorials/",
      },
      {
        text: "What's New",
        collapsed: true,
        link: "/whats-new/",
      },
      {
        text: "Declaration Files",
        collapsed: true,
        link: "/declaration-files/",
      },
      {
        text: "JavaScript",
        collapsed: true,
        link: "/javascript/",
      },
      {
        text: "Project Configuration",
        collapsed: true,
        link: "/project-configuration/",
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
