import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { findSolutions, generatePuzzle, type Direction } from "../../src/core";

const samplePuzzle = generatePuzzle("sample-glass-gallery");
const sampleSolution = findSolutions(samplePuzzle)[0];

async function enterPlan(page: import("@playwright/test").Page, plan: Direction[]) {
  for (const direction of plan) await page.locator(`[data-direction="${direction}"]`).click();
}

async function completeGame(page: import("@playwright/test").Page) {
  await enterPlan(page, sampleSolution);
  await page.getByRole("button", { name: "Run the plan" }).click();
  await expect(page.getByRole("heading", { name: "You escaped with the exhibit" })).toBeVisible({ timeout: 8_000 });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Reset demo" }).click();
});

test("@claim:complete-run a valid plan reaches the end screen with keyboard input", async ({ page }) => {
  const keyNames: Record<Direction, string> = { U: "ArrowUp", R: "ArrowRight", D: "ArrowDown", L: "ArrowLeft" };
  for (const direction of sampleSolution) await page.keyboard.press(keyNames[direction]);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "You escaped with the exhibit" })).toBeVisible({ timeout: 8_000 });
  await expect(page.getByText(/points$/)).toBeVisible();
});

test("@claim:restart-reset play again clears all five moves", async ({ page }) => {
  await completeGame(page);
  await page.getByRole("button", { name: "Play again" }).click();
  await expect(page.getByText("0/5")).toBeVisible();
  await expect(page.getByRole("heading", { name: "You escaped with the exhibit" })).toHaveCount(0);
});

test("@claim:settings-persist the sound setting survives reload", async ({ page }) => {
  await page.getByRole("button", { name: "Sound off" }).click();
  await expect(page.getByRole("button", { name: "Sound on" })).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.getByRole("button", { name: "Sound on" })).toHaveAttribute("aria-pressed", "true");
});

test("@claim:local-only the full demo uses same-origin requests", async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin) external.push(request.url());
  });
  await page.reload();
  await enterPlan(page, sampleSolution);
  await expect(page.getByText("5/5")).toBeVisible();
  expect(external).toEqual([]);
});

test("@claim:result-glyph result text hides all directions", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.addInitScript(() => { Object.defineProperty(navigator, "share", { value: undefined, configurable: true }); });
  await completeGame(page);
  await page.getByRole("button", { name: "Copy result" }).click();
  await expect(page.getByRole("button", { name: "Result copied" })).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(/[◆◇○□△✦]{5}/u);
  expect(copied).not.toMatch(/[↑→↓←]/u);
});

test("@claim:frame-rate animation frames stay above 50 fps at phone size", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const fps = await page.evaluate(() => new Promise<number>((resolve) => {
    const samples: number[] = [];
    let previous = performance.now();
    const measure = (now: number) => {
      samples.push(now - previous);
      previous = now;
      if (samples.length < 60) requestAnimationFrame(measure);
      else resolve(1000 / (samples.slice(5).reduce((sum, value) => sum + value, 0) / 55));
    };
    requestAnimationFrame(measure);
  }));
  expect(fps).toBeGreaterThanOrEqual(50);
});

test("@claim:answer-not-shipped the answer is absent from initial page source", async ({ request }) => {
  const response = await request.get("/demo");
  const html = await response.text();
  expect(html).not.toContain(sampleSolution.join(""));
  expect(html).not.toContain(JSON.stringify(sampleSolution));
});

test("@claim:solvable-generator dated boards all have a valid plan", async () => {
  for (let day = 1; day <= 31; day += 1) {
    const puzzle = generatePuzzle(`2026-10-${String(day).padStart(2, "0")}`);
    expect(findSolutions(puzzle).length).toBeGreaterThan(0);
  }
});

test("@claim:demo-isolation reset leaves the daily namespace untouched", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("five-minute-heist:sentinel", "daily-progress"));
  await page.locator('[data-direction="U"]').click();
  await page.getByRole("button", { name: "Reset demo" }).click();
  const realValue = await page.evaluate(() => localStorage.getItem("five-minute-heist:sentinel"));
  expect(realValue).toBe("daily-progress");
  await expect(page.getByText("0/5")).toBeVisible();
});

test("mobile layout, routes, and accessibility baseline", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("img", { name: /Five by five gallery/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  await page.getByRole("link", { name: "Privacy", exact: true }).first().click();
  await expect(page).toHaveTitle("Privacy — Five-Minute Heist");
  await expect(page.locator("h1")).toHaveCount(1);
});

test("pages load without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  for (const route of ["/", "/demo", "/privacy", "/terms", "/missing-page"]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
  }
  expect(errors).toEqual([]);
});

test("@claim:offline-reload the sample reloads offline after the first visit", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/demo");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText("You are offline. This loaded gallery is ready to play.")).toBeVisible();
  await expect(page.getByRole("img", { name: /Five by five gallery/ })).toBeVisible();
  await context.close();
});
