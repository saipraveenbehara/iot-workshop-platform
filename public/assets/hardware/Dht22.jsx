import React from 'react';
import { useUid } from './utils.js';

export const dht22Meta = {
  id: 'dht22', name: 'DHT22 temperature & humidity sensor', width: 56.7, height: 116.6,
  pins: [
    { name: 'VCC', x: 14.4, y: 116.6 }, { name: 'SDA', x: 24, y: 116.6 },
    { name: 'NC', x: 33.6, y: 116.6 }, { name: 'GND', x: 43.2, y: 116.6 },
  ],
};

export default function Dht22({ x, y, scale = 1, ...rest }) {
  const u = useUid('dht');
  const { width: W, height: H } = dht22Meta;
  const rows = [35, 44.4, 53.8, 63.2, 72.2];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x={x} y={y} width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} {...rest}>
      <defs>
        <linearGradient id={u('leg')} x1="0" x2="1"><stop offset="0" stopColor="#c9c9c9" /><stop offset=".5" stopColor="#ededed" /><stop offset="1" stopColor="#c9c9c9" /></linearGradient>
      </defs>
      {dht22Meta.pins.map((p) => <rect key={p.name} x={p.x - 1.6} y="88" width="3.2" height={p.y - 88} fill={`url(#${u('leg')})`} />)}
      <path d="M.7 91V16.5C.7 7 9 .7 20 .7h16.7c11 0 19.3 6.3 19.3 15.8V91Z" fill="#fff" stroke="#b3b3b3" strokeWidth="1.2" />
      <circle cx="28.4" cy="10.5" r="4.4" fill="#fff" stroke="#b3b3b3" strokeWidth="1.2" />
      <path d="M17.6 21.5v8.2h5V21.5M25.9 21.5v8.2h5V21.5M34.2 21.5v8.2h5V21.5" fill="none" stroke="#b3b3b3" strokeWidth="1.2" />
      <path d="M17.6 21.5h21.6" stroke="#b3b3b3" strokeWidth="1.2" />
      <g fill="#fff" stroke="#b3b3b3" strokeWidth="1.2">
        {rows.map((ry) => (
          <React.Fragment key={ry}>
            <rect x="1.2" y={ry} width="13.4" height="5.4" rx="2.7" />
            <rect x="42.1" y={ry} width="13.4" height="5.4" rx="2.7" />
            {[19.4, 28.4, 37.4].map((cx) => <rect key={cx} x={cx - 2.8} y={ry} width="5.6" height="5.4" />)}
          </React.Fragment>
        ))}
      </g>
      <text x="28.4" y="86.5" fontFamily="Arial, Helvetica, sans-serif" fontSize="9" fill="#222" textAnchor="middle">DHT22</text>
    </svg>
  );
}
