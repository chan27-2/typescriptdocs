---
title: Get Started
oneline: Choose a starting point that matches your background
---

<div class="getstarted-hero">
  <h1>Get Started with TypeScript</h1>
  <p class="lead">
    TypeScript is a strongly typed programming language that builds on JavaScript.
    The best path through the docs depends on where you're coming from — pick the
    guide that matches your background.
  </p>
</div>

<div class="audience-grid">

  <a href="/get-started/ts-for-new-programmers" class="audience-card">
    <div class="audience-emoji">🌱</div>
    <div class="audience-title">New to programming</div>
    <div class="audience-desc">Start here if TypeScript is your first language. We'll cover the basics of types, variables, and functions from scratch.</div>
    <div class="audience-cta">Learn TypeScript from scratch →</div>
  </a>

  <a href="/get-started/ts-for-js-programmers" class="audience-card">
    <div class="audience-emoji">🟨</div>
    <div class="audience-title">Coming from JavaScript</div>
    <div class="audience-desc">You already know JS. Learn how TypeScript layers a type system on top of the language you're used to.</div>
    <div class="audience-cta">See TypeScript for JS devs →</div>
  </a>

  <a href="/get-started/ts-for-java-csharp-programmers" class="audience-card">
    <div class="audience-emoji">☕</div>
    <div class="audience-title">Coming from Java or C#</div>
    <div class="audience-desc">Object-oriented background? TypeScript's structural type system is more flexible than nominal types — here's what to expect.</div>
    <div class="audience-cta">See TypeScript for OOP devs →</div>
  </a>

  <a href="/get-started/ts-for-functional-programmers" class="audience-card">
    <div class="audience-emoji">λ</div>
    <div class="audience-title">Coming from a functional language</div>
    <div class="audience-desc">Familiar with Haskell, OCaml, or F#? TypeScript has a rich structural type system — here's how it maps to what you know.</div>
    <div class="audience-cta">See TypeScript for FP devs →</div>
  </a>

  <a href="/get-started/typescript-tooling" class="audience-card">
    <div class="audience-emoji">🛠️</div>
    <div class="audience-title">Just want to set up tooling</div>
    <div class="audience-desc">Install the compiler, configure your editor, and build a small project in about five minutes.</div>
    <div class="audience-cta">TypeScript tooling in 5 minutes →</div>
  </a>

  <a href="/handbook/the-handbook" class="audience-card">
    <div class="audience-emoji">📘</div>
    <div class="audience-title">Read the Handbook</div>
    <div class="audience-desc">If you'd rather skip the intros and go deep, jump straight into the language reference handbook.</div>
    <div class="audience-cta">Open the Handbook →</div>
  </a>

</div>

<div class="install-strip">
  <div class="install-strip-inner">
    <h2>Install TypeScript</h2>
    <p>You can grab the compiler globally or as a project dependency.</p>

```bash
# Globally
npm install -g typescript

# Project-local (recommended)
npm install --save-dev typescript
```

<p class="install-note">After installing, run <code>npx tsc --init</code> to scaffold a <code>tsconfig.json</code>. TypeScript 5.9+ produces a streamlined, prescriptive config out of the box.</p>
  </div>
</div>

<div class="next-row">
  <div class="next-card">
    <h3>Try it without installing</h3>
    <p>The TypeScript Playground lets you write, share, and experiment with TypeScript directly in the browser.</p>
    <a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">Open the Playground →</a>
  </div>
  <div class="next-card">
    <h3>What's new in 6.0</h3>
    <p>TypeScript 6.0 is the latest release — a transition step toward the native 7.0 compiler. See the new features and deprecations.</p>
    <a href="/release-notes/TypeScript%206.0">Read the release notes →</a>
  </div>
</div>

<style>
.getstarted-hero {
  margin: 2rem 0 2.5rem;
  text-align: left;
}

.getstarted-hero h1 {
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.75rem;
  background: linear-gradient(135deg, #3178c6, #61a0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.getstarted-hero .lead {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  max-width: 720px;
  line-height: 1.6;
}

.audience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin: 0 0 3rem;
}

.audience-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none !important;
  transition: transform 0.15s ease, border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}

.audience-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
  box-shadow: 0 8px 24px rgba(49, 120, 198, 0.08);
}

.audience-emoji {
  font-size: 1.75rem;
  line-height: 1;
  margin-bottom: 0.75rem;
}

.audience-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--vp-c-text-1);
}

.audience-desc {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
  flex: 1;
  margin-bottom: 1rem;
}

.audience-cta {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.install-strip {
  background: linear-gradient(135deg, #f6fafd, #e6f1fc);
  border-radius: 12px;
  padding: 0.5rem 1rem;
  margin: 0 0 2.5rem;
}

html.dark .install-strip {
  background: linear-gradient(135deg, #1a1c1f, #0e1217);
}

.install-strip-inner {
  padding: 1.25rem 0.5rem;
}

.install-strip h2 {
  margin: 0 0 0.5rem;
  padding: 0;
  border: none;
  font-size: 1.4rem;
}

.install-strip p {
  margin: 0 0 1rem;
  color: var(--vp-c-text-2);
}

.install-strip .install-note {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.next-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.next-card {
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
}

.next-card h3 {
  margin: 0 0 0.5rem;
  padding: 0;
  border: none;
  font-size: 1.1rem;
}

.next-card p {
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.next-card a {
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

@media (max-width: 640px) {
  .getstarted-hero h1 { font-size: 2rem; }
  .audience-grid { grid-template-columns: 1fr; }
}
</style>
