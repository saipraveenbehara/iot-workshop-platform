import { useId } from 'react';

/** 0.1 inch pin pitch, in SVG units. 1 SVG unit = 1 CSS px at 96 dpi (1 mm = 3.7795 units). */
export const PITCH = 9.6;
export const MM = 96 / 25.4;

/** Unique, url()-safe ids so several copies of a part can share one page. */
export function useUid(prefix = 'p') {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (name) => `${prefix}${id}_${name}`;
}

/** Absolute position of a pin, given the part's top-left origin. */
export function pinPosition(meta, pinName, origin = { x: 0, y: 0 }, scale = 1) {
  let p = meta.pins.find((q) => q.name === pinName || q.label === pinName);
  if (!p && pinName === 'GND') {
    p = meta.pins.find((q) => q.name.startsWith('GND'));
  }
  if (!p && (pinName.startsWith('GPIO') || pinName.startsWith('GP'))) {
    const num = pinName.replace(/^(GPIO|GP)/, '');
    p = meta.pins.find((q) => q.name === `D${num}` || q.name === `GP${num}` || q.name === num);
  }
  if (!p && pinName.startsWith('D')) {
    const num = pinName.slice(1);
    p = meta.pins.find((q) => q.name === `GP${num}` || q.name === `D${num}` || q.name === num);
  }
  if (!p) throw new Error(`Unknown pin "${pinName}" on ${meta.id}`);
  return { x: origin.x + p.x * scale, y: origin.y + p.y * scale };
}

/** Top-left {x, y} that puts `pinName` exactly on `target`. */
export function placeByPin(meta, pinName, target, scale = 1) {
  let p = meta.pins.find((q) => q.name === pinName || q.label === pinName);
  if (!p && pinName === 'GND') {
    p = meta.pins.find((q) => q.name.startsWith('GND'));
  }
  if (!p && (pinName.startsWith('GPIO') || pinName.startsWith('GP'))) {
    const num = pinName.replace(/^(GPIO|GP)/, '');
    p = meta.pins.find((q) => q.name === `D${num}` || q.name === `GP${num}` || q.name === num);
  }
  if (!p) throw new Error(`Unknown pin "${pinName}" on ${meta.id}`);
  return { x: target.x - p.x * scale, y: target.y - p.y * scale };
}
