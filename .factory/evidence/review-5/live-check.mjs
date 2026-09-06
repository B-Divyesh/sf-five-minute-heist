import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = "https://five-minute-heist.sociobot.in";
const output = ".factory/evidence/review-5";
const solution = ["U", "U", "L", "U", "L"];
const browser = await chromium.launch({ headless: true });
const report = {
  checks: [],
  consoleErrors: [],
  pageErrors: [],
  externalRequests: [],
  frameRates: [],
  initialLoads: [],
  observed: {}
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
  report.checks.push(message);
}

function observe(page, name) {
  page.on("console", (message) => {
    if (message.type() === "error" && !page.url().includes("/not-a-real-page")) {
      report.consoleErrors.push(`${name}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => report.pageErrors.push(`${name}: ${String(error)}`));
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== new URL(base).origin) {
      report.externalRequests.push(`${name}: ${request.url()}`);
    }
  });
}

async function measureFrameRate(page) {
  return page.evaluate(() => new Promise((resolve) => {
    const intervals = [];
    let previous = performance.now();
    const frame = (now) => {
      intervals.push(now - previous);
      previous = now;
      if (intervals.length < 65) requestAnimationFrame(frame);
      else {
        const measured = intervals.slice(5);
        resolve(1000 / (measured.reduce((sum, value) => sum + value, 0) / measured.length));
      }
    };
    requestAnimationFrame(frame);
  }));
}

async function enterByTouch(page, plan) {
  for (const direction of plan) await page.locator(`[data-direction="${direction}"]`).tap();
}

const phoneContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true
});
const phone = await phoneContext.newPage();
observe(phone, "phone");
await phone.goto(base, { waitUntil: "networkidle" });
await phone.evaluate(() => localStorage.setItem("five-minute-heist:review-5-sentinel", "daily-data"));
const phoneBoard = await phone.locator(".board").boundingBox();
assert(await phone.evaluate(() => scrollY) === 0, "phone first screen was checked before scrolling");
assert(await phone.locator("h1").textContent() === "Plan a five-move museum heist", "phone first screen names the job");
assert(await phone.getByText("For solo players who want a short daily puzzle without another word game.").isVisible(), "phone first screen names the audience");
assert(await phone.getByRole("link", { name: "Try it with sample data" }).isVisible(), "phone first screen shows the first action");
assert(Boolean(phoneBoard) && phoneBoard.y < 844, "phone first screen shows the game itself");
await phone.screenshot({ path: `${output}/cold-phone.png` });
await phone.getByRole("link", { name: "Try it with sample data" }).tap();
assert(await phone.locator(".seed").textContent() === "Sample gallery", "phone sample is populated");
assert(await phone.locator(".guard-route").count() === 2, "phone sample shows both realistic guard loops");
assert(await phone.locator(".plan-slot").count() === 5, "phone sample shows five plan slots");
assert(await phone.getByText("Demo — sample data, nothing is saved to your daily game.").isVisible(), "phone sample label is visible after entry");
const sampleBoard = await phone.locator(".board").boundingBox();
assert(Boolean(sampleBoard) && sampleBoard.y < 390, "phone sample board starts inside the first 390 pixels");

await phone.getByRole("button", { name: "Reset demo" }).tap();
await enterByTouch(phone, ["D", "D", "D", "D", "D"]);
await phone.getByRole("button", { name: "Run the plan" }).tap();
await phone.getByRole("status").filter({ hasText: "hit a wall" }).waitFor({ timeout: 8000 });
assert((await phone.getByRole("status").textContent()).includes("Remove moves and try another route"), "phone invalid plan gives a clear recovery action");
assert(await phone.getByText("Demo — sample data, nothing is saved to your daily game.").isVisible(), "sample label remains after a loss");
await phone.screenshot({ path: `${output}/phone-loss.png` });

await phone.getByRole("button", { name: "Reset demo" }).tap();
assert(await phone.getByText("0/5").isVisible(), "Reset demo clears the sample plan");
assert(await phone.evaluate(() => localStorage.getItem("five-minute-heist:review-5-sentinel")) === "daily-data", "Reset demo does not change daily data");
await enterByTouch(phone, ["U", "U", "D", "L", "U"]);
await phone.getByRole("button", { name: "Run the plan" }).tap();
await phone.getByRole("status").filter({ hasText: "Guard spotted you on move 5" }).waitFor({ timeout: 8000 });
assert(true, "phone guard collision reaches a clear loss state");
await phone.getByRole("button", { name: "Reset demo" }).tap();
await enterByTouch(phone, ["U", "U", "R", "U", "U"]);
await phone.getByRole("button", { name: "Run the plan" }).tap();
await phone.getByRole("status").filter({ hasText: "Five moves ended outside the exhibit room" }).waitFor({ timeout: 8000 });
assert(true, "phone missed-goal plan reaches a clear loss state");
await phone.getByRole("button", { name: "Reset demo" }).tap();
await phone.getByRole("button", { name: "Turn sound on" }).tap();
await phone.reload({ waitUntil: "networkidle" });
assert(await phone.getByRole("button", { name: "Turn sound off" }).getAttribute("aria-pressed") === "true", "sound choice persists after reload");
await enterByTouch(phone, solution);
await phone.getByRole("button", { name: "Run the plan" }).tap();
await phone.getByRole("button", { name: "Pause plan" }).tap();
const pausedTurn = await phone.locator(".board").getAttribute("data-turn");
await phone.waitForTimeout(700);
assert(await phone.locator(".board").getAttribute("data-turn") === pausedTurn, "pause holds the active plan at the same turn");
await phone.getByRole("button", { name: "Resume plan" }).tap();
await phone.getByRole("heading", { name: "You escaped with the exhibit" }).waitFor({ timeout: 8000 });
const score = (await phone.getByText(/points$/).textContent()).trim();
const symbols = (await phone.getByLabel(/^Result symbols:/).textContent()).trim();
assert(score === "1,000 points", "phone touch run reaches the 1,000-point win screen");
assert(/^[◆◇○□△✦]{5}$/u.test(symbols), "phone end screen shows five direction-free result symbols");
assert(await phone.getByText("Demo — sample data, nothing is saved to your daily game.").isVisible(), "sample label remains on the win screen");
report.observed.phoneWin = { score, symbols };
await phone.screenshot({ path: `${output}/phone-win.png` });
await phone.getByRole("button", { name: "Play again" }).tap();
assert(await phone.getByText("0/5").isVisible(), "Play again clears the plan");

for (let run = 0; run < 3; run += 1) {
  await phone.getByRole("button", { name: "Reset demo" }).tap();
  await enterByTouch(phone, solution);
  await phone.getByRole("button", { name: "Run the plan" }).tap();
  await phone.getByRole("button", { name: "Pause plan" }).waitFor();
  report.frameRates.push(await measureFrameRate(phone));
}
const medianFps = [...report.frameRates].sort((a, b) => a - b)[1];
assert(medianFps >= 50, `phone active-play median is ${medianFps.toFixed(2)} fps, above the 50 fps floor`);
await phone.getByRole("button", { name: "Open today’s game" }).tap();
const phoneStorage = await phone.evaluate(() => Object.fromEntries(Object.keys(localStorage).map((key) => [key, localStorage.getItem(key)])));
assert(phoneStorage["five-minute-heist:review-5-sentinel"] === "daily-data", "leaving the sample preserves daily data");
assert(Object.keys(phoneStorage).every((key) => !key.startsWith("demo:five-minute-heist:")), "leaving the sample removes all sample data");
await phoneContext.close();

const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await desktopContext.grantPermissions(["clipboard-read", "clipboard-write"]);
await desktopContext.addInitScript(() => {
  Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
});
const desktop = await desktopContext.newPage();
observe(desktop, "desktop");
await desktop.goto(base, { waitUntil: "networkidle" });
const desktopBoard = await desktop.locator(".board").boundingBox();
assert(await desktop.evaluate(() => scrollY) === 0, "desktop first screen was checked before scrolling");
assert(await desktop.locator("h1").textContent() === "Plan a five-move museum heist", "desktop first screen names the job");
assert(await desktop.getByText("For solo players who want a short daily puzzle without another word game.").isVisible(), "desktop first screen names the audience");
assert(await desktop.getByRole("link", { name: "Try it with sample data" }).isVisible(), "desktop first screen shows the first action");
assert(Boolean(desktopBoard) && desktopBoard.y < 900, "desktop first screen shows the game itself");
await desktop.screenshot({ path: `${output}/cold-desktop.png` });
await desktop.getByRole("link", { name: "Try it with sample data" }).click();
await desktop.getByRole("button", { name: "Reset demo" }).click();
for (const key of ["ArrowUp", "ArrowUp", "ArrowLeft", "ArrowUp", "ArrowLeft"]) await desktop.keyboard.press(key);
await desktop.keyboard.press("Enter");
await desktop.getByRole("heading", { name: "You escaped with the exhibit" }).waitFor({ timeout: 8000 });
assert(await desktop.getByText("1,000 points").isVisible(), "desktop keyboard run reaches the 1,000-point win screen");
await desktop.screenshot({ path: `${output}/desktop-win.png` });

for (const [path, title, heading] of [
  ["/privacy", "Privacy — Five-Minute Heist", "Your game stays in your browser"],
  ["/terms", "Terms — Five-Minute Heist", "Play for free and share fairly"]
]) {
  await desktop.goto(`${base}${path}`, { waitUntil: "networkidle" });
  assert(await desktop.title() === title, `${path} has its own title`);
  assert(await desktop.locator("h1").textContent() === heading, `${path} has one clear page heading`);
}
const notFoundResponse = await desktop.goto(`${base}/not-a-real-page`, { waitUntil: "networkidle" });
assert(notFoundResponse.status() === 404, "unknown route returns the deliberate HTTP 404");
assert(await desktop.title() === "Page not found — Five-Minute Heist", "404 page has its own title");
assert(await desktop.locator("h1").textContent() === "Page not found", "404 page explains the error plainly");
await desktopContext.close();

const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const reduced = await reducedContext.newPage();
observe(reduced, "reduced-motion");
await reduced.goto(`${base}/?demo=1`, { waitUntil: "networkidle" });
assert(await reduced.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), "reduced-motion preference is active");
for (const direction of solution) await reduced.locator(`[data-direction="${direction}"]`).click();
await reduced.getByRole("button", { name: "Run the plan" }).click();
await reduced.getByRole("heading", { name: "You escaped with the exhibit" }).waitFor({ timeout: 3000 });
assert(true, "reduced-motion run reaches the win screen");
await reducedContext.close();

const offlineContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const offline = await offlineContext.newPage();
observe(offline, "offline");
await offline.goto(`${base}/?demo=1`, { waitUntil: "networkidle" });
await offline.evaluate(async () => {
  const registration = await navigator.serviceWorker.ready;
  await registration.update();
  if (!navigator.serviceWorker.controller) {
    await new Promise((resolve) => navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true }));
  }
});
await offline.reload({ waitUntil: "networkidle" });
await offlineContext.setOffline(true);
await offline.reload();
assert(await offline.getByText("You are offline. This loaded gallery is ready to play.").isVisible(), "updated service worker reloads the sample offline");
for (const direction of solution) await offline.locator(`[data-direction="${direction}"]`).click();
await offline.getByRole("button", { name: "Run the plan" }).click();
await offline.getByRole("heading", { name: "You escaped with the exhibit" }).waitFor({ timeout: 8000 });
assert(true, "offline sample completes to the win screen");
await offlineContext.close();

for (let run = 0; run < 20; run += 1) {
  const loadContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const loadPage = await loadContext.newPage();
  const started = performance.now();
  await loadPage.goto(base, { waitUntil: "load" });
  await loadPage.locator(".board").waitFor();
  report.initialLoads.push(performance.now() - started);
  await loadContext.close();
}
const sortedLoads = [...report.initialLoads].sort((a, b) => a - b);
const p95Load = sortedLoads[Math.ceil(sortedLoads.length * 0.95) - 1];
report.observed.p95InitialLoadMs = p95Load;
assert(p95Load < 2000, `20 fresh phone loads have a ${p95Load.toFixed(0)} ms p95, below the 2 second target`);

await browser.close();
assert(report.consoleErrors.length === 0, "fresh live sessions produced no application console errors");
assert(report.pageErrors.length === 0, "fresh live sessions produced no page errors");
assert(report.externalRequests.length === 0, "fresh live sessions made no external requests");
await writeFile(`${output}/live-check.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
