import React from 'react';
import { useUid } from './utils.js';

export const pushButtonMeta = {
  id: 'pushbutton', name: 'Tactile push button (12 mm)', width: 67.2, height: 44.4,
  // two legs per side; a-side pins (1.*) are internally shorted, as are the 2.* pins when pressed
  pins: [
    { name: '1.l', x: 0, y: 12.6 }, { name: '2.l', x: 0, y: 31.8 },
    { name: '1.r', x: 67.2, y: 12.6 }, { name: '2.r', x: 67.2, y: 31.8 },
  ],
};

const CAPS = {
  green: ['#6fd45a', '#1f6d17'], red: ['#ff6b5e', '#8c1209'], blue: ['#6b8cff', '#1a2f9a'],
  yellow: ['#fff06b', '#a08a00'], white: ['#ffffff', '#9a9a9a'], black: ['#6a6a6a', '#111111'],
};

export default function PushButton({ x, y, scale = 1, color = 'green', pressed = false, ...rest }) {
  const u = useUid('btn');
  const { width: W, height: H } = pushButtonMeta;
  const [light, dark] = CAPS[color] || CAPS.green;
  const leg = (cy) => (
    <>
      <rect x="0" y={cy - 1.5} width="15" height="3" fill="#b9b9b9" />
      <rect x="0" y={cy - 1.5} width="15" height="1" fill="#e6e6e6" />
      <rect x={W - 15} y={cy - 1.5} width="15" height="3" fill="#b9b9b9" />
      <rect x={W - 15} y={cy - 1.5} width="15" height="1" fill="#e6e6e6" />
    </>
  );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x={x} y={y} width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} {...rest}>
      <defs>
        <radialGradient id={u('cap')} cx=".4" cy=".35" r=".8"><stop offset="0" stopColor={light} /><stop offset="1" stopColor={dark} /></radialGradient>
      </defs>
      {leg(12.6)}{leg(31.8)}
      <rect x="11.4" y="0" width="44.4" height="44.4" rx="2.4" fill="#454545" />
      <rect x="14.6" y="3.2" width="38" height="38" rx="1" fill="#e4e4e4" />
      <rect x="14.6" y="3.2" width="38" height="38" rx="1" fill="none" stroke="#9a9a9a" strokeWidth=".8" />
      {[[19.4, 8], [47.8, 8], [19.4, 36.4], [47.8, 36.4]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="1.5" fill="#111" />)}
      <circle cx="33.6" cy="22.2" r={pressed ? 13.2 : 14.6} fill={`url(#${u('cap')})`} />
      <circle cx="33.6" cy="22.2" r={pressed ? 13.2 : 14.6} fill="none" stroke="#000" strokeOpacity=".25" strokeWidth=".8" />
    </svg>
  );
}
