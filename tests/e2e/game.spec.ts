import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  cellName,
  enumeratePlans,
  findSolutions,
  generatePuzzle,
  guardPosition,
  simulatePlan,
  todaySeed,
  type Direction
} from "../../src/core";

const samplePuzzle = generatePuzzle("sample-glass-gallery");
const sampleSolution = findSolutions(samplePuzzle)[0];

async function enterPlan(page: import("@playwright/test").Page, plan: Direction[]) {
  for (const direction of plan) await page.locator(`[data-direction="${direction}"]`).click();
}

async function completeGame(page: import("@playwright/test").Page, plan = sampleSolution) {
  await enterPlan(page, plan);
  await page.getByRole("button", { name: "Run the plan" }).click();
  await expect(page.getByRole("heading", { name: "You escaped with the exhibit" })).toBeVisible({ timeout: 8_000 });
}

function productionTextFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return productionTextFiles(path);
    return /\.(?:html|js|json)$/u.test(name) ? [path] : [];
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/?demo=1");
  await page.getByRole("button", { name: "Reset demo" }).click();
});

test("@claim:sample-ready one click opens the ready isolated sample with its board in the first 390 pixels", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("link", { name: "Try it with sample data" }).click();
  await expect(page).toHaveURL(/\/?\?demo=1$/u);
  await expect(page.getByText("Demo — sample data, nothing is saved to your daily game.")).toBeVisible();
  await expect(page.getByText("seed sample-glass-gallery")).toBeVisible();
  await expect(page.locator(".guard-route")).toHaveCount(2);
  await expect(page.locator(".plan-slot")).toHaveCount(5);
  const box = await page.locator(".board").boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThan(390);
});

test("@claim:free-access a visitor completes the sample without an account or payment", async ({ page }) => {
  expect(await page.locator("form, iframe, [data-payment]").count()).toBe(0);
  await completeGame(page);
  await expect(page.getByText(/points$/u)).toBeVisible();
});

test("@claim:complete-run a valid five-move keyboard plan reaches the end screen", async ({ page }) => {
  const keyNames: Record<Direction, string> = { U: "ArrowUp", R: "ArrowRight", D: "ArrowDown", L: "ArrowLeft" };
  for (const direction of sampleSolution) await page.keyboard.press(keyNames[direction]);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "You escaped with the exhibit" })).toBeVisible({ timeout: 8_000 });
  await expect(page.getByText(/points$/u)).toBeVisible();
});

test("@claim:restart-reset play again clears all five moves", async ({ page }) => {
  await completeGame(page);
  await page.getByRole("button", { name: "Play again" }).click();
  await expect(page.getByText("0/5")).toBeVisible();
  await expect(page.getByRole("heading", { name: "You escaped with the exhibit" })).toHaveCount(0);
});

test("@claim:local-progress-storage daily plan, result, score, attempts, and sound persist in local storage", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Turn sound on" }).click();
  const dailySolution = findSolutions(generatePuzzle(todaySeed()))[0];
  await completeGame(page, dailySolution);
  const saved = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    const key = keys.find((candidate) => candidate.startsWith("five-minute-heist:progress:"));
    return { keys, value: key ? JSON.parse(localStorage.getItem(key) ?? "{}") : null };
  });
  expect(saved.keys).toHaveLength(1);
  expect(saved.value).toMatchObject({ plan: dailySolution, completedPlan: dailySolution, soundEnabled: true, attempts: 1 });
  expect(saved.value.best).toBeGreaterThan(0);
  await page.reload();
  await expect(page.getByRole("heading", { name: "You escaped with the exhibit" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Turn sound off" })).toHaveAttribute("aria-pressed", "true");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByText("0/5")).toBeVisible();
});

test("@claim:plan-preview each queued move previews the simulated player and guard positions", async ({ page }) => {
  const direction = sampleSolution[0];
  const expected = simulatePlan(samplePuzzle, [direction]).steps[0].position;
  await page.locator(`[data-direction="${direction}"]`).click();
  await expect(page.locator(".board")).toHaveAttribute("data-turn", "1");
  await expect(page.locator(`[data-cell="${cellName(expected)}"]`)).toHaveAttribute("data-player", "true");
  for (let guardIndex = 0; guardIndex < samplePuzzle.guards.length; guardIndex += 1) {
    const expectedCell = cellName(guardPosition(samplePuzzle.guards[guardIndex], 1));
    await expect(page.locator(`[data-cell="${expectedCell}"]`)).toHaveAttribute("data-guards", new RegExp(String(guardIndex + 1)));
  }
});

test("@claim:visible-guard-loops both displayed six-step loops match the generated guards", async ({ page }) => {
  const expected = samplePuzzle.guards.map((guard) =>
    Array.from({ length: 6 }, (_, turn) => cellName(guardPosition(guard, turn))).join(" → ")
  );
  await expect(page.locator(".guard-route")).toHaveText(expected);
});

test("@claim:privacy-default the full demo sets no cookies and contacts no third party", async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin) external.push(request.url());
  });
  await page.reload();
  await completeGame(page);
  expect(external).toEqual([]);
  expect(await page.context().cookies()).toEqual([]);
  expect(await page.locator('form, iframe, input[type="email"], input[type="password"], [data-payment]').count()).toBe(0);
  expect(await page.locator('script[src^="http"], link[href^="http"]:not([rel="canonical"])').count()).toBe(0);
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

test("@claim:browser-generated no answer is shipped or requested while the browser builds the board", async ({ page, baseURL }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.reload();
  await expect(page.getByText("seed sample-glass-gallery")).toBeVisible();
  expect(requests.every((url) => new URL(url).origin === new URL(baseURL!).origin)).toBe(true);
  expect(requests.some((url) => /answer|solution|api/iu.test(new URL(url).pathname))).toBe(false);
  const artifact = productionTextFiles("dist").map((path) => readFileSync(path, "utf8")).join("\n");
  expect(artifact).not.toContain(JSON.stringify(sampleSolution));
  expect(artifact).not.toContain(sampleSolution.join(""));
});

test("@claim:solvable-generator dated boards all have a valid plan", async () => {
  for (let day = 1; day <= 31; day += 1) {
    const puzzle = generatePuzzle(`2026-10-${String(day).padStart(2, "0")}`);
    expect(findSolutions(puzzle).length).toBeGreaterThan(0);
  }
});

test("@claim:exhaustive-generator the validator checks all 1,024 possible five-move routes", async () => {
  const plans = enumeratePlans();
  expect(plans).toHaveLength(1_024);
  expect(new Set(plans.map((plan) => plan.join(""))).size).toBe(1_024);
  expect(findSolutions(samplePuzzle)).toEqual(plans.filter((plan) => simulatePlan(samplePuzzle, plan).won));
  expect(generatePuzzle("sample-glass-gallery")).toEqual(generatePuzzle("sample-glass-gallery"));
});

test("@claim:demo-isolation every demo write stays under demo storage and reset or leave preserves daily data", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("five-minute-heist:sentinel", "daily-progress"));
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await page.locator('[data-direction="U"]').click();
  let keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.filter((key) => key !== "five-minute-heist:sentinel").every((key) => key.startsWith("demo:five-minute-heist:"))).toBe(true);
  await page.getByRole("button", { name: "Reset demo" }).click();
  keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toEqual(["five-minute-heist:sentinel"]);
  await page.locator('[data-direction="U"]').click();
  await page.getByRole("button", { name: "Open today’s game" }).click();
  await expect(page).toHaveURL(/\/$/u);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(["five-minute-heist:sentinel"]);
  await expect(page.getByLabel("Demo mode")).toHaveCount(0);
});

test("@claim:touch-controls on-screen controls complete the sample with touch input", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const touchPage = await context.newPage();
  await touchPage.goto(`${baseURL}/?demo=1`);
  await touchPage.getByRole("button", { name: "Reset demo" }).tap();
  for (const direction of sampleSolution) await touchPage.locator(`[data-direction="${direction}"]`).tap();
  await touchPage.getByRole("button", { name: "Run the plan" }).tap();
  await expect(touchPage.getByRole("heading", { name: "You escaped with the exhibit" })).toBeVisible({ timeout: 8_000 });
  await context.close();
});

test("@claim:original-art-provenance the game discloses its project-owned generated scene and records its prompt", async ({ page }) => {
  await expect(page.getByText("Original generated scene made for this game.")).toBeVisible();
  expect(readFileSync(".factory/design.md", "utf8")).toContain("Generation prompt sheet");
  expect(statSync("assets/src/museum-night.prompt.json").size).toBeGreaterThan(0);
});

test("real routes, titles, focus, mobile Demo navigation, hashed caching, and the designed HTTP 404", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/privacy");
  await expect(page).toHaveTitle("Privacy — Five-Minute Heist");
  await expect(page.getByRole("link", { name: "Demo", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.getByRole("link", { name: "Demo", exact: true }).click();
  await expect(page).toHaveTitle("Demo — Five-Minute Heist");
  await expect(page.locator("h1")).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle("Privacy — Five-Minute Heist");
  await expect(page.locator("h1")).toBeFocused();

  const indexResponse = await request.get("/");
  const html = await indexResponse.text();
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/gu)].map((match) => match[1]);
  expect(assets).toHaveLength(2);
  for (const asset of assets) {
    expect(asset).toMatch(/\/assets\/[^/]+-[A-Za-z0-9_-]+\.(?:js|css)$/u);
    const response = await request.get(asset);
    expect(response.headers()["cache-control"]).toContain("max-age=31536000");
    expect(response.headers()["cache-control"]).toContain("immutable");
  }

  const missing = await request.get("/not-a-real-page");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain("<h1>Page not found</h1>");
  await page.goto("/not-a-real-page");
  await expect(page).toHaveTitle("Page not found — Five-Minute Heist");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Privacy", exact: true }).last()).toHaveAttribute("href", "/privacy");
  await expect(page.getByRole("link", { name: "Terms", exact: true })).toHaveAttribute("href", "/terms");
});

test("all public pages pass the serious accessibility and console-error baseline", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  for (const route of ["/", "/?demo=1", "/demo", "/privacy", "/terms"]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  }
  expect(errors).toEqual([]);
  await page.goto("/not-a-real-page");
  const notFoundResults = await new AxeBuilder({ page: page as never }).analyze();
  expect(notFoundResults.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});

test("@claim:offline-reload the sample reloads offline after the first visit", async ({ browser, baseURL }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${baseURL}/?demo=1`);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
    }
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText("You are offline. This loaded gallery is ready to play.")).toBeVisible();
  await expect(page.getByRole("img", { name: /Five by five gallery/u })).toBeVisible();
  await context.close();
});
