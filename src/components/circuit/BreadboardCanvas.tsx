import React, { useState } from 'react';
import { CircuitStep } from '../../types/curriculum.js';
import { 
  ChevronRight, 
  ChevronLeft, 
  HelpCircle, 
  Info,
  Radio,
  Sparkles
} from 'lucide-react';

interface BreadboardCanvasProps {
  steps: CircuitStep[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  levelNumber?: number;
}

export const BreadboardCanvas: React.FC<BreadboardCanvasProps> = ({
  steps,
  currentStepIndex,
  onStepChange,
  levelNumber = 2,
}) => {
  const activeStep = steps[currentStepIndex];
  const [interactivePressed, setInteractivePressed] = useState(false);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // Breadboard dimensions & hole coordinates
  const rows = 30;
  const colsLeft = ['A', 'B', 'C', 'D', 'E'];
  const colsRight = ['F', 'G', 'H', 'I', 'J'];

  // Grid offsets
  const startX = 220;
  const startY = 80;
  const holeSpacing = 16;
  const rowSpacing = 16;
  const trenchWidth = 24;

  const getHoleCoords = (col: string, row: number) => {
    let colIndex = 0;
    let isRightSide = false;

    if (colsLeft.includes(col)) {
      colIndex = colsLeft.indexOf(col);
    } else if (colsRight.includes(col)) {
      colIndex = colsRight.indexOf(col);
      isRightSide = true;
    }

    const x = startX + (isRightSide ? (colsLeft.length * holeSpacing + trenchWidth + colIndex * holeSpacing) : (colIndex * holeSpacing));
    const y = startY + (row - 1) * rowSpacing;

    return { x, y };
  };

  // Determine active target holes
  const getActiveHoles = () => {
    if (!activeStep) return [];
    const holes: { x: number; y: number; label: string }[] = [];

    if (activeStep.toCoords) {
      holes.push(activeStep.toCoords);
    }
    if (activeStep.fromCoords && (activeStep.fromCoords.label.includes('Row') || activeStep.fromCoords.label.includes('Rail'))) {
      holes.push(activeStep.fromCoords);
    }
    if (holes.length > 0) return holes;

    const text = activeStep.toBreadboardHole;
    if (text.includes('Row 15')) {
      const h = getHoleCoords('E', 15);
      holes.push({ ...h, label: 'Row 15, Col E' });
    }
    if (text.includes('Row 18')) {
      const h = getHoleCoords('F', 18);
      holes.push({ ...h, label: 'Row 18, Col F' });
    }
    if (text.includes('Row 10')) {
      const h1 = getHoleCoords('E', 10);
      const h2 = getHoleCoords('F', 10);
      holes.push({ ...h1, label: 'Row 10, Col E (Button Leg)' });
      holes.push({ ...h2, label: 'Row 10, Col F (Button Leg)' });
    }
    if (text.includes('Row 20')) {
      const h = getHoleCoords('E', 20);
      holes.push({ ...h, label: 'Row 20, Col E (GP16)' });
    }
    if (text.includes('Row 25')) {
      const h = getHoleCoords('E', 25);
      holes.push({ ...h, label: 'Row 25, Col E (GP17)' });
    }
    if (text.includes('Blue Rail')) {
      holes.push({ x: startX - 30, y: startY + 14 * rowSpacing, label: 'Ground Rail (-)' });
    }
    if (text.includes('Rails (+)')) {
      holes.push({ x: startX - 15, y: startY + 6 * rowSpacing, label: '3.3V Power (+)' });
    }

    return holes;
  };

  const activeHoles = getActiveHoles();

  // Pin details for interactive hover inspector
  const pinDetails: Record<string, string> = {
    'GP0': 'Pin 1: UART0 TX / I2C0 SDA / SPI0 RX',
    'GP1': 'Pin 2: UART0 RX / I2C0 SCL / SPI0 CS',
    'GND_1': 'Pin 3: Ground (0V Reference)',
    'GP4': 'Pin 6: I2C0 SDA (OLED Data Wire)',
    'GP5': 'Pin 7: I2C0 SCL (OLED Clock Wire)',
    'GP14': 'Pin 19: Push Button Input (Pin.PULL_UP)',
    'GP15': 'Pin 20: Green LED Output (3.3V)',
    'GP16': 'Pin 21: Orange LED Output (3.3V)',
    'GP17': 'Pin 22: Red Alert LED Output (3.3V)',
    'GP18': 'Pin 24: Active Buzzer Signal (PWM/Digital)',
    '3V3': 'Pin 36: 3.3V Power Rail Output (Max 300mA)',
    'GND_38': 'Pin 38: Main Circuit Ground (0V Rail)',
  };

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 shadow-sm flex flex-col gap-5">
      {/* Step Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBE6DC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F]" />
            <span className="text-xs font-bold text-[#21867A] uppercase tracking-wider font-mono bg-[#E6F4F2] px-2.5 py-0.5 rounded-md border border-[#B2DFDB]">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <h3 className="text-lg font-black text-[#24313A] mt-1">
            {activeStep ? activeStep.title : 'Circuit Complete'}
          </h3>
        </div>

        {/* Step Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => onStepChange(currentStepIndex - 1)}
            className="p-2.5 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#D5CFC2] disabled:opacity-30 text-[#24313A] transition-all shadow-sm"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-[#24313A] px-3 py-1.5 rounded-lg bg-[#FFFDF7] border border-[#EBE6DC]">
            {currentStepIndex + 1} / {steps.length}
          </span>
          <button
            disabled={currentStepIndex === steps.length - 1}
            onClick={() => onStepChange(currentStepIndex + 1)}
            className="p-2.5 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#D5CFC2] disabled:opacity-30 text-[#24313A] transition-all shadow-sm"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Instruction Card */}
      {activeStep && (
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] flex items-start gap-3.5 text-sm">
          <div
            className="w-4 h-4 rounded-full shrink-0 mt-0.5 shadow-sm ring-2 ring-white/60"
            style={{ backgroundColor: activeStep.color }}
          />
          <div className="flex-1 space-y-1">
            <p className="text-[#24313A] font-medium leading-relaxed">
              {activeStep.instruction}
            </p>
            {activeStep.polarityNote && (
              <p className="text-xs text-[#F28C75] font-bold flex items-center gap-1.5 pt-0.5">
                <HelpCircle className="w-3.5 h-3.5 shrink-0 text-[#F28C75]" />
                <span>{activeStep.polarityNote}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top-Down Orthographic Breadboard SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-[#F8F9FA] rounded-2xl border border-[#EBE6DC] p-4 flex justify-center">
        
        {/* Hovered Pin Info Callout */}
        {hoveredPin && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-white border border-[#B2DFDB] text-[#21867A] text-xs font-mono shadow-md animate-fade-in pointer-events-none font-bold">
            {pinDetails[hoveredPin] || hoveredPin}
          </div>
        )}

        <svg
          viewBox="0 0 540 600"
          className="w-full max-w-[540px] select-none"
          style={{ minWidth: '480px' }}
        >
          <defs>
            <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#24313A" floodOpacity="0.12" />
            </filter>
            <filter id="glowGreen" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowAmber" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowRed" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="picoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#065F46" />
            </linearGradient>
            <linearGradient id="breadboardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F8FAFC" />
            </linearGradient>
            <linearGradient id="metalPlate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="50%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>

          {/* === Raspberry Pi Pico WH Board (Left Side) === */}
          <g transform="translate(30, 80)" filter="url(#shadow)">
            {/* PCB Body */}
            <rect width="115" height="290" rx="8" fill="url(#picoGrad)" stroke="#10B981" strokeWidth="1.5" />
            
            {/* Micro-USB Port */}
            <rect x="37" y="-10" width="40" height="20" rx="3" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            
            {/* USB Connected Cable (Levels >= 1) */}
            {levelNumber >= 1 && (
              <g>
                <rect x="42" y="-35" width="30" height="28" rx="2" fill="#1E293B" stroke="#475569" strokeWidth="1" />
                <line x1="57" y1="-35" x2="57" y2="-60" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                <circle cx="57" cy="12" r="3" fill="#10B981" filter="url(#glowGreen)" />
              </g>
            )}

            {/* RP2040 Chip */}
            <rect x="37" y="115" width="40" height="40" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
            <text x="57" y="138" textAnchor="middle" fill="#CBD5E1" fontSize="8" fontWeight="bold" fontFamily="monospace">RP2040</text>
            
            {/* Wi-Fi Metal Can */}
            <rect x="27" y="24" width="60" height="46" rx="3" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
            <text x="57" y="52" textAnchor="middle" fill="#334155" fontSize="9" fontWeight="extrabold">CYW43439</text>

            {/* Onboard LED (Level 1 pulsing) */}
            <circle
              cx="45"
              cy="76"
              r="3.5"
              fill={levelNumber >= 1 ? '#10B981' : '#064E3B'}
              filter={levelNumber >= 1 ? 'url(#glowGreen)' : undefined}
            />
            <text x="54" y="79" fill="#A7F3D0" fontSize="6.5" fontWeight="bold">LED</text>

            {/* Pin Headers Left (GP0 - GP15) */}
            {Array.from({ length: 20 }).map((_, i) => {
              const cy = 20 + i * 13;
              const isGP14 = i === 18;
              const isGP15 = i === 19;
              const isGP4 = i === 4;
              const isGP5 = i === 5;

              return (
                <g 
                  key={`pico-left-${i}`}
                  onMouseEnter={() => {
                    if (isGP14) setHoveredPin('GP14');
                    else if (isGP15) setHoveredPin('GP15');
                    else if (isGP4) setHoveredPin('GP4');
                    else if (isGP5) setHoveredPin('GP5');
                  }}
                  onMouseLeave={() => setHoveredPin(null)}
                  className="cursor-pointer"
                >
                  <circle cx="8" cy={cy} r="3" fill="#D97706" stroke="#B45309" strokeWidth="0.5" />
                </g>
              );
            })}

            {/* Pin Headers Right (GP16 - 3V3) */}
            {Array.from({ length: 20 }).map((_, i) => {
              const cy = 20 + i * 13;
              const isGND38 = i === 18;
              const is3V3 = i === 16;
              const isGP16 = i === 0;
              const isGP17 = i === 1;
              const isGP18 = i === 2;

              return (
                <g 
                  key={`pico-right-${i}`}
                  onMouseEnter={() => {
                    if (isGND38) setHoveredPin('GND_38');
                    else if (is3V3) setHoveredPin('3V3');
                    else if (isGP16) setHoveredPin('GP16');
                    else if (isGP17) setHoveredPin('GP17');
                    else if (isGP18) setHoveredPin('GP18');
                  }}
                  onMouseLeave={() => setHoveredPin(null)}
                  className="cursor-pointer"
                >
                  <circle cx="107" cy={cy} r="3" fill="#D97706" stroke="#B45309" strokeWidth="0.5" />
                </g>
              );
            })}

            {/* Pin Labels */}
            <text x="18" y="74" fill="#60A5FA" fontSize="7" fontWeight="bold">GP4</text>
            <text x="18" y="87" fill="#FBBF24" fontSize="7" fontWeight="bold">GP5</text>
            <text x="18" y="256" fill="#FBBF24" fontSize="7" fontWeight="bold">GP14</text>
            <text x="18" y="269" fill="#34D399" fontSize="7" fontWeight="bold">GP15</text>

            <text x="96" y="22" textAnchor="end" fill="#FB923C" fontSize="7" fontWeight="bold">GP16</text>
            <text x="96" y="35" textAnchor="end" fill="#F87171" fontSize="7" fontWeight="bold">GP17</text>
            <text x="96" y="48" textAnchor="end" fill="#F43F5E" fontSize="7" fontWeight="bold">GP18</text>
            <text x="96" y="230" textAnchor="end" fill="#FBBF24" fontSize="7" fontWeight="bold">3V3 (36)</text>
            <text x="96" y="256" textAnchor="end" fill="#94A3B8" fontSize="7" fontWeight="bold">GND (38)</text>

            <text x="57" y="215" textAnchor="middle" fill="#A7F3D0" fontSize="10" fontWeight="extrabold" letterSpacing="0.8">PICO WH</text>
          </g>

          {/* === Breadboard Body === */}
          <g filter="url(#shadow)">
            <rect
              x={startX - 45}
              y={startY - 25}
              width="275"
              height={rows * rowSpacing + 50}
              rx="12"
              fill="url(#breadboardGrad)"
              stroke="#CBD5E1"
              strokeWidth="2"
            />

            {/* Power Rails Left: Blue (-) and Red (+) */}
            <line x1={startX - 30} y1={startY} x2={startX - 30} y2={startY + (rows - 1) * rowSpacing} stroke="#3B82F6" strokeWidth="2.5" />
            <line x1={startX - 15} y1={startY} x2={startX - 15} y2={startY + (rows - 1) * rowSpacing} stroke="#EF4444" strokeWidth="2.5" />
            
            {/* Power Rail Holes */}
            {Array.from({ length: rows }).map((_, i) => (
              <g key={`rail-${i}`}>
                <circle cx={startX - 30} cy={startY + i * rowSpacing} r="2.5" fill="#334155" />
                <circle cx={startX - 15} cy={startY + i * rowSpacing} r="2.5" fill="#334155" />
              </g>
            ))}

            {/* Column Headers */}
            {colsLeft.map((c, i) => (
              <text key={`col-l-${c}`} x={startX + i * holeSpacing} y={startY - 10} textAnchor="middle" fill="#64748B" fontSize="8" fontWeight="bold">
                {c}
              </text>
            ))}
            {colsRight.map((c, i) => (
              <text key={`col-r-${c}`} x={startX + colsLeft.length * holeSpacing + trenchWidth + i * holeSpacing} y={startY - 10} textAnchor="middle" fill="#64748B" fontSize="8" fontWeight="bold">
                {c}
              </text>
            ))}

            {/* Center Trench Divider */}
            <rect
              x={startX + colsLeft.length * holeSpacing + 2}
              y={startY - 5}
              width={trenchWidth - 4}
              height={rows * rowSpacing + 10}
              fill="#CBD5E1"
            />

            {/* Terminal Holes Grid & Row Numbers */}
            {Array.from({ length: rows }).map((_, r) => {
              const rowNum = r + 1;
              const y = startY + r * rowSpacing;

              return (
                <g key={`row-${rowNum}`}>
                  {rowNum % 5 === 0 && (
                    <text x={startX - 4} y={y + 3} textAnchor="end" fill="#94A3B8" fontSize="7" fontWeight="bold">
                      {rowNum}
                    </text>
                  )}

                  {colsLeft.map((col) => {
                    const { x } = getHoleCoords(col, rowNum);
                    return <circle key={`hole-${col}-${rowNum}`} cx={x} cy={y} r="2.5" fill="#1E293B" />;
                  })}

                  {colsRight.map((col) => {
                    const { x } = getHoleCoords(col, rowNum);
                    return <circle key={`hole-${col}-${rowNum}`} cx={x} cy={y} r="2.5" fill="#1E293B" />;
                  })}
                </g>
              );
            })}
          </g>

          {/* === LEVEL 2 CIRCUITS: External LEDs & Resistors with Realistic Component Rendering === */}
          {levelNumber === 2 && (
            <g>
              {/* Step 1: Ground Wire from Pico Pin 38 (145, 321) to Blue Rail (-) (190, 320) */}
              <g filter="url(#shadow)">
                <path
                  d="M 145 321 C 165 340, 175 320, 190 320"
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="145" cy="321" r="3" fill="#94A3B8" />
                <circle cx="190" cy="320" r="3" fill="#94A3B8" />
              </g>

              {/* Step 2: Ground Extension Wire from Blue Rail (-) (190, 352) to Row 18 Col F (324, 352) */}
              {currentStepIndex >= 1 && (
                <g filter="url(#shadow)">
                  <path
                    d="M 190 352 C 220 380, 280 375, 324 352"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* DuPont connector sleeves */}
                  <rect x="187" y="348" width="6" height="8" rx="1" fill="#000" />
                  <rect x="321" y="348" width="6" height="8" rx="1" fill="#000" />
                  <text x="324" y="367" textAnchor="middle" fill="#64748B" fontSize="6" fontWeight="bold">GND (Row 18)</text>
                </g>
              )}

              {/* Step 3: GP15 Green Wire from Pico GP15 (Pin 20) (30, 347) to Row 15 Col B (236, 304) */}
              {currentStepIndex >= 2 && (
                <g filter="url(#shadow)">
                  <path
                    d="M 30 347 C 75 425, 170 370, 236 304"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <rect x="233" y="300" width="6" height="8" rx="1" fill="#047857" />
                  <text x="236" y="295" textAnchor="middle" fill="#10B981" fontSize="6.5" fontWeight="bold">GP15 (3.3V)</text>
                </g>
              )}

              {/* Step 4: 220Ω Resistor spanning Row 15 Col E (284, 304) across the trench to Row 15 Col F (324, 304) */}
              {currentStepIndex >= 3 && (
                <g filter="url(#shadow)">
                  {/* Left Lead entering Row 15 Col E */}
                  <line x1="284" y1="304" x2="292" y2="304" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                  {/* Right Lead entering Row 15 Col F */}
                  <line x1="316" y1="304" x2="324" y2="304" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Ceramic Dogbone Resistor Body centered at x=304 across the trench */}
                  <rect x="292" y="299" width="24" height="10" rx="3.5" fill="#D5B597" stroke="#8C6D4F" strokeWidth="0.8" />
                  
                  {/* 4 Precise Color Bands: Red, Red, Brown, Gold */}
                  <rect x="296" y="299" width="2.2" height="10" fill="#DC2626" />
                  <rect x="301" y="299" width="2.2" height="10" fill="#DC2626" />
                  <rect x="306" y="299" width="2.2" height="10" fill="#78350F" />
                  <rect x="312" y="299" width="2" height="10" fill="#D4AF37" />

                  {/* Hole Insertion Pins */}
                  <circle cx="284" cy="304" r="2.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
                  <circle cx="324" cy="304" r="2.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
                  <text x="304" y="295" textAnchor="middle" fill="#D97706" fontSize="6" fontWeight="bold">220Ω Limiter</text>
                </g>
              )}

              {/* Step 5: 5mm Green LED on Right Side of Breadboard:
                  Anode (+) long leg in Row 15 Col H (356, 304) (connected to Resistor via Row 15)
                  Cathode (-) short leg in Row 18 Col H (356, 352) (connected to Ground via Row 18)
                  Bulb centered between Row 15 and Row 18 at y=328! */}
              {currentStepIndex >= 4 && (
                <g filter="url(#shadow)">
                  {/* Internal Breadboard Metal Track Highlighting */}
                  {/* Row 15 metal clip linking Resistor (Col F) to LED Anode (Col H) */}
                  <line x1="324" y1="304" x2="356" y2="304" stroke="#10B981" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />
                  
                  {/* Row 18 metal clip linking Ground Wire (Col F) to LED Cathode (Col H) */}
                  <line x1="324" y1="352" x2="356" y2="352" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />

                  {/* Anode Metal Lead (Bent into Row 15 Col H) */}
                  <path
                    d="M 356 320 L 356 304"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <circle cx="356" cy="304" r="3" fill="#D4AF37" stroke="#047857" strokeWidth="1" />
                  <text x="368" y="306" fill="#34D399" fontSize="6.5" fontWeight="bold">Anode (+)</text>

                  {/* Cathode Metal Lead (From bottom into Row 18 Col H) */}
                  <path
                    d="M 356 336 L 356 352"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <circle cx="356" cy="352" r="3" fill="#64748B" stroke="#1E293B" strokeWidth="1" />
                  <text x="368" y="354" fill="#94A3B8" fontSize="6.5" fontWeight="bold">Cathode (-) [Flat]</text>

                  {/* 5mm LED Bulb (Top-Down Realistic Epoxy Dome) */}
                  <g transform="translate(356, 328)">
                    {/* Radiant Glow Aura */}
                    <circle cx="0" cy="0" r="14" fill="#10B981" opacity="0.3" filter="url(#glowGreen)" />
                    
                    {/* Outer 5mm Epoxy Rim with Cathode Flat Edge Notch at bottom */}
                    <path
                      d="M -7 -6 A 8.5 8.5 0 1 1 7 -6 L 7 5 L -7 5 Z"
                      fill="#047857"
                      stroke="#065F46"
                      strokeWidth="1.2"
                    />

                    {/* Translucent Green Lens Dome */}
                    <circle cx="0" cy="0" r="8" fill="#10B981" filter="url(#glowGreen)" />

                    {/* Internal Anvil (Cathode) & Post (Anode) */}
                    <path d="M -3 3 L -1 -2 L -4 -2 Z" fill="#E2E8F0" opacity="0.85" />
                    <line x1="2" y1="3" x2="1" y2="-1" stroke="#E2E8F0" strokeWidth="1" opacity="0.85" />

                    {/* Specular Highlight Arc */}
                    <path d="M -4 -4 A 5 5 0 0 1 3 -4" fill="none" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.8" strokeLinecap="round" />
                    <circle cx="-3" cy="-3" r="1.5" fill="#FFFFFF" opacity="0.95" />
                  </g>
                </g>
              )}
            </g>
          )}

          {/* === LEVEL 3 CIRCUITS: Accurate 4-Pin Tactile Button straddling the trench === */}
          {levelNumber === 3 && (
            <g>
              {/* Ground Wire */}
              <path d="M 137 334 C 165 370, 175 320, 190 320" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" filter="url(#shadow)" />

              {/* Realistic 6x6mm Tactile Button Body spanning Row 10 across trench */}
              <g 
                filter="url(#shadow)"
                className="cursor-pointer"
                onMouseDown={() => setInteractivePressed(true)}
                onMouseUp={() => setInteractivePressed(false)}
              >
                {/* 4 Curved Metal Legs straddling Col E & Col F */}
                <path d="M 276 220 L 268 224" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                <path d="M 276 236 L 268 240" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                <path d="M 312 220 L 324 224" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                <path d="M 312 236 L 324 240" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />

                {/* Square Metallic Housing Body */}
                <rect x="274" y="212" width="40" height="36" rx="4" fill="url(#metalPlate)" stroke="#475569" strokeWidth="1.5" />
                {/* 4 Corner Securing Rivets */}
                <circle cx="278" cy="216" r="1.5" fill="#334155" />
                <circle cx="310" cy="216" r="1.5" fill="#334155" />
                <circle cx="278" cy="244" r="1.5" fill="#334155" />
                <circle cx="310" cy="244" r="1.5" fill="#334155" />

                {/* Center Tactile Round Plunger Button */}
                <circle 
                  cx="294" 
                  cy="230" 
                  r={interactivePressed ? "9" : "11"} 
                  fill={interactivePressed ? "#F97316" : "#0284C7"} 
                  stroke={interactivePressed ? "#C2410C" : "#0369A1"} 
                  strokeWidth="2"
                  filter={interactivePressed ? 'url(#glowAmber)' : undefined}
                />
                <text x="294" y="258" textAnchor="middle" fill="#94A3B8" fontSize="7" fontWeight="bold">
                  {interactivePressed ? '0 (GND)' : '1 (3.3V)'}
                </text>
              </g>

              {/* Yellow Wire: Pico GP14 to Row 10 Col D */}
              <path d="M 38 335 C 90 280, 200 230, 268 224" fill="none" stroke="#EAB308" strokeWidth="3.5" strokeLinecap="round" filter="url(#shadow)" />
              
              {/* Black Wire: Row 10 Col G to Ground Rail */}
              <path d="M 324 224 C 345 224, 345 180, 190 224" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

              {/* Dual LEDs (Green and Orange) */}
              <circle cx="284" cy="304" r="7" fill={interactivePressed ? '#064E3B' : '#10B981'} filter={!interactivePressed ? 'url(#glowGreen)' : undefined} />
              <circle cx="284" cy="384" r="7" fill={interactivePressed ? '#F97316' : '#7C2D12'} filter={interactivePressed ? 'url(#glowAmber)' : undefined} />
            </g>
          )}

          {/* === LEVEL 4 CIRCUITS: True 0.96" SSD1306 OLED Module mounted on Breadboard === */}
          {levelNumber === 4 && (
            <g>
              {/* Authentic 0.96" OLED Module Graphic */}
              <g transform="translate(340, 150)" filter="url(#shadow)">
                {/* Blue PCB */}
                <rect width="105" height="120" rx="8" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1.5" />
                {/* 4 Mounting Holes */}
                <circle cx="8" cy="12" r="3" fill="#0F172A" />
                <circle cx="97" cy="12" r="3" fill="#0F172A" />
                <circle cx="8" cy="108" r="3" fill="#0F172A" />
                <circle cx="97" cy="108" r="3" fill="#0F172A" />

                {/* 4 Top Header Pins with Silkscreen */}
                <circle cx="26" cy="14" r="3" fill="#EF4444" /><text x="26" y="24" textAnchor="middle" fill="#EF4444" fontSize="5" fontWeight="bold">VCC</text>
                <circle cx="44" cy="14" r="3" fill="#1E293B" /><text x="44" y="24" textAnchor="middle" fill="#94A3B8" fontSize="5" fontWeight="bold">GND</text>
                <circle cx="62" cy="14" r="3" fill="#FBBF24" /><text x="62" y="24" textAnchor="middle" fill="#FBBF24" fontSize="5" fontWeight="bold">SCL</text>
                <circle cx="80" cy="14" r="3" fill="#3B82F6" /><text x="80" y="24" textAnchor="middle" fill="#3B82F6" fontSize="5" fontWeight="bold">SDA</text>

                {/* Real Black Glass Panel */}
                <rect x="12" y="30" width="81" height="70" rx="3" fill="#000000" stroke="#475569" strokeWidth="1" />
                <text x="52" y="48" textAnchor="middle" fill="#22D3EE" fontSize="7" fontWeight="bold" fontFamily="monospace">NXPLORERS IoT</text>
                <text x="52" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontFamily="monospace">CyberKnights</text>
                <text x="52" y="76" textAnchor="middle" fill="#34D399" fontSize="6" fontFamily="monospace">Age: 13 | Subbiah</text>
                <text x="52" y="90" textAnchor="middle" fill="#94A3B8" fontSize="5" fontFamily="monospace">I2C: 0x3C ONLINE</text>
              </g>

              {/* 4 Jumper Wires connecting OLED to Pico and Rails */}
              <path d="M 38 154 C 100 130, 250 140, 420 164" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" filter="url(#shadow)" />
              <path d="M 38 167 C 100 150, 250 160, 402 164" fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" filter="url(#shadow)" />
              <path d="M 137 308 C 200 320, 300 280, 366 164" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" filter="url(#shadow)" />
              <path d="M 137 334 C 180 350, 280 300, 384 164" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" filter="url(#shadow)" />
            </g>
          )}

          {/* === LEVEL 5 CIRCUITS: Grand IoT Node (OLED + Buzzer + Alert LED) === */}
          {levelNumber === 5 && (
            <g>
              {/* OLED Module */}
              <g transform="translate(340, 130)" filter="url(#shadow)">
                <rect width="105" height="110" rx="8" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1.5" />
                <rect x="12" y="25" width="81" height="65" rx="3" fill="#000" stroke="#F59E0B" strokeWidth="1" />
                <text x="52" y="44" textAnchor="middle" fill="#FBBF24" fontSize="7" fontWeight="bold">LIVE TELEMETRY</text>
                <text x="52" y="58" textAnchor="middle" fill="#34D399" fontSize="6.5">T: 27°C | S: 42%</text>
                <text x="52" y="72" textAnchor="middle" fill="#94A3B8" fontSize="6">STATUS: SAFE</text>
              </g>

              {/* Active Buzzer on Row 25 */}
              <g transform="translate(250, 410)" filter="url(#shadow)">
                <circle cx="18" cy="18" r="18" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                <circle cx="18" cy="18" r="5" fill="#0F172A" />
                <text x="18" y="10" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">+</text>
                <text x="18" y="46" textAnchor="middle" fill="#F43F5E" fontSize="7" fontWeight="bold">BUZZER (GP18)</text>
              </g>
              <path d="M 137 130 C 180 180, 220 380, 268 410" fill="none" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" filter="url(#shadow)" />

              {/* Red Alert LED on GP17 */}
              <circle cx="284" cy="370" r="7" fill="#EF4444" stroke="#991B1B" filter="url(#glowRed)" />
            </g>
          )}

          {/* === Target Pulsing Indicator Rings for Active Steps === */}
          {activeHoles.map((hole, i) => (
            <g key={`target-${i}`} filter="url(#glowGreen)">
              <circle
                cx={hole.x}
                cy={hole.y}
                r="7"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                className="animate-pulse"
              />
              <circle cx={hole.x} cy={hole.y} r="2.5" fill="#10B981" />
              {/* Tooltip Label */}
              <rect
                x={hole.x - 45}
                y={hole.y - 25}
                width="90"
                height="16"
                rx="4"
                fill="#0F172A"
                stroke="#10B981"
                strokeWidth="0.8"
              />
              <text
                x={hole.x}
                y={hole.y - 14}
                textAnchor="middle"
                fill="#34D399"
                fontSize="7.5"
                fontWeight="extrabold"
              >
                {hole.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Helpful Hint Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive schematic: Click the push button or hover over Pico pins on the left.</span>
        </span>
        <span className="font-mono text-gray-500 text-[11px]">Orthographic Hardware Blueprint</span>
      </div>
    </div>
  );
};
