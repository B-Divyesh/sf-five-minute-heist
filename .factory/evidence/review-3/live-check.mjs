import { chromium } from "playwright";

const base = "https://five-minute-heist.sociobot.in";
const out = ".factory/evidence/review-3";
const report = { coldReads: [], paths: [], consoleErrors: [], externalRequests: [], frameRates: [] };
const browser = await chromium.launch({ headless: true });

function check(value, message) {
  if (!value) throw new Error(message);
}

async function cold(name, viewport, touch) {
  const context = await browser.newContext({ viewport, hasTouch: touch, isMobile: touch });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error" && !page.url().includes("/not-a-real-page")) report.consoleErrors.push(`${name}: ${message.text()}`);
  });
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== new URL(base).origin) report.externalRequests.push(`${name}: ${request.url()}`);
  });
  await page.goto(base, { waitUntil: "networkidle" });
  check(await page.title() === "Five-Minute Heist — Plan a daily museum heist", `${name}: title`);
  check(await page.getByRole("heading", { level: 1, name: "Plan a five-move museum heist" }).isVisible(), `${name}: job`);
  check(await page.getByText("For solo players who want a short daily puzzle without another word game.").isVisible(), `${name}: audience`);
  check(await page.getByRole("link", { name: "Try it with sample data" }).isVisible(), `${name}: action`);
  const board = await page.locator(".board").boundingBox();
  check(Boolean(board) && board.y < viewport.height, `${name}: board is above the fold`);
  await page.screenshot({ path: `${out}/cold-${name}.png`, fullPage: false });
  await page.getByRole("link", { name: "Try it with sample data" }).click();
  check(await page.getByLabel("Demo mode").isVisible(), `${name}: persistent demo label`);
  check((await page.locator(".seed").textContent()) === "Sample gallery", `${name}: populated sample`);
  report.coldReads.push(name);
  return { context, page };
}

function fps(page) {
  return page.evaluate(() => new Promise((resolve) => {
    const frames = [];
    let previous = performance.now();
    const tick = (now) => {
      frames.push(now - previous);
      previous = now;
      if (frames.length < 65) requestAnimationFrame(tick);
      else resolve(1000 / (frames.slice(5).reduce((sum, frame) => sum + frame, 0) / 60));
    };
    requestAnimationFrame(tick);
  }));
}

async function plan(page, moves, keyboard = false) {
  for (const move of moves) {
    if (keyboard) await page.keyboard.press({ U: "ArrowUp", R: "ArrowRight", D: "ArrowDown", L: "ArrowLeft" }[move]);
    else await page.locator(`[data-direction="${move}"]`).click();
  }
  if (keyboard) await page.keyboard.press("Enter");
  else await page.getByRole("button", { name: "Run the plan" }).click();
}

const phone = await cold("phone", { width: 390, height: 844 }, true);
await plan(phone.page, ["D", "D", "D", "D", "D"]);
await phone.page.getByRole("status").filter({ hasText: /wall|Guard|outside/u }).waitFor({ timeout: 8_000 });
await phone.page.screenshot({ path: `${out}/phone-loss.png`, fullPage: false });
report.paths.push("phone invalid plan reached a clear loss");
await phone.page.getByRole("button", { name: "Reset demo" }).click();
check(await phone.page.getByText("0/5").isVisible(), "phone reset clears plan");
await plan(phone.page, ["U", "U", "L", "U", "L"]);
await phone.page.getByRole("heading", { name: "You escaped with the exhibit" }).waitFor({ timeout: 8_000 });
await phone.page.screenshot({ path: `${out}/phone-win.png`, fullPage: false });
report.paths.push("phone reset then valid touch plan reached scored win");
await phone.page.getByRole("button", { name: "Play again" }).click();
check(await phone.page.getByText("0/5").isVisible(), "phone play again clears plan");
for (let run = 0; run < 3; run += 1) {
  await phone.page.getByRole("button", { name: "Reset demo" }).click();
  await plan(phone.page, ["U", "U", "L", "U", "L"]);
  await phone.page.getByRole("button", { name: "Pause plan" }).waitFor();
  report.frameRates.push(await fps(phone.page));
}
report.frameRates.sort((a, b) => a - b);
check(report.frameRates[1] >= 50, `frame-rate median ${report.frameRates[1]}`);
await phone.context.close();

const desktop = await cold("desktop", { width: 1440, height: 900 }, false);
await desktop.page.evaluate(() => localStorage.setItem("five-minute-heist:progress:sentinel", "daily-sentinel"));
await desktop.page.getByRole("button", { name: "Reset demo" }).click();
await plan(desktop.page, ["U", "U", "L", "U", "L"], true);
await desktop.page.getByRole("heading", { name: "You escaped with the exhibit" }).waitFor({ timeout: 8_000 });
await desktop.page.screenshot({ path: `${out}/desktop-win.png`, fullPage: false });
report.paths.push("desktop keyboard plan reached scored win");
await desktop.page.getByRole("button", { name: "Open today’s game" }).click();
const storage = await desktop.page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map((key) => [key, localStorage.getItem(key)])));
check(storage["five-minute-heist:progress:sentinel"] === "daily-sentinel", "daily sentinel survives demo");
check(Object.keys(storage).every((key) => !key.startsWith("demo:five-minute-heist:")), "leaving demo clears demo data");
for (const [route, title, heading] of [["/privacy", "Privacy — Five-Minute Heist", "Your game stays in your browser"], ["/terms", "Terms — Five-Minute Heist", "Play for free and share fairly"], ["/not-a-real-page", "Page not found — Five-Minute Heist", "Page not found"]]) {
  await desktop.page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  check(await desktop.page.title() === title, `${route}: title`);
  check((await desktop.page.locator("h1").textContent()) === heading, `${route}: h1`);
}
await desktop.page.emulateMedia({ reducedMotion: "reduce" });
await desktop.page.goto(`${base}/?demo=1`, { waitUntil: "networkidle" });
check(await desktop.page.locator(".board").isVisible(), "reduced-motion demo is playable");
await desktop.context.close();
await browser.close();
check(report.consoleErrors.length === 0, `console errors: ${report.consoleErrors.join("; ")}`);
check(report.externalRequests.length === 0, `external requests: ${report.externalRequests.join("; ")}`);
console.log(JSON.stringify(report, null, 2));
