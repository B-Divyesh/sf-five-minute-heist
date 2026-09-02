export const GRID_SIZE = 5;
export const MOVE_COUNT = 5;

export type Direction = "U" | "R" | "D" | "L";
export type Position = { x: number; y: number };
export type Guard = { route: Position[]; phase: number };
export type Puzzle = {
  seed: string;
  start: Position;
  vault: Position;
  bonus: Position | null;
  walls: Position[];
  guards: Guard[];
  solutions: number;
};

export type StepResult = {
  position: Position;
  caught: boolean;
  blocked: boolean;
  bonusTaken: boolean;
};

export type PlanResult = {
  won: boolean;
  caught: boolean;
  blocked: boolean;
  reachedVault: boolean;
  bonusTaken: boolean;
  steps: StepResult[];
};

const vectors: Record<Direction, Position> = {
  U: { x: 0, y: -1 },
  R: { x: 1, y: 0 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 }
};

export const directionNames: Record<Direction, string> = {
  U: "up",
  R: "right",
  D: "down",
  L: "left"
};

export const directionArrows: Record<Direction, string> = {
  U: "↑",
  R: "→",
  D: "↓",
  L: "←"
};

export function positionKey(position: Position): string {
  return `${position.x},${position.y}`;
}

export function samePosition(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function guardPosition(guard: Guard, turn: number): Position {
  return guard.route[(guard.phase + turn) % guard.route.length];
}

export function move(position: Position, direction: Direction): Position {
  const vector = vectors[direction];
  return { x: position.x + vector.x, y: position.y + vector.y };
}

function isInside(position: Position): boolean {
  return position.x >= 0 && position.x < GRID_SIZE && position.y >= 0 && position.y < GRID_SIZE;
}

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function rngFrom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [items[index], items[swap]] = [items[swap], items[index]];
  }
  return items;
}

function makeCandidatePath(random: () => number): Position[] | null {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const path: Position[] = [{ x: Math.floor(random() * 5), y: Math.floor(random() * 5) }];
    for (let turn = 0; turn < MOVE_COUNT; turn += 1) {
      const directions = shuffle<Direction>(["U", "R", "D", "L"], random);
      const next = directions.map((direction) => move(path[path.length - 1], direction)).find((position) =>
        isInside(position) && !path.some((seen) => samePosition(seen, position))
      );
      if (!next) break;
      path.push(next);
    }
    if (path.length === MOVE_COUNT + 1) return path;
  }
  return null;
}

function squareRoutes(): Position[][] {
  const routes: Position[][] = [];
  for (let y = 0; y < GRID_SIZE - 1; y += 1) {
    for (let x = 0; x < GRID_SIZE - 1; x += 1) {
      routes.push([
        { x, y },
        { x: x + 1, y },
        { x: x + 1, y: y + 1 },
        { x, y: y + 1 }
      ]);
    }
  }
  return routes;
}

export function simulatePlan(puzzle: Puzzle, plan: Direction[]): PlanResult {
  let position = puzzle.start;
  let bonusTaken = puzzle.bonus ? samePosition(position, puzzle.bonus) : true;
  const walls = new Set(puzzle.walls.map(positionKey));
  const steps: StepResult[] = [];
  let caught = false;
  let blocked = false;

  for (let turn = 0; turn < plan.length; turn += 1) {
    const wanted = move(position, plan[turn]);
    if (!isInside(wanted) || walls.has(positionKey(wanted))) {
      blocked = true;
      steps.push({ position, caught: false, blocked: true, bonusTaken });
      break;
    }
    const collision = puzzle.guards.some((guard) => {
      const before = guardPosition(guard, turn);
      const after = guardPosition(guard, turn + 1);
      return samePosition(wanted, after) || (samePosition(position, after) && samePosition(wanted, before));
    });
    position = wanted;
    if (puzzle.bonus && samePosition(position, puzzle.bonus)) bonusTaken = true;
    steps.push({ position, caught: collision, blocked: false, bonusTaken });
    if (collision) {
      caught = true;
      break;
    }
  }

  const reachedVault = plan.length === MOVE_COUNT && steps.length === MOVE_COUNT && samePosition(position, puzzle.vault);
  const won = reachedVault && bonusTaken && !caught && !blocked;
  return { won, caught, blocked, reachedVault, bonusTaken, steps };
}

export function findSolutions(puzzle: Puzzle): Direction[][] {
  const directions: Direction[] = ["U", "R", "D", "L"];
  const results: Direction[][] = [];
  const visit = (plan: Direction[]) => {
    if (plan.length === MOVE_COUNT) {
      if (simulatePlan(puzzle, plan).won) results.push(plan);
      return;
    }
    directions.forEach((direction) => visit([...plan, direction]));
  };
  visit([]);
  return results;
}

function makePuzzle(seed: string, salt: number): Puzzle | null {
  const random = rngFrom(hashText(`${seed}:${salt}`));
  const path = makeCandidatePath(random);
  if (!path) return null;
  const reserved = new Set(path.map(positionKey));
  const routes = shuffle(squareRoutes(), random);
  const guards: Guard[] = [];

  for (const route of routes) {
    for (let phase = 0; phase < route.length; phase += 1) {
      const candidate = { route, phase };
      const hitsPath = path.some((position, turn) => {
        const guardNow = guardPosition(candidate, turn);
        if (samePosition(position, guardNow)) return true;
        if (turn === 0) return false;
        const guardBefore = guardPosition(candidate, turn - 1);
        return samePosition(path[turn - 1], guardNow) && samePosition(position, guardBefore);
      });
      if (!hitsPath && !guards.some((guard) => samePosition(guardPosition(guard, 0), guardNowFor(candidate)))) {
        guards.push(candidate);
        break;
      }
    }
    if (guards.length === 2) break;
  }
  if (guards.length < 2) return null;

  const guardCells = new Set(guards.flatMap((guard) => guard.route.map(positionKey)));
  const openCells: Position[] = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      if (!reserved.has(`${x},${y}`) && !guardCells.has(`${x},${y}`)) openCells.push({ x, y });
    }
  }
  const walls = shuffle(openCells, random).slice(0, Math.min(5, openCells.length));
  const needsBonus = hashText(seed) % 2 === 0;
  return {
    seed,
    start: path[0],
    vault: path[MOVE_COUNT],
    bonus: needsBonus ? path[2 + (hashText(seed) % 2)] : null,
    walls,
    guards,
    solutions: 0
  };
}

function guardNowFor(guard: Guard): Position {
  return guardPosition(guard, 0);
}

export function generatePuzzle(seed: string): Puzzle {
  let fallback: Puzzle | null = null;
  for (let salt = 0; salt < 500; salt += 1) {
    const puzzle = makePuzzle(seed, salt);
    if (!puzzle) continue;
    const solutions = findSolutions(puzzle);
    if (solutions.length > 0) fallback = { ...puzzle, solutions: solutions.length };
    if (solutions.length >= 2 && solutions.length <= 18) return { ...puzzle, solutions: solutions.length };
  }
  if (fallback) return fallback;
  throw new Error("Could not generate a solvable gallery.");
}

export function todaySeed(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function pathGlyph(plan: Direction[], seed: string): string {
  const glyphs = ["◆", "◇", "○", "□", "△", "✦"];
  let value = hashText(seed);
  return plan.map((direction) => {
    value = hashText(`${value}:${direction}`);
    return glyphs[value % glyphs.length];
  }).join("");
}

export function cellName(position: Position): string {
  return `${String.fromCharCode(65 + position.x)}${position.y + 1}`;
}
