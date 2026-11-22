import React, { useState } from 'react';
import { snapToHole, BREADBOARD } from './breadboardGeometry.js';

const FONT = 'Arial, Helvetica, sans-serif';

/** Short feature list shown when hovering the part body. Edit freely. */
export const PART_SPECS = {
  led: ['5 mm, through-hole', 'Forward voltage ≈ 2 V', 'Max ≈ 20 mA (use a resistor)', 'Long leg = anode (+)'],
  resistor: ['1/4 W, 4-band', 'Value set by `ohms` prop', 'Not polarised'],
  pushbutton: ['12 mm tactile switch', 'Pins 1.l/1.r shorted, 2.l/2.r shorted', 'Pressing connects 1.* to 2.*'],
  ssd1306: ['0.96" OLED, 128×64', 'I²C, address 0x3C', '3.3–5 V'],
  dht22: ['Temp −40…80 °C ±0.5', 'Humidity 0–100 % ±2', 'Single-wire data on SDA'],
  potentiometer: ['Rotary, analog out on SIG', '270° travel', '3.3–5 V'],
  'pico-w': ['RP2040, dual Cortex-M0+', '2 MB flash, 264 KB RAM', 'Wi-Fi (CYW43439), 3.3 V logic', '26 GPIO, 3 ADC'],
};

function Tooltip({ x, y, lines, W }) {
  const fs = 5.2, lh = 6.8, pad = 3;
  const w = Math.max(...lines.map((l) => l.text.length)) * fs * 0.56 + pad * 2;
  const h = lines.length * lh + pad * 2 - 1;
  const left = x + 6 + w > W + 60 ? x - 6 - w : x + 6; // flip to the left near the right edge
  const top = y - h - 4;
  return (
    <g pointerEvents="none" fontFamily={FONT} fontSize={fs}>
      <rect x={left} y={top} width={w} height={h} rx="2" fill="#1f2328" fillOpacity=".95" stroke="#fff" strokeOpacity=".25" strokeWidth=".4" />
      {lines.map((l, i) => (
        <text key={i} x={left + pad} y={top + pad + lh * (i + 0.8) - 1} fill={l.dim ? '#aab' : '#fff'} fontWeight={l.bold ? 700 : 400}>{l.text}</text>
      ))}
    </g>
  );
}

/**
 * Transparent hover layer for one part. Render it AFTER the part with the same x, y, scale.
 *  - hover a pin  -> tooltip with label / pin name / number; ring around the pin
 *  - hover body   -> tooltip with part name + specs
 * Props: onPinClick(pin), onPinHover(pin|null), showLabels (always show pin names), defaultHover (pin name; for static previews)
 */
export function PartHover({ meta, x, y, scale = 1, onPinClick, onPinHover, showLabels = false, defaultHover = null, specs }) {
  const [hover, setHover] = useState(defaultHover ? { pin: defaultHover } : null);
  const [body, setBody] = useState(false);
  const { width: W, height: H } = meta;
  const info = specs || PART_SPECS[meta.id] || [];
  const pin = hover && meta.pins.find((p) => p.name === hover.pin);
  const set = (p) => { setHover(p ? { pin: p.name } : null); onPinHover && onPinHover(p || null); };
  return (
    <svg x={x} y={y} width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <rect width={W} height={H} fill="transparent" onMouseEnter={() => setBody(true)} onMouseLeave={() => setBody(false)} />
      {showLabels && meta.pins.map((p) => (
        <text key={p.name} x={p.x} y={p.y - 4} fontFamily={FONT} fontSize="4" fill="#000" textAnchor="middle" pointerEvents="none">{p.name}</text>
      ))}
      {meta.pins.map((p) => (
        <circle key={p.name} cx={p.x} cy={p.y} r="3.6" fill={hover && hover.pin === p.name ? 'rgba(80,200,120,.35)' : 'transparent'}
          stroke={hover && hover.pin === p.name ? '#2ea35a' : 'none'} strokeWidth="1" style={{ cursor: onPinClick ? 'pointer' : 'default' }}
          onMouseEnter={() => set(p)} onMouseLeave={() => set(null)} onClick={() => onPinClick && onPinClick(p)} />
      ))}
      {pin && (
        <Tooltip x={pin.x} y={pin.y} W={W} lines={[
          { text: pin.label || pin.name, bold: true },
          { text: `Pin: ${pin.name}${pin.number ? `  (#${pin.number})` : ''}`, dim: true },
          { text: meta.name, dim: true },
        ]} />
      )}
      {!pin && body && (
        <Tooltip x={W / 2} y={0} W={W} lines={[{ text: meta.name, bold: true }, ...info.map((t) => ({ text: t, dim: true }))]} />
      )}
    </svg>
  );
}

/** Hover layer for the breadboard: highlights the hole under the cursor and shows its id + net. */
export function BreadboardHover({ x, y, scale = 1, onHoleClick, onHoleHover, defaultHole = null }) {
  const [hole, setHole] = useState(defaultHole);
  const { width: W, height: H } = BREADBOARD;
  const toLocal = (e) => {
    const el = e.currentTarget;
    const pt = el.ownerSVGElement.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(el.getScreenCTM().inverse());
  };
  const move = (e) => { const p = toLocal(e); const h = snapToHole(p.x, p.y); setHole(h); onHoleHover && onHoleHover(h); };
  return (
    <svg x={x} y={y} width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <rect width={W} height={H} fill="transparent" onMouseMove={move} onMouseLeave={() => { setHole(null); onHoleHover && onHoleHover(null); }}
        onClick={() => hole && onHoleClick && onHoleClick(hole)} style={{ cursor: onHoleClick ? 'pointer' : 'default' }} />
      {hole && (
        <>
          <rect x={hole.x - 4} y={hole.y - 4} width="8" height="8" fill="#6fcf6f" fillOpacity=".7" stroke="#1d5e1d" strokeWidth="1" pointerEvents="none" />
          <Tooltip x={hole.x} y={hole.y} W={W} lines={[{ text: `Hole ${hole.id}`, bold: true }, { text: `Net: ${hole.net}`, dim: true }]} />
        </>
      )}
    </svg>
  );
}
