---
layout: home
title: TypeScript Docs — The Modern TypeScript Documentation
description: A modern, community-driven TypeScript documentation. Learn the language, browse the handbook, and stay up to date with every release.

hero:
  name: TypeScript
  text: JavaScript with Types
  tagline: A powerful typed superset of JavaScript that scales from simple scripts to enterprise-grade systems.
  image:
    src: /ts-logo.png
    alt: TypeScript Logo
  actions:
    - theme: brand
      text: Get Started
      link: /get-started/
    - theme: alt
      text: Handbook
      link: /handbook/the-handbook
    - theme: alt
      text: View on GitHub
      link: https://github.com/microsoft/TypeScript

features:
  - icon: 🛡️
    title: Type Safety
    details: Prevent runtime errors with compile-time checks. TypeScript makes your code safer and more predictable.

  - icon: 🔄
    title: JavaScript Compatible
    details: Start using TypeScript with zero friction. It's fully compatible with existing JavaScript codebases.

  - icon: 🚀
    title: Tooling Power
    details: Get advanced autocompletion, refactoring tools, and real-time error feedback in your editor.

  - icon: 📚
    title: Deep Documentation
    details: Learn everything from the basics to advanced types. Our guides are clear, practical, and up to date.

  - icon: 🌍
    title: Built to Scale
    details: TypeScript is trusted by startups and enterprises alike, supporting projects of every size.

  - icon: 🧩
    title: Ecosystem Ready
    details: Works with popular frameworks, libraries, and has type definitions for thousands of packages.
---

<div class="custom-sections">
  <div class="section latest-release">
    <div class="section-content">
      <h2>🎉 Latest Release</h2>
      <p>TypeScript <strong>6.0</strong> is now available. See what's new, what's been retired, and how to get your project ready for what's next.</p>
      <div class="cta-container">
        <a href="/release-notes/TypeScript%206.0" class="cta-button">Read Release Notes</a>
      </div>
    </div>
  </div>

  <div class="section quick-links">
    <div class="section-content">
      <h2>📖 Popular Topics</h2>
      <div class="link-grid">
        <a href="/handbook/everyday-types" class="link-card">
          <div class="link-icon">📝</div>
          <div class="link-title">Types</div>
        </a>
        <a href="/handbook/object-types.html" class="link-card">
          <div class="link-icon">🔗</div>
          <div class="link-title">Object Types</div>
        </a>
        <a href="/handbook/more-on-functions" class="link-card">
          <div class="link-icon">⚙️</div>
          <div class="link-title">Functions</div>
        </a>
        <a href="/handbook/classes" class="link-card">
          <div class="link-icon">🧩</div>
          <div class="link-title">Classes</div>
        </a>
        <a href="/handbook/modules" class="link-card">
          <div class="link-icon">📦</div>
          <div class="link-title">Modules</div>
        </a>
      </div>
    </div>
  </div>

  <div class="section try-typescript">
    <div class="section-content">
      <h2>💻 Try TypeScript Online</h2>
      <p>The <strong>TypeScript Playground</strong> is your interactive environment to write, test, and share TypeScript code directly in the browser.</p>
      <div class="cta-container">
        <a href="https://www.typescriptlang.org/play" target="_blank" class="cta-button">Open Playground</a>
      </div>
    </div>
  </div>
</div>

<style>
:root {
  --ts-blue: #3178c6;
  --ts-blue-dark: #235a9a;
  --ts-blue-light: #61a0ff;
}

/* Dark mode variables */
html.dark {
  --ts-blue: #61a0ff;
  --ts-blue-dark: #2b4a7d;
  --ts-blue-light: #8ec3ff;
}

.custom-sections {
  margin: 3rem 0;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.custom-sections h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  padding: 0;
  border: none;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.custom-sections p {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  max-width: 70ch;
}

.section {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.section:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.section-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.latest-release {
  /* The gradient card carries its own visual weight — the section's
     default border would clash with it. */
  border-color: transparent;
  background: linear-gradient(45deg, var(--ts-blue-dark), var(--ts-blue));
  color: white;
}

/* Inline links inside paragraph copy get the underline; the pill CTA
   below opts out via its own class. */
.latest-release p a {
  color: white;
  text-decoration: underline;
  font-weight: 600;
}

.latest-release .cta-button {
  text-decoration: none;
}

.quick-links {
  background-color: var(--vp-c-bg-soft);
}

.try-typescript {
  background: linear-gradient(135deg, #f6fafd, #e6f1fc);
  color: var(--vp-c-text-1);
}

html.dark .try-typescript {
  background: linear-gradient(135deg, #1a1c1f, #0e1217);
  color: var(--vp-c-text-1);
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.25rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  text-decoration: none !important;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.link-card:hover {
  border-color: var(--ts-blue);
  background-color: var(--vp-c-bg-soft);
}

.link-card:focus-visible,
.cta-button:focus-visible {
  outline: 2px solid var(--ts-blue);
  outline-offset: 3px;
}

.link-icon {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.link-title {
  font-weight: 500;
  font-size: 1.05rem;
  margin-top: 0.25rem;
  letter-spacing: 0.01em;
  text-decoration: none;
}

.cta-container {
  margin-top: 1.5rem;
  display: flex;
}

.cta-button {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  border-radius: 24px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.latest-release .cta-button {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
}

.latest-release .cta-button:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.try-typescript .cta-button {
  background-color: var(--ts-blue);
  color: white;
}

.try-typescript .cta-button:hover {
  background-color: var(--ts-blue-dark);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .link-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-content {
    padding: 1.5rem;
  }
}

/* Scoped to .custom-sections only — these previously leaked into every
   handbook page and were killing inline link underlines + h2 separators
   site-wide. */
.custom-sections.vp-doc a,
.custom-sections .vp-doc a {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.25s, opacity 0.25s;
}
</style>
