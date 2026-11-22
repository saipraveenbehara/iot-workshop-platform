import React from 'react';
import { BREADBOARD, ROW_Y, RAIL_Y, RAIL_HOLES, colX, railX, holeById } from './breadboardGeometry.js';

export const breadboardMeta = { ...BREADBOARD, pins: [] };

const SQ = 4.2;
const sq = (x, y) => `M${(x - SQ / 2).toFixed(2)} ${(y - SQ / 2).toFixed(2)}h${SQ}v${SQ}h-${SQ}z`;
let HOLES_D = '';
for (const y of Object.values(ROW_Y)) for (let c = 1; c <= BREADBOARD.columns; c++) HOLES_D += sq(colX(c), y);
for (const side of Object.values(RAIL_Y)) for (const y of Object.values(side)) for (let n = 1; n <= RAIL_HOLES; n++) HOLES_D += sq(railX(n), y);

const LABEL_COLS = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
const FONT = 'Arial, Helvetica, sans-serif';

/** highlight: array of hole ids (e.g. ['e26']) drawn with a green marker. */
export default function Breadboard({ x, y, scale = 1, highlight = [], ...rest }) {
  const { width: W, height: H } = BREADBOARD;
  const lx = railX(1) - 1.6, rx = railX(RAIL_HOLES) + 1.6;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x={x} y={y} width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} {...rest}>
      <rect width={W} height={H} rx="3" fill="#efefec" />
      <rect x="14.8" y="100.7" width="634" height="6.8" fill="#e1e1de" />
      {/* power rail guide lines */}
      <path d={`M${lx} 5.4H${rx}M${lx} 176.8H${rx}`} stroke="#ee9f96" strokeWidth="1" />
      <path d={`M${lx} 30.7H${rx}M${lx} 204H${rx}`} stroke="#9fd2ee" strokeWidth="1" />
      <g stroke="#ee9f96" strokeWidth="0.9" fill="none">
        <path d="M27.5 10.9h5.6M30.3 8.1v5.6M613.7 5.5h5.6M616.5 2.7v5.6M27.5 178.8h5.6M30.3 176v5.6M613.7 176.8h5.6M616.5 174v5.6" />
      </g>
      <g stroke="#9fd2ee" strokeWidth="0.9">
        <path d="M30.3 26v5M616.5 26v5M30.3 192v5M616.5 192v5" />
      </g>
      <path d={HOLES_D} fill="#6d6d6d" />
      <g fontFamily={FONT} fontSize="7" fill="#555" textAnchor="middle">
        {LABEL_COLS.map((c) => (
          <React.Fragment key={c}>
            <text x={colX(c)} y="43.2">{c}</text>
            <text x={colX(c)} y="169.2">{c}</text>
          </React.Fragment>
        ))}
        {Object.keys(ROW_Y).map((r) => (
          <React.Fragment key={r}>
            <text x="17.6" y={ROW_Y[r] + 2.5}>{r}</text>
            <text x={W - 21} y={ROW_Y[r] + 2.5}>{r}</text>
          </React.Fragment>
        ))}
      </g>
      {highlight.map((id) => {
        const h = holeById(id);
        return <rect key={id} x={h.x - 4} y={h.y - 4} width="8" height="8" fill="#6fcf6f" stroke="#1d5e1d" strokeWidth="1" />;
      })}
    </svg>
  );
}
