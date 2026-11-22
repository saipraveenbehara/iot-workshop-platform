import React from 'react';
import { useUid } from './utils.js';

export const ledMeta = {
  id: 'led', name: 'LED (5 mm)', width: 28.8, height: 36,
  // pin = leg tip (the point that goes into the breadboard hole)
  pins: [
    { name: 'C', label: 'Cathode (−)', x: 9.6, y: 36 },
    { name: 'A', label: 'Anode (+)', x: 19.2, y: 36 },
  ],
};

const COLORS = {
  red: ['#ff6a5f', '#c4120c'], green: ['#6bec5f', '#0a9a12'], blue: ['#6b8cff', '#1230c8'],
  yellow: ['#fff05f', '#c4a400'], orange: ['#ffae4d', '#c75f00'], white: ['#ffffff', '#9a9a9a'],
};

export default function Led({ x, y, scale = 1, color = 'red', lit = false, brightness = 1, ...rest }) {
  const u = useUid('led');
  const [light, dark] = COLORS[color] || COLORS.red;
  const { width: W, height: H } = ledMeta;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x={x} y={y} width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} {...rest}>
      <defs>
        <linearGradient id={u('leg')} x1="0" x2="1"><stop offset="0" stopColor="#9a9a9a" /><stop offset=".5" stopColor="#ececec" /><stop offset="1" stopColor="#9a9a9a" /></linearGradient>
        <radialGradient id={u('dome')} cx=".4" cy=".3" r=".85">
          <stop offset="0" stopColor={light} stopOpacity={lit ? 1 : 0.85} /><stop offset="1" stopColor={dark} stopOpacity={lit ? 0.95 : 0.7} />
        </radialGradient>
        <filter id={u('glow')} x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      {lit && <circle cx="14.4" cy="11" r="17" fill={light} opacity={0.8 * brightness} filter={`url(#${u('glow')})`} />}
      {/* legs: cathode straight, anode with the small crimp */}
      <rect x="8.7" y="20" width="1.8" height="16" fill={`url(#${u('leg')})`} />
      <path d="M19.2 20V25L17.7 27.5L19.2 30V36" fill="none" stroke="#c4c4c4" strokeWidth="1.8" />
      {/* body */}
      <path d="M4.9 20V9.5a9.5 9.5 0 0 1 19 0V20Z" fill={`url(#${u('dome')})`} />
      <path d="M2.9 19.6h23v2.2a1 1 0 0 1-1 1H3.9a1 1 0 0 1-1-1Z" fill={dark} opacity=".75" />
      <path d="M2.9 19.6h23v1.1h-23Z" fill={light} opacity=".7" />
      <path d="M3.4 21.8h1.5" stroke={dark} strokeWidth="0" />
      {/* inner electrodes */}
      <path d="M8.2 20V13.5L12.6 11.8V20Z" fill={dark} opacity=".55" />
      <path d="M17.6 20V14.5h1.8V20Z" fill={dark} opacity=".45" />
      {/* highlight */}
      <path d="M7.1 18V9.8a7.4 7.4 0 0 1 3-5.6" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".65" />
    </svg>
  );
}
