import { PITCH } from './utils.js';

export const BREADBOARD = { id: 'breadboard', name: 'Breadboard (full size)', width: 654, height: 208, columns: 63, pitch: PITCH };

export const ROW_Y = { a: 50.4, b: 60, c: 69.6, d: 79.2, e: 88.8, f: 117.6, g: 127.2, h: 136.8, i: 146.4, j: 156 };
export const COL_X0 = 26.4;
export const RAIL_X0 = COL_X0 + 2 * PITCH; // rails line up with the column grid
export const RAIL_Y = { top: { '+': 12.8, '-': 22.4 }, bottom: { '+': 187.2, '-': 196.8 } };
export const RAIL_HOLES = 50; // 10 groups of 5

export const colX = (col) => COL_X0 + (col - 1) * PITCH;
export const railX = (n) => RAIL_X0 + Math.floor((n - 1) / 5) * 6 * PITCH + ((n - 1) % 5) * PITCH;

/** Terminal-strip hole. row: 'a'..'j', col: 1..63. Holes a-e of a column share one net, f-j another. */
export function getHole(row, col) {
  if (!(row in ROW_Y) || col < 1 || col > BREADBOARD.columns) throw new Error(`No hole ${row}${col}`);
  return { id: `${row}${col}`, x: colX(col), y: ROW_Y[row], net: `col${col}-${row <= 'e' ? 'top' : 'bottom'}` };
}

/** Power-rail hole. side: 'top'|'bottom', polarity: '+'|'-', n: 1..50. Each rail is one net. */
export function getRailHole(side, polarity, n) {
  if (!RAIL_Y[side] || !RAIL_Y[side][polarity] || n < 1 || n > RAIL_HOLES) throw new Error('No such rail hole');
  return { id: `${side[0]}${polarity}${n}`, x: railX(n), y: RAIL_Y[side][polarity], net: `rail-${side}${polarity}` };
}

/** Parse "a11", "tp.7" style ids: a11 / j63 for terminals, t+7 / b-12 for rails. */
export function holeById(id) {
  const m = /^([a-j])(\d+)$/.exec(id);
  if (m) return getHole(m[1], Number(m[2]));
  const r = /^([tb])([+-])(\d+)$/.exec(id);
  if (r) return getRailHole(r[1] === 't' ? 'top' : 'bottom', r[2], Number(r[3]));
  throw new Error(`Bad hole id ${id}`);
}

let _all;
export function allHoles() {
  if (_all) return _all;
  _all = [];
  for (const row of Object.keys(ROW_Y)) for (let c = 1; c <= BREADBOARD.columns; c++) _all.push(getHole(row, c));
  for (const s of ['top', 'bottom']) for (const p of ['+', '-']) for (let n = 1; n <= RAIL_HOLES; n++) _all.push(getRailHole(s, p, n));
  return _all;
}

/** Nearest hole to a point in breadboard coordinates, or null if farther than maxDist. */
export function snapToHole(x, y, maxDist = PITCH / 2) {
  let best = null, bd = maxDist;
  for (const h of allHoles()) {
    const d = Math.hypot(h.x - x, h.y - y);
    if (d <= bd) { bd = d; best = h; }
  }
  return best;
}

/**
 * Snap a whole part to the breadboard (use while dragging).
 * origin = part top-left in breadboard coords. Returns {x, y, connections:[{pin, hole}]} or null
 * when any pin would miss a hole.
 */
export function snapPartToBreadboard(meta, origin, scale = 1, tol = PITCH * 0.45) {
  const abs = meta.pins.map((p) => ({ pin: p.name, x: origin.x + p.x * scale, y: origin.y + p.y * scale }));
  const first = snapToHole(abs[0].x, abs[0].y, PITCH);
  if (!first) return null;
  const dx = first.x - abs[0].x, dy = first.y - abs[0].y;
  const connections = [];
  for (const a of abs) {
    const h = snapToHole(a.x + dx, a.y + dy, tol);
    if (!h) return null;
    connections.push({ pin: a.pin, hole: h });
  }
  return { x: origin.x + dx, y: origin.y + dy, connections };
}
