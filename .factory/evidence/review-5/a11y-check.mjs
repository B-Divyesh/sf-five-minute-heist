import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = "https://five-minute-heist.sociobot.in";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const report = [];
const internalLinks = new Set();
const externalLinks = new Set();
const mailLinks = new Set();

for (const route of ["/", "/?demo=1", "/demo", "/privacy", "/terms", "/not-a-real-page"]) {
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  const axe = await new AxeBuilder({ page }).analyze();
  const structure = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    h1: document.querySelectorAll("h1").length,
    main: document.querySelectorAll("main").length,
    unlabeledButtons: [...document.querySelectorAll("button")].filter((button) => !button.getAttribute("aria-label") && !button.textContent?.trim()).length,
    imagesMissingAlt: [...document.querySelectorAll("img")].filter((image) => !image.hasAttribute("alt")).length,
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    links: [...document.querySelectorAll("a[href]")].map((link) => link.href)
  }));
  for (const href of structure.links) {
    const url = new URL(href);
    if (url.protocol === "mailto:") mailLinks.add(href);
    else if (url.origin === new URL(base).origin) internalLinks.add(url.pathname + url.search);
    else externalLinks.add(href);
  }
  report.push({ route, violations: axe.violations, structure });
}

const linkResults = [];
for (const href of [...internalLinks].sort()) {
  const response = await fetch(`${base}${href}`, { redirect: "manual" });
  const expectedStatus = href === "/not-a-real-page" ? 404 : 200;
  linkResults.push({ href, status: response.status, expectedStatus, pass: response.status === expectedStatus });
}

await page.goto(`${base}/?demo=1`, { waitUntil: "networkidle" });
const focusableCount = await page.locator('a[href], button:not([disabled])').count();
const focused = [];
for (let index = 0; index < focusableCount; index += 1) {
  await page.keyboard.press("Tab");
  focused.push(await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    label: document.activeElement?.getAttribute("aria-label") || document.activeElement?.textContent?.trim(),
    outlineWidth: getComputedStyle(document.activeElement).outlineWidth,
    outlineStyle: getComputedStyle(document.activeElement).outlineStyle
  })));
}
const keyboard = {
  focusableCount,
  visitedCount: new Set(focused.map(({ tag, label }) => `${tag}:${label}`)).size,
  first: focused[0],
  allNativeControls: focused.every(({ tag }) => tag === "A" || tag === "BUTTON"),
  allHaveOutline: focused.every(({ outlineWidth, outlineStyle }) => Number.parseFloat(outlineWidth) >= 3 && outlineStyle !== "none")
};

await context.close();
await browser.close();
await writeFile(".factory/evidence/review-5/a11y-results.json", `${JSON.stringify({ pages: report, linkResults, externalLinks: [...externalLinks], mailLinks: [...mailLinks], keyboard, focusSequence: focused }, null, 2)}\n`);
const violations = report.flatMap((pageResult) => pageResult.violations.map((violation) => ({ route: pageResult.route, id: violation.id, impact: violation.impact })));
console.log(JSON.stringify({ pages: report.length, violations, linkResults, externalLinks: [...externalLinks], mailLinks: [...mailLinks], keyboard, structures: report.map(({ route, structure }) => ({ route, ...structure })) }, null, 2));
if (violations.length > 0 || linkResults.some(({ pass }) => !pass) || !keyboard.allNativeControls || !keyboard.allHaveOutline) process.exitCode = 1;
