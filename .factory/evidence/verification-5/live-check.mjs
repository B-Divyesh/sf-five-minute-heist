import { chromium } from "playwright";

const base = "https://five-minute-heist.sociobot.in";
const output = ".factory/evidence/verification-5";
const browser = await chromium.launch({ headless: true });
const report = { checks: [], consoleErrors: [], externalRequests: [], frameRates: [], routes: [] };

async function assert(condition, message) {
  if (!condition) throw new Error(message);
  report.checks.push(message);
}

async function coldRun(name, viewport, touch) {
  const context = await browser.newContext({ viewport, hasTouch: touch, isMobile: touch });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error" && !page.url().includes("/not-a-real-page")) report.consoleErrors.push(`${name}: ${message.text()}`);
  });
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== new URL(base).origin) report.externalRequests.push(`${name}: ${request.url()}`);
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await assert(await page.title() === "Five-Minute Heist — Plan a daily museum heist", `${name} root title is plain and route-specific`);
  await assert(await page.locator("h1").textContent() === "Plan a five-move museum heist", `${name} first screen names the job`);
  await assert(await page.getByText("For solo players who want a short daily puzzle without another word game.").isVisible(), `${name} first screen names the audience`);
  await assert(await page.getByRole("link", { name: "Try it with sample data" }).isVisible(), `${name} first screen has the first action`);
  const board = await page.locator(".board").boundingBox();
  await assert(Boolean(board) && board.y < viewport.height, `${name} first screen shows the game board`);
  await page.screenshot({ path: `${output}/cold-${name}.png`, fullPage: false });
  await page.getByRole("link", { name: "Try it with sample data" }).click();
  await assert(await page.locator(".demo-banner").isVisible(), `${name} demo label remains visible`);
  await assert(await page.locator(".seed").textContent() === "Sample gallery", `${name} sample is populated`);
  return { context, page };
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

const phone = await coldRun("phone", { width: 390, height: 844 }, true);
for (const direction of ["D", "D", "D", "D", "D"]) await phone.page.locator(`[data-direction="${direction}"]`).click();
await phone.page.getByRole("button", { name: "Run the plan" }).click();
await phone.page.waitForTimeout(1800);
await assert((await phone.page.locator(".status-line").textContent()).includes("wall") || (await phone.page.locator(".status-line").textContent()).includes("Guard") || (await phone.page.locator(".status-line").textContent()).includes("outside"), "phone invalid plan reaches a recoverable loss state");
await phone.page.screenshot({ path: `${output}/phone-loss.png`, fullPage: false });
await phone.page.getByRole("button", { name: "Reset demo" }).click();
await assert(await phone.page.getByText("0/5").isVisible(), "reset demo clears the sample plan");
await phone.page.locator("[data-direction=U]").click();
await phone.page.locator("[data-direction=U]").click();
await phone.page.locator("[data-direction=L]").click();
await phone.page.locator("[data-direction=U]").click();
await phone.page.locator("[data-direction=L]").click();
await phone.page.getByRole("button", { name: "Run the plan" }).click();
await phone.page.getByRole("heading", { name: "You escaped with the exhibit" }).waitFor({ timeout: 8000 });
await assert(await phone.page.getByText(/points$/).isVisible(), "phone valid plan reaches the scored win screen");
await phone.page.screenshot({ path: `${output}/phone-win.png`, fullPage: false });
await phone.page.getByRole("button", { name: "Play again" }).click();
await assert(await phone.page.getByText("0/5").isVisible(), "play again clears the plan");
for (let run = 0; run < 3; run += 1) {
  await phone.page.getByRole("button", { name: "Reset demo" }).click();
  for (const direction of ["U", "U", "L", "U", "L"]) await phone.page.locator(`[data-direction="${direction}"]`).click();
  await phone.page.getByRole("button", { name: "Run the plan" }).click();
  report.frameRates.push(await measureFrameRate(phone.page));
}
const medianFps = [...report.frameRates].sort((left, right) => left - right)[1];
await assert(medianFps >= 50, `phone active-play median frame rate is ${medianFps.toFixed(2)} fps (50 fps floor)`);
await phone.context.close();

const desktop = await coldRun("desktop", { width: 1440, height: 900 }, false);
await desktop.page.evaluate(() => localStorage.setItem("five-minute-heist:progress:sentinel", "daily-sentinel"));
await desktop.page.getByRole("button", { name: "Reset demo" }).click();
for (const key of ["ArrowUp", "ArrowUp", "ArrowLeft", "ArrowUp", "ArrowLeft"]) await desktop.page.keyboard.press(key);
await desktop.page.keyboard.press("Enter");
await desktop.page.getByRole("heading", { name: "You escaped with the exhibit" }).waitFor({ timeout: 8000 });
await assert(await desktop.page.getByText(/points$/).isVisible(), "desktop keyboard plan reaches the scored win screen");
await desktop.page.screenshot({ path: `${output}/desktop-win.png`, fullPage: false });
await desktop.page.getByRole("button", { name: "Open today’s game" }).click();
const storage = await desktop.page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map((key) => [key, localStorage.getItem(key)])));
await assert(storage["five-minute-heist:progress:sentinel"] === "daily-sentinel", "leaving demo preserves daily data");
await assert(Object.keys(storage).every((key) => !key.startsWith("demo:five-minute-heist:")), "leaving demo removes sample data");

for (const [path, title, heading] of [["/privacy", "Privacy — Five-Minute Heist", "Your game stays in your browser"], ["/terms", "Terms — Five-Minute Heist", "Play for free and share fairly"], ["/not-a-real-page", "Page not found — Five-Minute Heist", "Page not found"]]) {
  await desktop.page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await assert(await desktop.page.title() === title, `${path} has its route title`);
  await assert(await desktop.page.locator("h1").textContent() === heading, `${path} has its route heading`);
  report.routes.push(path);
}
await desktop.page.emulateMedia({ reducedMotion: "reduce" });
await desktop.page.goto(`${base}/?demo=1`, { waitUntil: "networkidle" });
await assert(await desktop.page.locator(".board").isVisible(), "reduced-motion demo remains playable");
await desktop.context.close();
await browser.close();
await assert(report.consoleErrors.length === 0, "fresh live sessions produced no console errors");
await assert(report.externalRequests.length === 0, "fresh live sessions made no external requests");
console.log(JSON.stringify(report, null, 2));
