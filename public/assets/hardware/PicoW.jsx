import React from 'react';
import { useUid } from './utils.js';

const LEFT = ['GP0', 'GP1', 'GND', 'GP2', 'GP3', 'GP4', 'GP5', 'GND', 'GP6', 'GP7', 'GP8', 'GP9', 'GND', 'GP10', 'GP11', 'GP12', 'GP13', 'GND', 'GP14', 'GP15'];
const RIGHT = ['VBUS', 'VSYS', 'GND', '3V3_EN', '3V3', 'ADC_VREF', 'GP28', 'AGND', 'GP27', 'GP26', 'RUN', 'GP22', 'GND', 'GP21', 'GP20', 'GP19', 'GP18', 'GND', 'GP17', 'GP16'];
const Y0 = 12.4, XL = 6.1, XR = 73.3; // 7 pitches apart so the board seats on a breadboard (e.g. rows c and h)

export const picoWMeta = {
  id: 'pico-w', name: 'Raspberry Pi Pico W', width: 79.4, height: 199,
  // physical pin numbers 1-20 down the left edge, 40-21 down the right edge
  pins: [
    ...LEFT.map((n, i) => ({ name: n === 'GND' ? `GND.${i + 1}` : n, label: n, number: i + 1, x: XL, y: Y0 + i * 9.6 })),
    ...RIGHT.map((n, i) => ({ name: n === 'GND' ? `GND.${40 - i}` : n, label: n, number: 40 - i, x: XR, y: Y0 + i * 9.6 })),
  ],
};

const F = 'Arial, Helvetica, sans-serif';

export default function PicoW({ x, y, scale = 1, ...rest }) {
  const u = useUid('pico');
  const { width: W, height: H } = picoWMeta;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x={x} y={y} width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} {...rest}>
      <defs>
        <linearGradient id={u('usb')} x1="0" x2="1"><stop offset="0" stopColor="#9a9a9a" /><stop offset=".5" stopColor="#e2e2e2" /><stop offset="1" stopColor="#9a9a9a" /></linearGradient>
      </defs>
      <rect x="25.6" y="0" width="26.6" height="19" rx="2" fill={`url(#${u('usb')})`} stroke="#7d7d7d" strokeWidth=".6" />
      <rect y="7.8" width={W} height="191.2" rx="2.4" fill="#22601f" />
      <path d="M28 14.5h4v4h-4zM46 14.5h4v4h-4z" fill="#111" />
      <path d="M26.5 16h25v3h-25z" fill="#111" opacity=".85" />
      {[[18.2, 15.2], [61.2, 15.2], [18.2, 192.4], [61.2, 192.4]].map(([cx, cy], i) => (
        <g key={i}><circle cx={cx} cy={cy} r="6.2" fill="#f2d629" stroke="#b89d12" strokeWidth=".6" /><circle cx={cx} cy={cy} r="3.4" fill="#22601f" /></g>
      ))}
      {picoWMeta.pins.map((p) => (
        <g key={p.name + p.number}><circle cx={p.x} cy={p.y} r="3.4" fill="#d9a63a" /><circle cx={p.x} cy={p.y} r="1.5" fill="#6b3f12" /></g>
      ))}
      <g fontFamily={F} fill="#fff" fontSize="3.4">
        <text x="14" y="15.5">1</text><text x="10.5" y="25.5">2</text><text x="64.5" y="25.5">3</text><text x="64.5" y="15.5">9</text>
        <text x="20.5" y="31.6" fontSize="4.6">LED</text><text x="38.4" y="31.6" fontSize="4.6" textAnchor="middle">USB</text>
      </g>
      <rect x="22.6" y="21.5" width="2.6" height="1.8" fill="#e8e8e8" />
      <rect x="55.6" y="27" width="4.6" height="9.2" fill="#111" />
      <rect x="41" y="40" width="8.4" height="9.2" fill="#111" /><rect x="52" y="40" width="7" height="9.2" fill="#111" />
      <g transform="translate(15.9 50.6) rotate(90)"><text fontFamily={F} fontSize="4.2" fill="#fff" textAnchor="middle" letterSpacing=".6">BOOTSEL</text></g>
      <rect x="20.6" y="43.1" width="11" height="15" rx="4" fill="#f2f2f2" stroke="#b9b9b9" strokeWidth=".6" />
      <rect x="27.6" y="81.2" width="26.4" height="26.4" fill="#2a2a2a" />
      <circle cx="40.8" cy="94.4" r="6" fill="none" stroke="#454545" strokeWidth="1.2" />
      <text x="51.2" y="114.6" fontFamily={F} fontSize="5" fill="#fff" textAnchor="middle">DEBUG</text>
      <rect x="25.3" y="119" width="6.6" height="8" fill="#f2f2f2" />
      <rect x="35.8" y="118.5" width="27.9" height="9.4" fill="none" stroke="#fff" strokeWidth=".8" />
      {[40.4, 50.1, 59.8].map((cx) => <circle key={cx} cx={cx} cy="123.2" r="2.4" fill="#d9a63a" stroke="#fff3c4" strokeWidth=".6" />)}
      <rect x="20.6" y="131.4" width="41.6" height="37.3" fill="#b9b9b9" />
      <text x="41.4" y="155" fontFamily={F} fontSize="14" fill="#444" textAnchor="middle">Wi-Fi</text>
      <g transform="translate(14 143.5) rotate(-90)"><text fontFamily={F} fontSize="7.4" fill="#fff" textAnchor="middle">Raspberry Pi Pico W ©2022</text></g>
    </svg>
  );
}
