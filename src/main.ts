import "./style.css";
import {
  GRID_SIZE,
  MOVE_COUNT,
  cellName,
  directionArrows,
  generatePuzzle,
  guardPosition,
  pathGlyph,
  positionKey,
  samePosition,
  simulatePlan,
  todaySeed,
  type Direction,
  type Position,
  type Puzzle
} from "./core";

type Phase = "planning" | "running" | "paused" | "won" | "failed";
type SavedGame = {
  plan: Direction[];
  attempts: number;
  best: number;
  completedPlan: Direction[] | null;
  soundEnabled: boolean;
};

type GameState = SavedGame & {
  puzzle: Puzzle;
  seed: string;
  phase: Phase;
  currentStep: number;
  message: string;
  copied: boolean;
};

const appElement = document.querySelector<HTMLDivElement>("#app");
if (!appElement) throw new Error("The game could not start because its page container is missing.");
const app: HTMLDivElement = appElement;

const DEMO_SEED = "sample-glass-gallery";
const APP_VERSION = "1.0.0";
const demoPrefix = "demo:five-minute-heist";
const realPrefix = "five-minute-heist";
let game: GameState | null = null;
let animationFrame = 0;
let lastFrame = 0;
let accumulator = 0;
let storageAvailable = true;
let audioContext: AudioContext | null = null;

function isDemo(): boolean {
  return location.pathname === "/demo" || new URLSearchParams(location.search).get("demo") === "1";
}

function storageKey(seed: string): string {
  return `${isDemo() ? demoPrefix : realPrefix}:progress:${seed}`;
}

function defaultSaved(): SavedGame {
  return { plan: [], attempts: 0, best: 0, completedPlan: null, soundEnabled: false };
}

function loadSaved(seed: string): SavedGame {
  try {
    const raw = localStorage.getItem(storageKey(seed));
    if (!raw) return defaultSaved();
    const parsed = JSON.parse(raw) as Partial<SavedGame>;
    return {
      plan: Array.isArray(parsed.plan) ? parsed.plan.slice(0, MOVE_COUNT) as Direction[] : [],
      attempts: Number.isFinite(parsed.attempts) ? Number(parsed.attempts) : 0,
      best: Number.isFinite(parsed.best) ? Number(parsed.best) : 0,
      completedPlan: Array.isArray(parsed.completedPlan) ? parsed.completedPlan as Direction[] : null,
      soundEnabled: parsed.soundEnabled === true
    };
  } catch {
    storageAvailable = false;
    return defaultSaved();
  }
}

function saveGame(): void {
  if (!game) return;
  try {
    const saved: SavedGame = {
      plan: game.plan,
      attempts: game.attempts,
      best: game.best,
      completedPlan: game.completedPlan,
      soundEnabled: game.soundEnabled
    };
    localStorage.setItem(storageKey(game.seed), JSON.stringify(saved));
  } catch {
    storageAvailable = false;
    game.message = "Progress could not be saved. Keep this tab open to finish your plan.";
  }
}

function makeGame(): GameState {
  const seed = isDemo() ? DEMO_SEED : todaySeed();
  const puzzle = generatePuzzle(seed);
  const saved = loadSaved(seed);
  return {
    ...saved,
    puzzle,
    seed,
    phase: saved.completedPlan ? "won" : "planning",
    currentStep: saved.completedPlan ? MOVE_COUNT : saved.plan.length,
    message: saved.completedPlan
      ? "You already escaped this gallery. Play it again or copy your result."
      : "Add five moves. The board previews the guards after each move.",
    copied: false
  };
}

function safeGame(): GameState | null {
  try {
    if (!game) game = makeGame();
    return game;
  } catch {
    return null;
  }
}

const routeCopy: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Five-Minute Heist — Plan a daily museum escape",
    description: "Plan five moves around looping guards, then watch your daily museum heist unfold."
  },
  "/demo": {
    title: "Demo — Five-Minute Heist",
    description: "Try a sample five-move museum heist without changing your daily progress."
  },
  "/privacy": {
    title: "Privacy — Five-Minute Heist",
    description: "How Five-Minute Heist stores game progress in your browser."
  },
  "/terms": {
    title: "Terms — Five-Minute Heist",
    description: "Terms for playing Five-Minute Heist."
  },
  "/404": {
    title: "Page not found — Five-Minute Heist",
    description: "This Five-Minute Heist page does not exist."
  }
};

function normalizedRoute(): string {
  if (location.pathname === "/" && new URLSearchParams(location.search).get("demo") === "1") return "/demo";
  return routeCopy[location.pathname] ? location.pathname : "/404";
}

function updateMetadata(route: string): void {
  const meta = routeCopy[route];
  document.title = meta.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", meta.description);
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `https://five-minute-heist.sociobot.in${route === "/" ? "/" : route}`;
}

function header(route: string): string {
  const current = (path: string) => route === path ? ' aria-current="page"' : "";
  return `<header class="site-header">
    <a class="wordmark" href="/" data-route><span class="mark" aria-hidden="true"></span>Five-Minute Heist</a>
    <nav class="site-nav" aria-label="Main navigation">
      <a href="/" data-route${current("/")}>Daily</a>
      <a href="/demo" data-route${current("/demo")}>Demo</a>
      <a href="/privacy" data-route${current("/privacy")}>Privacy</a>
    </nav>
  </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <div>
      <strong>Five-Minute Heist</strong> — Plan five moves through one daily museum.<br>
      <span>Original generated scene made for this game. Version ${APP_VERSION}.</span>
    </div>
    <div class="footer-links">
      <a href="/privacy" data-route>Privacy</a>
      <a href="/terms" data-route>Terms</a>
      <a href="https://hello-factory.sociobot.in" target="_blank" rel="noopener">Built by Param Factory <span class="sr-only">(opens in a new tab)</span></a>
    </div>
  </footer>`;
}

function demoBanner(): string {
  if (!isDemo()) return "";
  return `<aside class="demo-banner" aria-label="Demo mode">
    <span>Demo — sample data, nothing is saved to your daily game.</span>
    <button type="button" data-action="reset-demo">Reset demo</button>
    <button type="button" data-action="start-real">Start for real</button>
  </aside>`;
}

function offlineBanner(): string {
  return `<div class="offline-banner" role="status" ${navigator.onLine ? "hidden" : ""}>You are offline. This loaded gallery is ready to play.</div>`;
}

function currentBoardState(state: GameState): { player: Position; turn: number; bonusTaken: boolean; caught: boolean } {
  const plan = state.completedPlan && state.phase === "won" ? state.completedPlan : state.plan;
  const turn = state.phase === "planning" ? plan.length : state.currentStep;
  const result = simulatePlan(state.puzzle, plan.slice(0, turn));
  const latest = result.steps[result.steps.length - 1];
  return {
    player: latest?.position ?? state.puzzle.start,
    turn,
    bonusTaken: latest?.bonusTaken ?? !state.puzzle.bonus,
    caught: latest?.caught ?? false
  };
}

function boardMarkup(state: GameState): string {
  const boardState = currentBoardState(state);
  const walls = new Set(state.puzzle.walls.map(positionKey));
  const routeCells = new Set<string>();
  let routePosition = state.puzzle.start;
  state.plan.slice(0, boardState.turn).forEach((_direction, index) => {
    const partial = simulatePlan(state.puzzle, state.plan.slice(0, index + 1));
    const latest = partial.steps[partial.steps.length - 1];
    if (latest) routePosition = latest.position;
    routeCells.add(positionKey(routePosition));
  });
  const cells: string[] = [];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const position = { x, y };
      const key = positionKey(position);
      const guards = state.puzzle.guards
        .map((guard, index) => ({ position: guardPosition(guard, boardState.turn), index }))
        .filter((guard) => samePosition(guard.position, position));
      const classes = ["cell"];
      if (walls.has(key)) classes.push("wall");
      if (routeCells.has(key)) classes.push("route");
      if (samePosition(position, boardState.player)) classes.push("active");
      if (boardState.caught && samePosition(position, boardState.player)) classes.push("caught");
      const pieces: string[] = [];
      if (samePosition(position, state.puzzle.vault)) pieces.push('<span class="piece vault" aria-hidden="true"><span>ART</span></span>');
      if (state.puzzle.bonus && samePosition(position, state.puzzle.bonus)) {
        pieces.push(`<span class="piece bonus${boardState.bonusTaken ? " taken" : ""}" aria-hidden="true">+</span>`);
      }
      guards.forEach((guard) => pieces.push(`<span class="piece guard" aria-hidden="true">G${guard.index + 1}</span>`));
      if (samePosition(position, boardState.player)) pieces.push('<span class="piece player" aria-hidden="true">YOU</span>');
      cells.push(`<div class="${classes.join(" ")}" data-cell="${cellName(position)}">${pieces.join("")}</div>`);
    }
  }

  const description = `Five by five gallery. You are in ${cellName(boardState.player)}. The exhibit is in ${cellName(state.puzzle.vault)}.${state.puzzle.bonus ? ` Take the seal in ${cellName(state.puzzle.bonus)} first.` : ""}`;
  return `<div class="board" role="img" aria-label="${description}">${cells.join("")}</div>`;
}

function guardKey(state: GameState): string {
  return `<ol class="guard-key" aria-label="Guard loops">${state.puzzle.guards.map((guard, index) => {
    const route = Array.from({ length: 6 }, (_, turn) => cellName(guardPosition(guard, turn))).join(" → ");
    return `<li><strong>Guard ${index + 1} loop</strong><span class="guard-route">${route}</span></li>`;
  }).join("")}</ol>`;
}

function statusClass(state: GameState): string {
  if (state.phase === "won") return " is-success";
  if (state.phase === "failed") return " is-danger";
  return "";
}

function endCard(state: GameState): string {
  if (state.phase !== "won" || !state.completedPlan) return "";
  const score = state.best;
  const glyph = pathGlyph(state.completedPlan, state.seed);
  return `<section class="end-card" aria-labelledby="result-heading">
    <h3 id="result-heading">You escaped with the exhibit</h3>
    <p class="score">${score.toLocaleString()} points</p>
    <p class="glyph" aria-label="Sealed path ${glyph.split("").join(" ")}">${glyph}</p>
    <div class="end-actions">
      <button type="button" data-action="copy-result">${state.copied ? "Result copied" : "Copy result"}</button>
      <button type="button" data-action="play-again">Play again</button>
    </div>
  </section>`;
}

function gameMarkup(state: GameState): string {
  const objective = state.puzzle.bonus
    ? `Reach the exhibit in ${cellName(state.puzzle.vault)} after taking the seal in ${cellName(state.puzzle.bonus)}.`
    : `Reach the exhibit in ${cellName(state.puzzle.vault)} in exactly five moves.`;
  const plan = state.completedPlan && state.phase === "won" ? state.completedPlan : state.plan;
  const slots = Array.from({ length: MOVE_COUNT }, (_, index) => {
    const direction = plan[index];
    const current = state.phase === "running" && state.currentStep === index + 1;
    return `<span class="plan-slot${direction ? " filled" : ""}${current ? " current" : ""}" aria-label="Move ${index + 1}${direction ? `: ${direction}` : ": empty"}">${direction ? directionArrows[direction] : index + 1}</span>`;
  }).join("");
  const disabled = state.phase !== "planning" && state.phase !== "failed";
  const dateLabel = isDemo() ? "Sample gallery" : new Date(`${state.seed}T12:00:00Z`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  return `<section class="game-shell" id="game" aria-label="Five-move planning board">
    <div class="game-topline">
      <div><p class="game-title">${isDemo() ? "Practice gallery" : "Today’s gallery"}</p><span class="seed">${dateLabel} · seed ${state.seed}</span></div>
      <button class="sound-button" type="button" data-action="toggle-sound" aria-pressed="${state.soundEnabled}">Sound ${state.soundEnabled ? "on" : "off"}</button>
    </div>
    <p class="objective"><strong>Goal:</strong> ${objective}</p>
    <div class="status-line${statusClass(state)}" role="status" aria-live="polite">${state.message}</div>
    <div class="board-wrap">
      ${boardMarkup(state)}
      ${guardKey(state)}
    </div>
    <div class="plan-area">
      <div class="plan-label"><span>Your five moves</span><span>${plan.length}/${MOVE_COUNT}</span></div>
      <div class="plan-slots" aria-label="Planned moves">${slots}</div>
      <div class="controls" aria-label="Add a move">
        ${(["U", "R", "D", "L"] as Direction[]).map((direction) => `<button class="direction" type="button" data-direction="${direction}" aria-label="Add move ${direction} — ${{ U: "up", R: "right", D: "down", L: "left" }[direction]}" ${disabled || state.plan.length >= MOVE_COUNT ? "disabled" : ""}>${directionArrows[direction]}</button>`).join("")}
      </div>
      <div class="game-actions">
        <button type="button" data-action="undo" ${disabled || state.plan.length === 0 ? "disabled" : ""}>Remove last move</button>
        ${state.phase === "running" || state.phase === "paused"
          ? `<button class="execute" type="button" data-action="toggle-pause">${state.phase === "paused" ? "Resume plan" : "Pause plan"}</button>`
          : `<button class="execute" type="button" data-action="execute" ${state.plan.length !== MOVE_COUNT || state.phase === "won" ? "disabled" : ""}>Run the plan</button>`}
      </div>
    </div>
    ${endCard(state)}
  </section>`;
}

function gameErrorMarkup(): string {
  return `<section class="game-shell" id="game"><p class="game-title">The gallery could not be prepared</p><p>Reload the page to generate today’s board again.</p><button type="button" data-action="reload">Reload game</button></section>`;
}

function landing(route: "/" | "/demo"): string {
  const state = safeGame();
  const demo = route === "/demo";
  return `${header(route)}${demoBanner()}${offlineBanner()}
    <main id="main">
      <section class="hero">
        <div class="hero-layout">
          <div class="hero-copy">
            <p class="eyebrow">One gallery each day · five moves</p>
            <h1 tabindex="-1">${demo ? "Plan this five-move museum heist" : "Plan a five-move museum heist"}</h1>
            <p class="hero-intro">For solo players who want a short daily puzzle without another word game.</p>
            ${demo
              ? '<a class="primary-action" href="#game">Play the sample below</a><p class="action-note">The sample has its own progress and can be reset.</p>'
              : '<a class="primary-action" href="/demo" data-route>Try it with sample data</a><p class="action-note">A practice gallery opens with a ready puzzle.</p>'}
            <ul class="facts"><li>Free to play.</li><li>Works offline after your first visit.</li><li>Progress stays in this browser.</li></ul>
          </div>
          ${state ? gameMarkup(state) : gameErrorMarkup()}
        </div>
      </section>
      <section class="content-section" aria-labelledby="how-heading">
        <div class="section-inner"><h2 class="section-heading" id="how-heading">How the daily heist works</h2>
          <ol class="steps">
            <li><h3>Study both guard loops</h3><p>Each line shows where that guard stands after every move.</p></li>
            <li><h3>Queue five moves</h3><p>Use the arrow buttons or arrow keys. The board previews each step.</p></li>
            <li><h3>Run and share</h3><p>Watch the plan play. A sealed glyph shares the result without directions.</p></li>
          </ol>
        </div>
      </section>
      <section class="content-section" aria-labelledby="privacy-heading">
        <div class="section-inner plain-grid"><h2 id="privacy-heading">What the game does not do</h2><div><p>It does not use accounts, tracking cookies, ads, or paid hints.</p><p>Your plan, result, and sound choice stay in local browser storage. Demo progress uses a separate sample key.</p><p>The daily generator sends no answer. It builds and checks the gallery in your browser.</p></div></div>
      </section>
    </main>${footer()}`;
}

function privacyPage(): string {
  return `${header("/privacy")}${offlineBanner()}<main id="main" class="text-page"><article>
    <p class="eyebrow">Privacy</p><h1 tabindex="-1">Your game stays in your browser</h1>
    <p>Five-Minute Heist does not ask for an account or collect personal details.</p>
    <h2>What is stored</h2><p>Your current plan, attempts, best score, completed result, and sound choice use local browser storage.</p>
    <h2>Demo separation</h2><p>The demo uses storage keys that start with <code>demo:</code>. Resetting or leaving the demo removes those sample keys.</p>
    <h2>Network requests</h2><p>The game loads its own files from this site. It does not load analytics, ads, third-party fonts, or tracking scripts.</p>
    <h2>Remove your data</h2><p>Clear this site’s browser storage to remove all saved progress.</p>
    <h2>Questions</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p>
  </article></main>${footer()}`;
}

function termsPage(): string {
  return `${header("/terms")}${offlineBanner()}<main id="main" class="text-page"><article>
    <p class="eyebrow">Terms</p><h1 tabindex="-1">Play for free and share fairly</h1>
    <p>Five-Minute Heist is a free browser game for personal use.</p>
    <h2>Use of the game</h2><p>You may play and share the result text. Do not attack the site or interfere with other visitors.</p>
    <h2>Availability</h2><p>The game is provided as available. Daily boards and site access may change.</p>
    <h2>Ownership</h2><p>The source code is available under the MIT License. Original game art remains part of this project.</p>
    <h2>Contact</h2><p>Email <a href="mailto:hello@sociobot.in">hello@sociobot.in</a> with questions.</p>
  </article></main>${footer()}`;
}

function notFoundPage(): string {
  return `${header("/404")}<main id="main" class="text-page not-found"><article><p class="eyebrow">404</p><h1 tabindex="-1">This room is not in the gallery</h1><p>The page may have moved. Today’s heist is still ready.</p><a class="primary-action" href="/" data-route>Return to today’s game</a></article></main>${footer()}`;
}

function render(focusHeading = false): void {
  const route = normalizedRoute();
  updateMetadata(route);
  if (route === "/") app.innerHTML = landing("/");
  else if (route === "/demo") app.innerHTML = landing("/demo");
  else if (route === "/privacy") app.innerHTML = privacyPage();
  else if (route === "/terms") app.innerHTML = termsPage();
  else app.innerHTML = notFoundPage();
  if (focusHeading) requestAnimationFrame(() => app.querySelector<HTMLElement>("h1")?.focus());
}

function navigate(path: string): void {
  cancelAnimationFrame(animationFrame);
  history.pushState({}, "", path);
  game = null;
  scrollTo({ top: 0, behavior: "auto" });
  render(true);
}

function addMove(direction: Direction): void {
  if (!game || !["planning", "failed"].includes(game.phase) || game.plan.length >= MOVE_COUNT) return;
  game.phase = "planning";
  game.plan.push(direction);
  game.currentStep = game.plan.length;
  const preview = simulatePlan(game.puzzle, game.plan);
  if (preview.blocked) game.message = "That move hits a wall. Remove it and choose another direction.";
  else if (preview.caught) game.message = "A guard reaches that room then. Remove the move and try another route.";
  else if (game.plan.length === MOVE_COUNT) game.message = "Five moves are ready. Run the plan when you are set.";
  else game.message = `Move ${game.plan.length} added. Add ${MOVE_COUNT - game.plan.length} more.`;
  saveGame();
  playTone(310 + game.plan.length * 35, 0.045);
  render();
}

function undoMove(): void {
  if (!game || !["planning", "failed"].includes(game.phase) || game.plan.length === 0) return;
  game.phase = "planning";
  game.plan.pop();
  game.currentStep = game.plan.length;
  game.message = game.plan.length ? `Last move removed. ${MOVE_COUNT - game.plan.length} moves remain.` : "The plan is empty. Add five moves.";
  saveGame();
  render();
}

function executePlan(): void {
  if (!game || game.plan.length !== MOVE_COUNT || !["planning", "failed"].includes(game.phase)) return;
  game.phase = "running";
  game.currentStep = 0;
  game.attempts += 1;
  game.message = "The plan is running. Move 1 is next.";
  saveGame();
  render();
  lastFrame = performance.now();
  accumulator = 0;
  animationFrame = requestAnimationFrame(runFrame);
}

function runFrame(time: number): void {
  if (!game || game.phase !== "running") return;
  const elapsed = Math.min(time - lastFrame, 100);
  lastFrame = time;
  accumulator += elapsed;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stepTime = reduced ? 80 : 520;
  if (accumulator >= stepTime) {
    accumulator -= stepTime;
    game.currentStep += 1;
    const result = simulatePlan(game.puzzle, game.plan.slice(0, game.currentStep));
    playTone(result.caught || result.blocked ? 120 : 420 + game.currentStep * 25, 0.075);
    if (result.caught) {
      game.phase = "failed";
      game.message = `Guard spotted you on move ${game.currentStep}. Remove a move or reset the plan.`;
    } else if (result.blocked) {
      game.phase = "failed";
      game.message = `Move ${game.currentStep} hit a wall. Remove a move or reset the plan.`;
    } else if (game.currentStep === MOVE_COUNT) {
      const final = simulatePlan(game.puzzle, game.plan);
      if (final.won) {
        const score = Math.max(400, 1100 - game.attempts * 100);
        game.best = Math.max(game.best, score);
        game.completedPlan = [...game.plan];
        game.phase = "won";
        game.message = "The plan worked. You reached the exhibit without meeting a guard.";
        playTone(720, 0.16);
      } else if (!final.reachedVault) {
        game.phase = "failed";
        game.message = "Five moves ended outside the exhibit room. Change the plan and run it again.";
      } else {
        game.phase = "failed";
        game.message = "You reached the exhibit without the seal. Route through the marked seal first.";
      }
    } else {
      game.message = `Move ${game.currentStep} is clear. Move ${game.currentStep + 1} is next.`;
    }
    saveGame();
    render();
  }
  if (game?.phase === "running") animationFrame = requestAnimationFrame(runFrame);
}

function resetPlan(): void {
  if (!game) return;
  cancelAnimationFrame(animationFrame);
  game.plan = [];
  game.completedPlan = null;
  game.phase = "planning";
  game.currentStep = 0;
  game.copied = false;
  game.message = "The plan is empty. Add five moves.";
  saveGame();
  render();
}

function playAgain(): void {
  resetPlan();
  document.querySelector<HTMLElement>(".direction")?.focus();
}

function togglePause(): void {
  if (!game) return;
  if (game.phase === "running") {
    game.phase = "paused";
    game.message = `Paused after move ${game.currentStep}. Resume when you are ready.`;
    cancelAnimationFrame(animationFrame);
  } else if (game.phase === "paused") {
    game.phase = "running";
    game.message = `Resuming from move ${game.currentStep}.`;
    lastFrame = performance.now();
    animationFrame = requestAnimationFrame(runFrame);
  }
  render();
}

function toggleSound(): void {
  if (!game) return;
  game.soundEnabled = !game.soundEnabled;
  if (game.soundEnabled) playTone(520, 0.08);
  saveGame();
  render();
  document.querySelector<HTMLElement>("[data-action='toggle-sound']")?.focus();
}

function playTone(frequency: number, duration: number): void {
  if (!game?.soundEnabled) return;
  audioContext ??= new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.055, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

async function copyResult(): Promise<void> {
  if (!game?.completedPlan) return;
  const score = game.best;
  const text = `Five-Minute Heist ${isDemo() ? "sample" : game.seed}\n${pathGlyph(game.completedPlan, game.seed)}\n${score} points · ${game.attempts} attempt${game.attempts === 1 ? "" : "s"}\nhttps://five-minute-heist.sociobot.in`;
  try {
    if (navigator.share) await navigator.share({ title: "Five-Minute Heist", text });
    else await navigator.clipboard.writeText(text);
    game.copied = true;
    game.message = "Result copied. The glyph does not show your directions.";
  } catch (error) {
    if ((error as DOMException).name !== "AbortError") game.message = "The result could not be copied. Use your browser’s share menu instead.";
  }
  render();
}

function clearDemo(): void {
  try {
    Object.keys(localStorage).filter((key) => key.startsWith(`${demoPrefix}:`)).forEach((key) => localStorage.removeItem(key));
  } catch { storageAvailable = false; }
}

app.addEventListener("click", (event) => {
  const target = (event.target as Element).closest<HTMLElement>("a, button");
  if (!target) return;
  if (target.matches("a[data-route]")) {
    event.preventDefault();
    navigate((target as HTMLAnchorElement).pathname);
    return;
  }
  const direction = target.dataset.direction as Direction | undefined;
  if (direction) addMove(direction);
  const action = target.dataset.action;
  if (action === "undo") undoMove();
  if (action === "execute") executePlan();
  if (action === "toggle-pause") togglePause();
  if (action === "toggle-sound") toggleSound();
  if (action === "play-again") playAgain();
  if (action === "copy-result") void copyResult();
  if (action === "reset-demo") { clearDemo(); game = makeGame(); render(); }
  if (action === "start-real") { clearDemo(); navigate("/"); }
  if (action === "reload") location.reload();
});

document.addEventListener("keydown", (event) => {
  if (!game || !["planning", "failed"].includes(game.phase)) return;
  const directionByKey: Record<string, Direction> = { ArrowUp: "U", ArrowRight: "R", ArrowDown: "D", ArrowLeft: "L" };
  if (directionByKey[event.key]) {
    event.preventDefault();
    addMove(directionByKey[event.key]);
  } else if (event.key === "Backspace") {
    event.preventDefault();
    undoMove();
  } else if (event.key === "Enter" && game.plan.length === MOVE_COUNT) {
    event.preventDefault();
    executePlan();
  }
});

addEventListener("popstate", () => { game = null; render(true); });
addEventListener("online", () => render());
addEventListener("offline", () => render());
document.addEventListener("visibilitychange", () => {
  if (!game) return;
  if (document.hidden && game.phase === "running") {
    game.phase = "paused";
    game.message = `Paused after move ${game.currentStep}. Resume when you are ready.`;
    cancelAnimationFrame(animationFrame);
  }
});

render();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => undefined));
}
