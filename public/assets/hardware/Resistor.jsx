import React from 'react';
import { useUid } from './utils.js';

export const resistorMeta = {
  id: 'resistor', name: 'Resistor (1/4 W)', width: 60, height: 12,
  // 6 pitches (0.6") between lead tips
  pins: [
    { name: '1', label: 'Lead 1', x: 1.2, y: 6 },
    { name: '2', label: 'Lead 2', x: 58.8, y: 6 },
  ],
};

const DIGIT = ['#1a1a1a', '#8b4a1e', '#e02020', '#ff8c1a', '#f2e61a', '#2eaa2e', '#2050e0', '#9030c0', '#8a8a8a', '#f5f5f5'];
const GOLD = '#d4a82c', SILVER = '#c4c4c4';

/** ohms -> [d1, d2, multiplier] band colours (4-band code). */
export function resistorBands(ohms) {
  if (!(ohms > 0)) return [DIGIT[0], DIGIT[0], DIGIT[0]];
  let exp = Math.floor(Math.log10(ohms));
  let sig = Math.round(ohms / Math.pow(10, exp - 1));
  if (sig >= 100) { sig = 10; exp += 1; }
  const mult = exp - 1;
  const m = mult === -1 ? GOLD : mult === -2 ? SILVER : DIGIT[Math.max(0, Math.min(9, mult))];
  return [DIGIT[Math.floor(sig / 10)], DIGIT[sig % 10], m];
}

export default function Resistor({ x, y, scale = 1, ohms = 1000, tolerance = 'gold', ...rest }) {
  const u = useUid('res');
  const { width: W, height: H } = resistorMeta;
  const [b1, b2, b3] = resistorBands(ohms);
  const b4 = tolerance === 'silver' ? SILVER : GOLD;
  const body = 'M16 .6C12.5 .6 10.6 2.6 10.6 6s1.9 5.4 5.4 5.4c2.6 0 3.6-1.4 6-1.9h16c2.4.5 3.4 1.9 6 1.9 3.5 0 5.4-2 5.4-5.4S47.5 .6 44 .6c-2.6 0-3.6 1.4-6 1.9H22c-2.4-.5-3.4-1.9-6-1.9Z';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x={x} y={y} width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} {...rest}>
      <defs>
        <linearGradient id={u('body')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0dcc4" /><stop offset=".45" stopColor="#d9b995" /><stop offset="1" stopColor="#a98259" />
        </linearGradient>
        <linearGradient id={u('lead')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8e8e8" /><stop offset="1" stopColor="#9a9a9a" /></linearGradient>
        <clipPath id={u('clip')}><path d={body} /></clipPath>
      </defs>
      <rect x="1.2" y="5.1" width="57.6" height="1.8" fill={`url(#${u('lead')})`} />
      <path d={body} fill={`url(#${u('body')})`} />
      <g clipPath={`url(#${u('clip')})`}>
        <rect x="14.6" y="0" width="3" height="12" fill={b1} />
        <rect x="23.6" y="0" width="3" height="12" fill={b2} />
        <rect x="30" y="0" width="3" height="12" fill={b3} />
        <rect x="41" y="0" width="3" height="12" fill={b4} />
        <path d="M12 2.6h36" stroke="#fff" strokeOpacity=".45" strokeWidth="1.2" />
      </g>
    </svg>
  );
}
