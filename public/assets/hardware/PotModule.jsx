import React from 'react';
import { useUid } from './utils.js';

export const potModuleMeta = {
  id: 'potentiometer', name: 'Rotary potentiometer module', width: 75, height: 75.5,
  pins: [
    { name: 'GND', x: 27.9, y: 68 }, { name: 'SIG', x: 37.5, y: 68 }, { name: 'VCC', x: 47.1, y: 68 },
  ],
};

/** value: 0..1 -> knob angle -135°..+135°. */
export default function PotModule({ x, y, scale = 1, value = 0, ...rest }) {
  const u = useUid('pot');
  const { width: W, height: H } = potModuleMeta;
  const angle = -135 + Math.max(0, Math.min(1, value)) * 270;
  const F = 'Arial, Helvetica, sans-serif';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x={x} y={y} width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} {...rest}>
      <defs>
        <radialGradient id={u('knob')} cx=".42" cy=".38" r=".75"><stop offset="0" stopColor="#f0f0f0" /><stop offset="1" stopColor="#cfcfcf" /></radialGradient>
      </defs>
      <rect width={W} height={H} rx="7" fill="#1d5a8c" />
      <rect x="20.2" y="2.7" width="34.2" height="9" fill="#cdcdcd" />
      {[[6.5, 7], [68.5, 7], [6.5, 69.8], [68.5, 69.8]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="5.2" fill="#fff" stroke="#0f3c63" strokeWidth="1" />)}
      <circle cx="37.3" cy="30.7" r="27.2" fill="#c4c4c4" stroke="#9c9c9c" strokeWidth=".8" />
      <circle cx="37.3" cy="30.7" r="23.6" fill={`url(#${u('knob')})`} />
      <g transform={`translate(37.3 30.7) rotate(${angle})`}><path d="M0 -9V-21.5" stroke="#000" strokeWidth="1.8" /></g>
      <g fontFamily={F} fontSize="4.6" fill="#fff" textAnchor="middle">
        <text x="27.9" y="61.6">GND</text><text x="37.5" y="61.6">SIG</text><text x="47.1" y="61.6">VCC</text>
      </g>
      <rect x="22.2" y="64" width="30.8" height="8" fill="#1d5a8c" stroke="#fff" strokeWidth="1" />
      {potModuleMeta.pins.map((p) => (
        <g key={p.name}><circle cx={p.x} cy={p.y} r="2.4" fill="#fff3c4" stroke="#d9a63a" strokeWidth="1" /><circle cx={p.x} cy={p.y} r=".9" fill="#7a5a14" /></g>
      ))}
    </svg>
  );
}
