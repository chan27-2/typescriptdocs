import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { defineConfig } from "vitepress";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

// Define the dirname equivalent for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define sidebar item type
interface SidebarItem {
  text: string;
  link: string;
  items?: SidebarItem[];
  collapsed?: boolean;
}

// Define the release notes items manually but in a more maintainable way using a version ranges array
function generateReleaseNotesSidebar() {
  // Define the version ranges we want to support
  const majorVersions = [5, 4, 3, 2, 1];
  const versionRanges = {
    5: [8, 7, 6, 5, 4, 3, 2, 1, 0],
    4: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    3: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    2: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    1: [8, 7, 6, 5, 4, 3, 1],
  };

  // Generate the sidebar items
  const items: SidebarItem[] = [];

  // For each major version
  for (const major of majorVersions) {
    // For each minor version
    for (const minor of versionRanges[major]) {
      const version = `${major}.${minor}`;
      items.push({
        text: `TypeScript ${version}`,
        link: `/release-notes/TypeScript ${version}`,
      });
    }
  }

  return items;
}

/**
 * Function to generate sidebar from folder structure
 * @param rootDir - Root directory to start scanning from (relative to docs/)
 * @param basePath - Base URL path for links
 * @param defaultCollapsed - Whether sections should be collapsed by default
 * @returns Array of sidebar items
 */
function generateSidebarFromFolders(
  rootDir: string,
  basePath: string = "/",
  defaultCollapsed: boolean = false
): SidebarItem[] {
  const docsDir = path.resolve(__dirname, "..");
  const fullPath = path.join(docsDir, rootDir);

  if (!fs.existsSync(fullPath)) {
    console.warn(`Directory not found: ${fullPath}`);
    return [];
  }

  const items: SidebarItem[] = [];
  const dirContents = fs.readdirSync(fullPath, { withFileTypes: true });

  // Process directories first (for better organization)
  const dirs = dirContents.filter(
    (dirent) => dirent.isDirectory() && !dirent.name.startsWith(".")
  );
  const files = dirContents.filter(
    (dirent) =>
      dirent.isFile() &&
      dirent.name.endsWith(".md") &&
      dirent.name !== "index.md"
  );

  // Check if index.md exists for this directory
  const indexFile = dirContents.find(
    (dirent) => dirent.isFile() && dirent.name === "index.md"
  );

  // Process directories
  for (const dir of dirs) {
    const dirPath = path.join(rootDir, dir.name);
    const linkPath = `${basePath}${dir.name}/`;

    // Get subdirectory items
    const subItems = generateSidebarFromFolders(dirPath, linkPath, true);

    // Try to find index.md in subdirectory for the title
    const indexPath = path.join(fullPath, dir.name, "index.md");
    let text =
      dir.name.charAt(0).toUpperCase() + dir.name.slice(1).replace(/-/g, " ");

    if (fs.existsSync(indexPath)) {
      try {
        const fileContent = fs.readFileSync(indexPath, "utf8");
        const { data } = matter(fileContent);
        if (data.title) {
          text = data.title;
        }
      } catch (error) {
        console.warn(`Error reading frontmatter from ${indexPath}:`, error);
      }
    }

    items.push({
      text,
      link: linkPath,
      items: subItems,
      collapsed: defaultCollapsed,
    });
  }

  // Process markdown files
  for (const file of files) {
    const fileName = file.name.replace(".md", "");
    const filePath = path.join(fullPath, file.name);

    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);

      items.push({
        text:
          data.title ||
          fileName.charAt(0).toUpperCase() +
            fileName.slice(1).replace(/-/g, " "),
        link: `${basePath}${fileName}`,
      });
    } catch (error) {
      console.warn(`Error reading frontmatter from ${filePath}:`, error);

      // Fallback to using filename
      items.push({
        text:
          fileName.charAt(0).toUpperCase() +
          fileName.slice(1).replace(/-/g, " "),
        link: `${basePath}${fileName}`,
      });
    }
  }

  // Sort items alphabetically by text
  items.sort((a, b) => {
    // If indexFile exists, put it first
    if (a.link.endsWith("/")) return -1;
    if (b.link.endsWith("/")) return 1;
    return a.text.localeCompare(b.text);
  });

  return items;
}

// Generate sidebar for main sections
function generateMainSidebar() {
  const mainSections = [
    { path: "get-started", title: "Get Started" },
    { path: "handbook", title: "Handbook" },
    { path: "reference", title: "Reference" },
    { path: "modules-reference", title: "Modules Reference" },
    { path: "tutorials", title: "Tutorials" },
    { path: "declaration-files", title: "Declaration Files" },
    { path: "javascript", title: "JavaScript" },
    { path: "project-config", title: "Project Configuration" },
  ];

  const sidebar: SidebarItem[] = [];

  for (const section of mainSections) {
    // Check if directory exists
    const sectionPath = path.resolve(__dirname, "..", section.path);
    if (!fs.existsSync(sectionPath)) {
      continue;
    }

    const items = generateSidebarFromFolders(section.path, `/${section.path}/`);

    sidebar.push({
      text: section.title,
      collapsed: false,
      link: `/${section.path}/`,
      items: items,
    });
  }

  // Add Release Notes section with manually generated items
  sidebar.push({
    text: "Release Notes",
    collapsed: true,
    link: "/release-notes/",
    items: generateReleaseNotesSidebar(),
  });

  return sidebar;
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Typescript Docs",
  description: "A beautiful typescript documentation",
  markdown: {
    codeTransformers: [
      transformerTwoslash({
        explicitTrigger: true,
      }) as any,
    ],
    languages: ["js", "jsx", "ts", "tsx"] as any,
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Release Notes", link: "/release-notes/" },
      { text: "Handbook", link: "/handbook/the-handbook" },
      { text: "Tutorials", link: "/tutorials/migrating-from-javascript" },
    ],

    // Use the dynamic sidebar generator
    sidebar: generateMainSidebar(),

    socialLinks: [
      { icon: "github", link: "https://github.com/chan27-2/typescriptdocs" },
    ],
    footer: {
      message: "Made with ♥︎ by Chan27-2",
    },
  },
});
