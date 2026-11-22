import React, { useState } from 'react';
import { CircuitStep } from '../../types/curriculum.js';
import { 
  ChevronRight, 
  ChevronLeft, 
  HelpCircle, 
  Info,
  Sparkles,
  Layers,
  Zap
} from 'lucide-react';
import { 
  Breadboard, 
  PicoW, 
  Led, 
  Resistor, 
  PushButton, 
  Oled,
  PartHover, 
  BreadboardHover, 
  getHole, 
  getRailHole, 
  placeByPin, 
  pinPosition,
  picoWMeta, 
  ledMeta, 
  resistorMeta, 
  pushButtonMeta, 
  oledMeta, 
  Hole 
} from '../../hardware/index.js';

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
  const [hoveredHoleInfo, setHoveredHoleInfo] = useState<Hole | null>(null);

  // Layout origin anchors
  const PICO = { x: 22, y: 35 };
  const BB = { x: 135, y: 30 };
  const at = (h: { x: number; y: number }) => ({ x: BB.x + h.x, y: BB.y + h.y });

  // Calculate target hole highlights for active steps
  const getHighlightHoles = (): string[] => {
    if (levelNumber === 2) {
      if (currentStepIndex === 0) return ['b-2'];
      if (currentStepIndex === 1) return ['b-2', 'b-4', 'f18'];
      if (currentStepIndex === 2) return ['b-2', 'b-4', 'f18', 'a15'];
      if (currentStepIndex === 3) return ['b-2', 'b-4', 'f18', 'a15', 'c15', 'c21'];
      return ['b-2', 'b-4', 'f18', 'a15', 'c15', 'c21', 'a21', 'a20', 'e20'];
    }
    if (levelNumber === 3) {
      if (currentStepIndex === 0) return ['c30', 'e30', 'c37', 'e37'];
      if (currentStepIndex === 1) return ['c30', 'e30', 'c37', 'e37', 'a30'];
      if (currentStepIndex === 2) return ['c30', 'e30', 'c37', 'e37', 'a30', 't-6'];
      return ['c30', 'e30', 'c37', 'e37', 'a30', 't-6', 'a15', 'a25'];
    }
    if (levelNumber === 4) {
      return ['f38', 'f39', 'f40', 'f41', 'b-7', 'b+7'];
    }
    if (levelNumber === 5) {
      return ['f38', 'f39', 'f40', 'f41', 'f24', 'f25'];
    }
    return [];
  };

  // Helper for drawing realistic DuPont jumper wire paths
  const renderWire = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    color: string,
    bendY = 30,
    key?: string
  ) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const c1x = from.x + dx * 0.25;
    const c1y = from.y + bendY;
    const c2x = to.x - dx * 0.25;
    const c2y = to.y + bendY;

    return (
      <g key={key} filter="url(#wireShadow)" className="pointer-events-none">
        <path
          d={`M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`}
          fill="none"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* DuPont connector pin collars */}
        <circle cx={from.x} cy={from.y} r="2.8" fill="#1E293B" stroke={color} strokeWidth="0.8" />
        <circle cx={to.x} cy={to.y} r="2.8" fill="#1E293B" stroke={color} strokeWidth="0.8" />
      </g>
    );
  };

  // Pre-calculated component coordinates
  // Level 2: LED & Resistor
  const l2Resistor = placeByPin(resistorMeta, '1', at(getHole('c', 15)));
  const l2Led = placeByPin(ledMeta, 'C', at(getHole('a', 20)));

  // Level 3: Button & Dual LEDs
  const l3Btn = placeByPin(pushButtonMeta, '1.l', at(getHole('c', 30)));
  const l3GreenLed = placeByPin(ledMeta, 'C', at(getHole('f', 15)));
  const l3OrangeLed = placeByPin(ledMeta, 'C', at(getHole('f', 24)));
  const l3ResGreen = placeByPin(resistorMeta, '1', at(getHole('h', 15)));
  const l3ResOrange = placeByPin(resistorMeta, '1', at(getHole('h', 24)));

  // Level 4 & 5: OLED display
  const l4Oled = placeByPin(oledMeta, 'GND', at(getHole('f', 38)));

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
            {activeStep ? activeStep.title : 'Circuit Blueprint Complete'}
          </h3>
        </div>

        {/* Step Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => onStepChange(currentStepIndex - 1)}
            className="p-2.5 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#D5CFC2] disabled:opacity-30 text-[#24313A] transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
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
            className="p-2.5 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#D5CFC2] disabled:opacity-30 text-[#24313A] transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
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
            className="w-4 h-4 rounded-full shrink-0 mt-0.5 shadow-xs ring-2 ring-white/60"
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

      {/* Orthographic Hardware Blueprint SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-[#F8F9FA] rounded-2xl border border-[#EBE6DC] p-4 flex justify-center">
        
        {/* Hovered Hole Info Badge */}
        {hoveredHoleInfo && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-lg bg-white border border-[#B2DFDB] text-[#21867A] text-xs font-mono shadow-sm animate-fade-in pointer-events-none font-bold">
            Hole {hoveredHoleInfo.id} • {hoveredHoleInfo.net}
          </div>
        )}

        <svg
          viewBox="0 0 830 310"
          className="w-full max-w-[830px] select-none"
          style={{ minWidth: '680px', overflow: 'visible' }}
        >
          <defs>
            <filter id="wireShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0.5" dy="2" stdDeviation="1.5" floodColor="#24313A" floodOpacity="0.15" />
            </filter>
            <filter id="picoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Raspberry Pi Pico WH Board (Left Side) */}
          <PicoW x={PICO.x} y={PICO.y} />

          {/* Micro-USB Cable connected to Pico (Levels >= 1) */}
          {levelNumber >= 1 && (
            <g className="pointer-events-none">
              <rect x={PICO.x + 28} y={PICO.y - 30} width="22" height="24" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="0.8" />
              <line x1={PICO.x + 39} y1={PICO.y - 30} x2={PICO.x + 39} y2={PICO.y - 50} stroke="#475569" strokeWidth="5" strokeLinecap="round" />
            </g>
          )}

          {/* 2. Full-Size Breadboard (63 Columns, Power Rails) */}
          <Breadboard
            x={BB.x}
            y={BB.y}
            highlight={getHighlightHoles()}
          />

          {/* === LEVEL 2: External LED Circuit === */}
          {levelNumber === 2 && (
            <g>
              {/* Step 1: Main Ground Wire (Pico GND.38 -> Breadboard Bottom Blue Rail) */}
              {renderWire(
                pinPosition(picoWMeta, 'GND.38', PICO),
                at(getRailHole('bottom', '-', 2)),
                '#1E293B',
                45,
                'l2-w1'
              )}

              {/* Step 2: Ground Extension Wire (Blue Rail -> Row 18) */}
              {currentStepIndex >= 1 && (
                <>
                  {renderWire(
                    at(getRailHole('bottom', '-', 4)),
                    at(getHole('e', 20)),
                    '#1E293B',
                    -25,
                    'l2-w2'
                  )}
                </>
              )}

              {/* Step 3: GP15 Wire (Pico GP15 -> Row 15 Col a) */}
              {currentStepIndex >= 2 && (
                <>
                  {renderWire(
                    pinPosition(picoWMeta, 'GP15', PICO),
                    at(getHole('a', 15)),
                    '#2A9D8F',
                    65,
                    'l2-w3'
                  )}
                </>
              )}

              {/* Step 4: 220Ω Resistor across Col 15 -> Col 21 */}
              {currentStepIndex >= 3 && (
                <g>
                  <Resistor
                    {...l2Resistor}
                    ohms={220}
                  />
                  <PartHover meta={resistorMeta} {...l2Resistor} />
                </g>
              )}

              {/* Step 5: 5mm Green LED (Anode in Col 21, Cathode in Col 20) */}
              {currentStepIndex >= 4 && (
                <g>
                  <Led
                    {...l2Led}
                    color="green"
                    lit={true}
                    brightness={1.3}
                  />
                  <PartHover meta={ledMeta} {...l2Led} />
                </g>
              )}
            </g>
          )}

          {/* === LEVEL 3: Push Button & Dual LEDs Circuit === */}
          {levelNumber === 3 && (
            <g>
              {/* Ground Wire from Pico GND to Top Rail (-) */}
              {renderWire(
                pinPosition(picoWMeta, 'GND.38', PICO),
                at(getRailHole('top', '-', 6)),
                '#1E293B',
                -35,
                'l3-w1'
              )}

              {/* Push Button mounted on Breadboard */}
              <PushButton
                {...l3Btn}
                color="green"
                pressed={interactivePressed}
                onMouseDown={() => setInteractivePressed(true)}
                onMouseUp={() => setInteractivePressed(false)}
                className="cursor-pointer"
              />

              {/* GP14 Signal Wire (Pico GP14 -> Col 30 Row a) */}
              {currentStepIndex >= 1 && (
                renderWire(
                  pinPosition(picoWMeta, 'GP14', PICO),
                  at(getHole('a', 30)),
                  '#EAB308',
                  55,
                  'l3-w2'
                )
              )}

              {/* Button Ground Wire (Col 37 Row a -> Top Rail -) */}
              {currentStepIndex >= 2 && (
                renderWire(
                  at(getHole('a', 37)),
                  at(getRailHole('top', '-', 6)),
                  '#1E293B',
                  -20,
                  'l3-w3'
                )
              )}

              {/* Dual LEDs on Breadboard (Step 4) */}
              {currentStepIndex >= 3 && (
                <g>
                  {/* Normal Green LED on Col 15 */}
                  <Led
                    {...l3GreenLed}
                    color="green"
                    lit={!interactivePressed}
                    brightness={1.2}
                  />
                  <Resistor {...l3ResGreen} ohms={220} />

                  {/* Alert Orange LED on Col 24 */}
                  <Led
                    {...l3OrangeLed}
                    color="orange"
                    lit={interactivePressed}
                    brightness={1.2}
                  />
                  <Resistor {...l3ResOrange} ohms={220} />

                  {/* Wires to GP15 & GP16 */}
                  {renderWire(
                    pinPosition(picoWMeta, 'GP15', PICO),
                    at(getHole('j', 15)),
                    '#2A9D8F',
                    60,
                    'l3-w-green'
                  )}
                  {renderWire(
                    pinPosition(picoWMeta, 'GP16', PICO),
                    at(getHole('j', 24)),
                    '#F4C95D',
                    60,
                    'l3-w-orange'
                  )}
                </g>
              )}

              <PartHover meta={pushButtonMeta} {...l3Btn} />
            </g>
          )}

          {/* === LEVEL 4: SSD1306 OLED Display === */}
          {levelNumber === 4 && (
            <g>
              {/* OLED Display plugged into Breadboard */}
              <Oled {...l4Oled} scale={1}>
                <text x="64" y="16" fill="#38BDF8" fontFamily="monospace" fontSize="10" textAnchor="middle">NXPLORERS IoT</text>
                <text x="64" y="32" fill="#FFFFFF" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">CyberKnights</text>
                <text x="64" y="46" fill="#4ADE80" fontFamily="monospace" fontSize="8" textAnchor="middle">Age: 13 | Subbiah</text>
                <text x="64" y="58" fill="#94A3B8" fontFamily="monospace" fontSize="7" textAnchor="middle">I2C: 0x3C ONLINE</text>
              </Oled>

              {/* Step 1: VCC & GND Power Wires */}
              {renderWire(
                at(getHole('j', 38)),
                at(getRailHole('bottom', '-', 7)),
                '#1E293B',
                20,
                'l4-gnd'
              )}
              {renderWire(
                at(getHole('j', 39)),
                at(getRailHole('bottom', '+', 7)),
                '#EF4444',
                25,
                'l4-vcc'
              )}

              {/* Step 2: SDA Wire (Pico GP4 -> OLED SDA at col 41) */}
              {currentStepIndex >= 1 && (
                renderWire(
                  pinPosition(picoWMeta, 'GP4', PICO),
                  at(getHole('j', 41)),
                  '#3B82F6',
                  50,
                  'l4-sda'
                )
              )}

              {/* Step 3: SCL Wire (Pico GP5 -> OLED SCL at col 40) */}
              {currentStepIndex >= 2 && (
                renderWire(
                  pinPosition(picoWMeta, 'GP5', PICO),
                  at(getHole('j', 40)),
                  '#EAB308',
                  45,
                  'l4-scl'
                )
              )}

              <PartHover meta={oledMeta} {...l4Oled} />
            </g>
          )}

          {/* === LEVEL 5: Grand IoT Challenge Node === */}
          {levelNumber === 5 && (
            <g>
              {/* OLED Telemetry Display */}
              <Oled {...l4Oled} scale={1}>
                <text x="64" y="14" fill="#F4C95D" fontFamily="monospace" fontSize="9" textAnchor="middle">LIVE CLOUD FEED</text>
                <text x="64" y="28" fill="#FFFFFF" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">TEMP: 26.8°C</text>
                <text x="64" y="42" fill="#38BDF8" fontFamily="monospace" fontSize="10" textAnchor="middle">HUMID: 55.4%</text>
                <text x="64" y="56" fill="#4ADE80" fontFamily="monospace" fontSize="9" textAnchor="middle">SOIL: 42.1% OK</text>
              </Oled>
              {renderWire(at(getHole('j', 38)), at(getRailHole('bottom', '-', 7)), '#1E293B', 20, 'l5-gnd')}
              {renderWire(at(getHole('j', 39)), at(getRailHole('bottom', '+', 7)), '#EF4444', 25, 'l5-vcc')}
              {renderWire(pinPosition(picoWMeta, 'GP4', PICO), at(getHole('j', 41)), '#3B82F6', 50, 'l5-sda')}
              {renderWire(pinPosition(picoWMeta, 'GP5', PICO), at(getHole('j', 40)), '#EAB308', 45, 'l5-scl')}

              {/* Red Alarm LED */}
              <Led
                {...l3OrangeLed}
                color="red"
                lit={true}
                brightness={1.4}
              />
              {renderWire(pinPosition(picoWMeta, 'GP17', PICO), at(getHole('j', 24)), '#EF4444', 60, 'l5-led')}

              <PartHover meta={oledMeta} {...l4Oled} />
            </g>
          )}

          {/* 3. Hover Layers on Top of Everything */}
          <PartHover meta={picoWMeta} x={PICO.x} y={PICO.y} />
          <BreadboardHover
            x={BB.x}
            y={BB.y}
            onHoleHover={(h) => setHoveredHoleInfo(h)}
          />
        </svg>
      </div>

      {/* Blueprint Footer */}
      <div className="flex items-center justify-between text-xs text-[#576875] pt-1 border-t border-[#EBE6DC]">
        <span className="flex items-center gap-1.5 font-medium">
          <Info className="w-4 h-4 text-[#2A9D8F]" />
          <span>Interactive Blueprint: Hover over any breadboard hole, Pico pin, or component to view pin specs and nets.</span>
        </span>
        <span className="font-mono text-[#899AA8] text-[11px] font-bold">Wokwi Vector Standard</span>
      </div>
    </div>
  );
};
