import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { defineConfig, type DefaultTheme } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  ModuleKind,
  ModuleResolutionKind,
  ScriptTarget,
} from "typescript";

type SidebarItem = DefaultTheme.SidebarItem;
type SidebarMulti = DefaultTheme.SidebarMulti;

const DOCS_DIR = path.resolve(import.meta.dirname, "..");

// ---------------------------------------------------------------------------
// Sidebar generation
// ---------------------------------------------------------------------------

/**
 * Walk a docs subdirectory and turn it into a sidebar tree. Subdirectories
 * become collapsible groups; markdown files become leaf links. Titles come
 * from each file's frontmatter `title` when present, otherwise from a
 * Title-Cased filename.
 */
function buildSidebarFromFolder(
  rootDir: string,
  basePath: string,
  defaultCollapsed: boolean = false
): SidebarItem[] {
  const fullPath = path.join(DOCS_DIR, rootDir);
  if (!fs.existsSync(fullPath)) return [];

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  const dirs = entries.filter(
    (e) => e.isDirectory() && !e.name.startsWith(".")
  );
  const files = entries.filter(
    (e) => e.isFile() && e.name.endsWith(".md") && e.name !== "index.md"
  );

  const items: SidebarItem[] = [];

  for (const dir of dirs) {
    const subPath = path.join(rootDir, dir.name);
    const linkPath = `${basePath}${dir.name}/`;
    const subItems = buildSidebarFromFolder(subPath, linkPath, true);

    const indexPath = path.join(fullPath, dir.name, "index.md");
    let text = titleCase(dir.name);
    if (fs.existsSync(indexPath)) {
      const { data } = matter(fs.readFileSync(indexPath, "utf8"));
      if (data?.title) text = data.title;
    }

    items.push({
      text,
      link: linkPath,
      collapsed: defaultCollapsed,
      items: subItems,
    });
  }

  for (const file of files) {
    const slug = file.name.replace(/\.md$/, "");
    const filePath = path.join(fullPath, file.name);
    let text = titleCase(slug);
    try {
      const { data } = matter(fs.readFileSync(filePath, "utf8"));
      if (data?.title) text = data.title;
    } catch {
      // fall through to filename-based title
    }
    items.push({ text, link: `${basePath}${slug}` });
  }

  // Folders first, then files; alphabetical within each.
  items.sort((a, b) => {
    if (a.items && !b.items) return -1;
    if (!a.items && b.items) return 1;
    return a.text!.localeCompare(b.text!);
  });

  return items;
}

function titleCase(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}

/**
 * Release notes are auto-discovered from disk and grouped by major version.
 * The latest major is expanded, older majors collapse to keep the sidebar
 * compact. This is the change that fixes "the sidebar is out of scroll" —
 * users no longer wade through 49 flat items to find where they are.
 */
function buildReleaseNotesSidebar(): SidebarItem[] {
  const releaseDir = path.join(DOCS_DIR, "release-notes");
  if (!fs.existsSync(releaseDir)) return [];

  const versionRe = /^TypeScript (\d+)\.(\d+)\.md$/;
  const byMajor = new Map<number, { major: number; minor: number }[]>();

  for (const entry of fs.readdirSync(releaseDir)) {
    const m = entry.match(versionRe);
    if (!m) continue;
    const major = parseInt(m[1], 10);
    const minor = parseInt(m[2], 10);
    if (!byMajor.has(major)) byMajor.set(major, []);
    byMajor.get(major)!.push({ major, minor });
  }

  const majors = [...byMajor.keys()].sort((a, b) => b - a);
  const latestMajor = majors[0];

  return majors.map((major) => {
    const versions = byMajor.get(major)!.sort((a, b) => b.minor - a.minor);
    return {
      text: `TypeScript ${major}.x`,
      collapsed: major !== latestMajor,
      items: versions.map(({ major, minor }) => ({
        text: `TypeScript ${major}.${minor}`,
        link: `/release-notes/TypeScript ${major}.${minor}`,
      })),
    };
  });
}

// ---------------------------------------------------------------------------
// Per-section sidebars
// ---------------------------------------------------------------------------

const sections: Array<{
  path: string;
  title: string;
  urlPrefix: string;
}> = [
  { path: "get-started", title: "Get Started", urlPrefix: "/get-started/" },
  { path: "handbook", title: "Handbook", urlPrefix: "/handbook/" },
  { path: "reference", title: "Reference", urlPrefix: "/reference/" },
  {
    path: "modules-reference",
    title: "Modules Reference",
    urlPrefix: "/modules-reference/",
  },
  { path: "tutorials", title: "Tutorials", urlPrefix: "/tutorials/" },
  {
    path: "declaration-files",
    title: "Declaration Files",
    urlPrefix: "/declaration-files/",
  },
  { path: "javascript", title: "JavaScript", urlPrefix: "/javascript/" },
  {
    path: "project-config",
    title: "Project Configuration",
    urlPrefix: "/project-config/",
  },
];

function buildSidebars(): SidebarMulti {
  const sidebars: SidebarMulti = {};

  for (const section of sections) {
    const sectionDir = path.join(DOCS_DIR, section.path);
    if (!fs.existsSync(sectionDir)) continue;

    sidebars[section.urlPrefix] = [
      {
        text: section.title,
        link: section.urlPrefix,
        items: buildSidebarFromFolder(section.path, section.urlPrefix, false),
      },
    ];
  }

  sidebars["/release-notes/"] = [
    {
      text: "Release Notes",
      link: "/release-notes/",
      items: buildReleaseNotesSidebar(),
    },
  ];

  return sidebars;
}

// ---------------------------------------------------------------------------
// VitePress config
// ---------------------------------------------------------------------------

const vitepressConfig = defineConfig({
  title: "TypeScript Docs",
  description:
    "A modern, community-driven TypeScript documentation. Read the handbook, browse references, and follow every release.",

  // Serves URLs like /handbook/everyday-types instead of /handbook/everyday-types.html.
  // Works out of the box on GitHub Pages, Vercel, Netlify, and the built-in
  // VitePress preview server.
  cleanUrls: true,

  markdown: {
    codeTransformers: [
      transformerTwoslash({
        explicitTrigger: true,
        twoslashOptions: {
          compilerOptions: {
            target: ScriptTarget.ES2017,
            module: ModuleKind.CommonJS,
            moduleResolution: ModuleResolutionKind.Node10,
            types: ["express"],
            // TS 6.0 deprecates a handful of options used by twoslash (Node10
            // resolution, baseUrl, etc.). Silence them at the renderer only.
            ignoreDeprecations: "6.0",
          },
        },
      }) as any,
    ],
    languages: ["js", "jsx", "ts", "tsx"] as any,
  },

  themeConfig: {
    logo: "/ts-logo.png",

    nav: [
      {
        text: "Learn",
        items: [
          { text: "Get Started", link: "/get-started/" },
          { text: "Handbook", link: "/handbook/the-handbook" },
          { text: "Tutorials", link: "/tutorials/migrating-from-javascript" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Language Reference", link: "/reference/utility-types" },
          {
            text: "Modules Reference",
            link: "/modules-reference/introduction",
          },
          { text: "JavaScript", link: "/javascript/intro-to-js-with-ts" },
          {
            text: "Declaration Files",
            link: "/declaration-files/introduction",
          },
          {
            text: "Project Configuration",
            link: "/project-config/tsconfig.json",
          },
        ],
      },
      { text: "Releases", link: "/release-notes/" },
      {
        text: "Playground",
        link: "https://www.typescriptlang.org/play",
      },
    ],

    sidebar: buildSidebars(),

    outline: {
      level: [2, 3],
      label: "On this page",
    },

    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/chan27-2/typescriptdocs" },
    ],

    footer: {
      message:
        "Made with ♥︎ by <a href='https://github.com/chan27-2'>Chan27-2</a>",
      copyright: "MIT Licensed · Community-driven TypeScript documentation",
    },

    editLink: {
      pattern:
        "https://github.com/chan27-2/typescriptdocs/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    lastUpdated: {
      text: "Last updated",
    },
  },

  vite: {
    optimizeDeps: {
      include: ["mermaid"],
    },
  },

  ignoreDeadLinks: true,

  transformHead: () => [
    [
      "script",
      {
        async: "true",
        defer: "true",
        "data-website-id": "2b6ca2bd-39fc-4ae6-bed7-e8a94b2c3f70",
        src: "https://cloud.umami.is/script.js",
      },
    ],
  ],
});

export default withMermaid(vitepressConfig);
