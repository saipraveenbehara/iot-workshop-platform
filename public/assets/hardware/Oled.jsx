import React from 'react';

export const oledMeta = {
  id: 'ssd1306', name: 'OLED 128x64 (SSD1306, I2C)', width: 104.2, height: 85.5,
  pins: [
    { name: 'GND', x: 37.6, y: 6.2 }, { name: 'VCC', x: 47.2, y: 6.2 },
    { name: 'SCL', x: 56.8, y: 6.2 }, { name: 'SDA', x: 66.4, y: 6.2 },
  ],
  // drawable pixel area: children are rendered in a 128x64 coordinate space mapped onto it
  screen: { x: 4, y: 20, width: 96, height: 48, pixelsW: 128, pixelsH: 64 },
};

const FONT = 'Arial, Helvetica, sans-serif';

/** children: SVG drawn in 128x64 display-pixel coordinates (e.g. <text>, <rect>). */
export default function Oled({ x, y, scale = 1, children, ...rest }) {
  const { width: W, height: H, screen: s } = oledMeta;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x={x} y={y} width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} {...rest}>
      <rect width={W} height={H} fill="#1a5a96" />
      <rect x="1.2" y="15.9" width="101.8" height="56" fill="#000" />
      <rect x="1.2" y="71.2" width="101.8" height="1.4" fill="#2a2a2a" />
      <rect x="31" y="72" width="44.8" height="10.5" fill="#000" />
      <path d="M26 85.5c0-2.6 1.8-3.6 4-3.6h1M78 85.5c0-2.6-1.8-3.6-4-3.6h-1" stroke="#e8e8e8" strokeWidth="1.6" fill="#e8e8e8" />
      {[[7.4, 6.6], [96.4, 6.6], [7.4, 79.7], [96.4, 79.7]].map(([cx, cy], i) => (
        <g key={i}><circle cx={cx} cy={cy} r="5.4" fill="#fff" stroke="#0f3f70" strokeWidth=".8" /></g>
      ))}
      {oledMeta.pins.map((p) => (
        <g key={p.name}>
          <circle cx={p.x} cy={p.y} r="3" fill="#fff3c4" stroke="#d9a63a" strokeWidth="1.2" />
          <circle cx={p.x} cy={p.y} r="1.1" fill="#7a5a14" />
          <text x={p.x} y="13.2" fontFamily={FONT} fontSize="3.5" fill="#fff" textAnchor="middle">{p.name}</text>
        </g>
      ))}
      <svg x={s.x} y={s.y} width={s.width} height={s.height} viewBox={`0 0 ${s.pixelsW} ${s.pixelsH}`}>{children}</svg>
    </svg>
  );
}
