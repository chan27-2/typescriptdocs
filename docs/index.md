---
layout: home
title: TypeScript Docs
titleTemplate: The Modern TypeScript Documentation

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
      <p>TypeScript <strong>5.8</strong> is now available. Explore what's new in the latest version of TypeScript!</p>
      <div class="cta-container">
        <a href="/release-notes/TypeScript%205.8" class="cta-button">Read Release Notes</a>
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

.h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.12);
}

.section-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.latest-release {
  background: linear-gradient(45deg, var(--ts-blue-dark), var(--ts-blue));
  color: white;
}

.latest-release a {
  color: white;
  text-decoration: underline;
  font-weight: 600;
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
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.link-card:hover {
  transform: translateY(-2px);
  background-color: var(--vp-c-gray-soft);
  text-decoration: none;
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

.vp-doc a {
    font-weight: 500;
    color: var(--vp-c-brand-1);
    text-decoration: none;
    transition: color 0.25s, opacity 0.25s;
}

.vp-doc h2 {
    margin: 0;
    border-top: none;
    padding: 0;
}
</style>
