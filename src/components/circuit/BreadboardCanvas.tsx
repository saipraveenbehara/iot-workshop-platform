import React, { useState, useEffect } from 'react';
import { CircuitStep } from '../../types/curriculum.js';
import { 
  ChevronRight, 
  ChevronLeft, 
  HelpCircle, 
  Info,
  Sparkles,
  Layers,
  Zap,
  Radio,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { CircuitPanZoom } from './CircuitPanZoom.js';
import { 
  Breadboard, 
  ESP32, 
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
  esp32Meta, 
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
  levelNumber = 0,
}) => {
  const activeStep = steps[currentStepIndex];
  const [interactivePressed, setInteractivePressed] = useState(false);
  const [onboardBlink, setOnboardBlink] = useState(true);
  const [hoveredHoleInfo, setHoveredHoleInfo] = useState<Hole | null>(null);

  // Auto-blink for Level 1 onboard LED
  useEffect(() => {
    if (levelNumber === 1) {
      const interval = setInterval(() => {
        setOnboardBlink((prev) => !prev);
      }, 700);
      return () => clearInterval(interval);
    }
  }, [levelNumber]);

  // Viewport & placement geometry
  // ESP32: placed with clean margin so the USB port, Wi-Fi shield, and all 30 pins are 100% visible
  const ESP = { x: 12, y: 40 };
  const BB = { x: 135, y: 40 };
  const at = (h: { x: number; y: number }) => ({ x: BB.x + h.x, y: BB.y + h.y });

  // Target hole highlights for each step
  const getHighlightHoles = (): string[] => {
    if (levelNumber === 2) {
      if (currentStepIndex === 0) return ['b-2'];
      if (currentStepIndex === 1) return ['b-2', 'b-4', 'e20'];
      if (currentStepIndex === 2) return ['b-2', 'b-4', 'e20', 'a15'];
      if (currentStepIndex === 3) return ['b-2', 'b-4', 'e20', 'a15', 'c15', 'c21'];
      return ['b-2', 'b-4', 'e20', 'a15', 'c15', 'c21', 'a21', 'a20'];
    }
    if (levelNumber === 3) {
      if (currentStepIndex === 0) return ['c30', 'e30', 'c37', 'e37'];
      if (currentStepIndex === 1) return ['c30', 'e30', 'c37', 'e37', 'a30'];
      if (currentStepIndex === 2) return ['c30', 'e30', 'c37', 'e37', 'a30', 't-6'];
      return ['c30', 'e30', 'c37', 'e37', 'a30', 't-6', 'j15', 'j24'];
    }
    if (levelNumber === 4) {
      return ['j38', 'j39', 'j40', 'j41', 'b-7', 'b+7'];
    }
    if (levelNumber === 5) {
      return ['j38', 'j39', 'j40', 'j41', 'j24', 'j15'];
    }
    return [];
  };

  // Helper for drawing realistic DuPont jumper wires
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
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* DuPont connector sleeves */}
        <circle cx={from.x} cy={from.y} r="3" fill="#1E293B" stroke={color} strokeWidth="1" />
        <circle cx={to.x} cy={to.y} r="3" fill="#1E293B" stroke={color} strokeWidth="1" />
      </g>
    );
  };

  // Component positions using exact breadboard coordinate mapping
  const l2Resistor = placeByPin(resistorMeta, '1', at(getHole('c', 15)));
  const l2Led = placeByPin(ledMeta, 'C', at(getHole('a', 20)));

  const l3Btn = placeByPin(pushButtonMeta, '1.l', at(getHole('c', 30)));
  const l3GreenLed = placeByPin(ledMeta, 'C', at(getHole('f', 15)));
  const l3OrangeLed = placeByPin(ledMeta, 'C', at(getHole('f', 24)));
  const l3ResGreen = placeByPin(resistorMeta, '1', at(getHole('h', 15)));
  const l3ResOrange = placeByPin(resistorMeta, '1', at(getHole('h', 24)));

  const l4Oled = placeByPin(oledMeta, 'GND', at(getHole('f', 38)));

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 shadow-sm flex flex-col gap-5">
      {/* Step Header & Step Numbering */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBE6DC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F]" />
            <span className="text-xs font-bold text-[#21867A] uppercase tracking-wider font-mono bg-[#E6F4F2] px-2.5 py-0.5 rounded-md border border-[#B2DFDB]">
              Stage {levelNumber} · Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <h3 className="text-lg font-black text-[#24313A] mt-1">
            {activeStep ? activeStep.title : 'Circuit Blueprint Ready'}
          </h3>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => onStepChange(currentStepIndex - 1)}
            className="p-2 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#D5CFC2] disabled:opacity-30 text-[#24313A] transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
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
            className="p-2 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#D5CFC2] disabled:opacity-30 text-[#24313A] transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
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

      {/* Primary Visual Circuit Stage (Focused on ESP32 + Active Circuit Area with Pan & Zoom) */}
      <CircuitPanZoom
        key={`circuit-canvas-${levelNumber}`}
        heightClass="min-h-[380px] h-[380px]"
        initialScale={1.0}
        overlayChildren={
          hoveredHoleInfo ? (
            <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-xs border border-[#B2DFDB] text-[#21867A] text-xs font-mono shadow-sm animate-fade-in pointer-events-none font-bold">
              Hole {hoveredHoleInfo.id} • {hoveredHoleInfo.net}
            </div>
          ) : undefined
        }
      >
        <svg
          viewBox="0 0 540 290"
          className="w-[540px] h-[290px] shrink-0 select-none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id="wireShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0.5" dy="2" stdDeviation="1.5" floodColor="#24313A" floodOpacity="0.18" />
            </filter>
            <filter id="espGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* === STAGE 0: ESP32 DEVKIT V1 ARCHITECTURE INSPECTION === */}
          {levelNumber === 0 && (
            <g>
              {/* ESP32 DevKit V1 at comfortable inspection scale */}
              <ESP32 x={65} y={40} scale={1.05} ledPower={true} led1={false} />
              <PartHover meta={esp32Meta} x={65} y={40} scale={1.05} />

              {/* Callout badges pointing to authentic features */}
              <g fontFamily="sans-serif" fontSize="7" fontWeight="bold">
                {/* Micro-USB Port */}
                <line x1="121" y1="36" x2="175" y2="20" stroke="#2A9D8F" strokeWidth="1" strokeDasharray="2 2" />
                <rect x="175" y="10" width="125" height="18" rx="4" fill="#FFFFFF" stroke="#2A9D8F" strokeWidth="1" filter="url(#wireShadow)" />
                <text x="183" y="22" fill="#21867A">1. Micro-USB Port (Power & C Upload)</text>

                {/* ESP-WROOM-32 Wi-Fi Shield */}
                <line x1="121" y1="85" x2="195" y2="85" stroke="#2A9D8F" strokeWidth="1" strokeDasharray="2 2" />
                <rect x="195" y="76" width="135" height="18" rx="4" fill="#FFFFFF" stroke="#2A9D8F" strokeWidth="1" filter="url(#wireShadow)" />
                <text x="203" y="88" fill="#21867A">2. ESP-WROOM-32 Shield (Wi-Fi & BLE)</text>

                {/* Xtensa 32-bit Dual-Core LX6 */}
                <line x1="121" y1="130" x2="195" y2="135" stroke="#2A9D8F" strokeWidth="1" strokeDasharray="2 2" />
                <rect x="195" y="126" width="130" height="18" rx="4" fill="#FFFFFF" stroke="#2A9D8F" strokeWidth="1" filter="url(#wireShadow)" />
                <text x="203" y="138" fill="#21867A">3. Xtensa Dual-Core @ 240 MHz</text>

                {/* EN & BOOT Buttons */}
                <line x1="83" y1="195" x2="195" y2="185" stroke="#2A9D8F" strokeWidth="1" strokeDasharray="2 2" />
                <rect x="195" y="176" width="130" height="18" rx="4" fill="#FFFFFF" stroke="#2A9D8F" strokeWidth="1" filter="url(#wireShadow)" />
                <text x="203" y="188" fill="#21867A">4. EN (Reset) & BOOT Buttons</text>

                {/* 30 Header Pins */}
                <line x1="67" y1="200" x2="25" y2="245" stroke="#F4C95D" strokeWidth="1" strokeDasharray="2 2" />
                <rect x="10" y="245" width="135" height="18" rx="4" fill="#FFFFFF" stroke="#F4C95D" strokeWidth="1" filter="url(#wireShadow)" />
                <text x="18" y="257" fill="#B88719">5. 30 Header Pins (Breadboard Ready)</text>
              </g>
            </g>
          )}

          {/* === STAGE 1: ONBOARD BLINK & USB CABLE === */}
          {levelNumber === 1 && (
            <g>
              {/* ESP32 DevKit V1 */}
              <ESP32 x={65} y={45} scale={1.05} ledPower={true} led1={onboardBlink} />
              
              {/* USB Cable connected to top */}
              <g filter="url(#wireShadow)">
                <rect x={65 + 41.5} y={15} width="24" height="28" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1" />
                <line x1={65 + 53.5} y1={15} x2={65 + 53.5} y2={-10} stroke="#334155" strokeWidth="6" strokeLinecap="round" />
              </g>

              {/* Callout box pointing to Onboard Blue LED on GPIO 2 */}
              <g fontFamily="sans-serif" fontSize="7" fontWeight="bold">
                <line x1={65 + 71.5 * 1.05} y1={45 + 112.5 * 1.05} x2={190} y2={85} stroke="#2A9D8F" strokeWidth="1" strokeDasharray="2 2" />
                <rect x="190" y="70" width="150" height="34" rx="6" fill="#FFFFFF" stroke="#2A9D8F" strokeWidth="1" filter="url(#wireShadow)" />
                <text x="200" y="83" fill="#21867A">Built-in GPIO 2 User LED</text>
                <text x="200" y="93" fill={onboardBlink ? "#2A9D8F" : "#899AA8"} fontSize="6.5">
                  State: {onboardBlink ? 'HIGH (3.3V ON)' : 'LOW (0V OFF)'}
                </text>
                <text x="200" y="101" fill="#64748B" fontSize="6" fontFamily="monospace">
                  digitalWrite(2, {onboardBlink ? 'HIGH' : 'LOW'});
                </text>
              </g>

              <PartHover meta={esp32Meta} x={65} y={45} scale={1.05} />
            </g>
          )}

          {/* === STAGES 2–5: BREADBOARD CIRCUITS === */}
          {levelNumber >= 2 && (
            <g>
              {/* 1. ESP32 DevKit V1 (Left side, fully visible with USB connection) */}
              <ESP32 x={ESP.x} y={ESP.y} ledPower={true} led1={levelNumber === 3 ? interactivePressed : false} />
              
              {/* Micro-USB Cable plugged into top */}
              <g className="pointer-events-none" filter="url(#wireShadow)">
                <rect x={ESP.x + 41.5} y={ESP.y - 25} width="24" height="24" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="0.8" />
                <line x1={ESP.x + 53.5} y1={ESP.y - 25} x2={ESP.x + 53.5} y2={ESP.y - 40} stroke="#475569" strokeWidth="5" strokeLinecap="round" />
              </g>

              {/* 2. Full Breadboard (Active columns 1-28 front and center) */}
              <Breadboard
                x={BB.x}
                y={BB.y}
                highlight={getHighlightHoles()}
              />

              {/* === LEVEL 2: External LED Circuit === */}
              {levelNumber === 2 && (
                <g>
                  {/* Step 1: Main Ground Wire (ESP32 GND.1 -> Breadboard Bottom Blue Rail) */}
                  {renderWire(
                    pinPosition(esp32Meta, 'GND.1', ESP),
                    at(getRailHole('bottom', '-', 2)),
                    '#1E293B',
                    30,
                    'l2-gnd-main'
                  )}

                  {/* Step 2: Ground Extension Wire (Bottom Blue Rail -> Col 20 Row e) */}
                  {currentStepIndex >= 1 && (
                    renderWire(
                      at(getRailHole('bottom', '-', 4)),
                      at(getHole('e', 20)),
                      '#1E293B',
                      -20,
                      'l2-gnd-ext'
                    )
                  )}

                  {/* Step 3: D15 Wire (ESP32 D15 -> Col 15 Row a) */}
                  {currentStepIndex >= 2 && (
                    renderWire(
                      pinPosition(esp32Meta, 'D15', ESP),
                      at(getHole('a', 15)),
                      '#2A9D8F',
                      40,
                      'l2-sig-d15'
                    )
                  )}

                  {/* Step 4: 220Ω Resistor across Col 15 -> Col 21 */}
                  {currentStepIndex >= 3 && (
                    <g>
                      <Resistor {...l2Resistor} ohms={220} />
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
                  {/* Ground Wire from ESP32 GND.2 to Top Rail (-) */}
                  {renderWire(
                    pinPosition(esp32Meta, 'GND.2', ESP),
                    at(getRailHole('top', '-', 6)),
                    '#1E293B',
                    -35,
                    'l3-w1'
                  )}

                  {/* Push Button mounted across Col 30 and Col 37 */}
                  <PushButton
                    {...l3Btn}
                    color="green"
                    pressed={interactivePressed}
                    onMouseDown={() => setInteractivePressed(true)}
                    onMouseUp={() => setInteractivePressed(false)}
                    className="cursor-pointer"
                  />

                  {/* D14 Signal Wire (ESP32 D14 -> Col 30 Row a) */}
                  {currentStepIndex >= 1 && (
                    renderWire(
                      pinPosition(esp32Meta, 'D14', ESP),
                      at(getHole('a', 30)),
                      '#EAB308',
                      50,
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

                  {/* Dual LEDs on Breadboard (Step 4: Green on D15, Orange Alert on D4) */}
                  {currentStepIndex >= 3 && (
                    <g>
                      <Led {...l3GreenLed} color="green" lit={!interactivePressed} brightness={1.2} />
                      <Resistor {...l3ResGreen} ohms={220} />
                      <Led {...l3OrangeLed} color="orange" lit={interactivePressed} brightness={1.2} />
                      <Resistor {...l3ResOrange} ohms={220} />

                      {renderWire(pinPosition(esp32Meta, 'D15', ESP), at(getHole('j', 15)), '#2A9D8F', 45, 'l3-w-green')}
                      {renderWire(pinPosition(esp32Meta, 'D4', ESP), at(getHole('j', 24)), '#F4C95D', 45, 'l3-w-orange')}
                    </g>
                  )}

                  <PartHover meta={pushButtonMeta} {...l3Btn} />
                </g>
              )}

              {/* === LEVEL 4: SSD1306 OLED Display === */}
              {levelNumber === 4 && (
                <g>
                  <Oled {...l4Oled} scale={1}>
                    <text x="64" y="16" fill="#38BDF8" fontFamily="monospace" fontSize="10" textAnchor="middle">NXPLORERS IoT</text>
                    <text x="64" y="32" fill="#FFFFFF" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">CyberKnights</text>
                    <text x="64" y="46" fill="#4ADE80" fontFamily="monospace" fontSize="8" textAnchor="middle">Age: 13 | Subbiah</text>
                    <text x="64" y="58" fill="#94A3B8" fontFamily="monospace" fontSize="7" textAnchor="middle">I2C: 0x3C ONLINE</text>
                  </Oled>

                  {/* Power Rails Wires to OLED */}
                  {renderWire(at(getHole('j', 38)), at(getRailHole('bottom', '-', 7)), '#1E293B', 20, 'l4-gnd')}
                  {renderWire(at(getHole('j', 39)), at(getRailHole('bottom', '+', 7)), '#EF4444', 25, 'l4-vcc')}

                  {/* ESP32 Main Power to Rails */}
                  {renderWire(pinPosition(esp32Meta, '3V3', ESP), at(getRailHole('bottom', '+', 2)), '#EF4444', 25, 'l4-esp-3v3')}
                  {renderWire(pinPosition(esp32Meta, 'GND.1', ESP), at(getRailHole('bottom', '-', 2)), '#1E293B', 30, 'l4-esp-gnd')}

                  {/* I2C Signal Wires (ESP32 D21 SDA, D22 SCL) */}
                  {currentStepIndex >= 1 && (
                    renderWire(pinPosition(esp32Meta, 'D21', ESP), at(getHole('j', 41)), '#3B82F6', 45, 'l4-sda')
                  )}
                  {currentStepIndex >= 2 && (
                    renderWire(pinPosition(esp32Meta, 'D22', ESP), at(getHole('j', 40)), '#EAB308', 40, 'l4-scl')
                  )}

                  <PartHover meta={oledMeta} {...l4Oled} />
                </g>
              )}

              {/* === LEVEL 5: Grand IoT Challenge Node === */}
              {levelNumber === 5 && (
                <g>
                  <Oled {...l4Oled} scale={1}>
                    <text x="64" y="14" fill="#F4C95D" fontFamily="monospace" fontSize="9" textAnchor="middle">LIVE CLOUD FEED</text>
                    <text x="64" y="28" fill="#FFFFFF" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">TEMP: 26.8°C</text>
                    <text x="64" y="42" fill="#38BDF8" fontFamily="monospace" fontSize="10" textAnchor="middle">HUMID: 55.4%</text>
                    <text x="64" y="56" fill="#4ADE80" fontFamily="monospace" fontSize="9" textAnchor="middle">SOIL: 42.1% OK</text>
                  </Oled>
                  {renderWire(at(getHole('j', 38)), at(getRailHole('bottom', '-', 7)), '#1E293B', 20, 'l5-gnd')}
                  {renderWire(at(getHole('j', 39)), at(getRailHole('bottom', '+', 7)), '#EF4444', 25, 'l5-vcc')}
                  {renderWire(pinPosition(esp32Meta, '3V3', ESP), at(getRailHole('bottom', '+', 2)), '#EF4444', 25, 'l5-esp-3v3')}
                  {renderWire(pinPosition(esp32Meta, 'GND.1', ESP), at(getRailHole('bottom', '-', 2)), '#1E293B', 30, 'l5-esp-gnd')}

                  {/* I2C Lines */}
                  {renderWire(pinPosition(esp32Meta, 'D21', ESP), at(getHole('j', 41)), '#3B82F6', 45, 'l5-sda')}
                  {renderWire(pinPosition(esp32Meta, 'D22', ESP), at(getHole('j', 40)), '#EAB308', 40, 'l5-scl')}

                  {/* Red Alert LED on D18 */}
                  <Led {...l3OrangeLed} color="red" lit={true} brightness={1.4} />
                  {renderWire(pinPosition(esp32Meta, 'D18', ESP), at(getHole('j', 24)), '#EF4444', 45, 'l5-led')}

                  {/* Buzzer Line on D19 */}
                  {renderWire(pinPosition(esp32Meta, 'D19', ESP), at(getHole('j', 15)), '#F59E0B', 50, 'l5-buzzer')}

                  <PartHover meta={oledMeta} {...l4Oled} />
                </g>
              )}

              {/* Hover layers for live feedback */}
              <PartHover meta={esp32Meta} x={ESP.x} y={ESP.y} />
              <BreadboardHover
                x={BB.x}
                y={BB.y}
                onHoleHover={(h) => setHoveredHoleInfo(h)}
              />
            </g>
          )}
        </svg>
      </CircuitPanZoom>

      {/* Blueprint Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#576875] pt-1 border-t border-[#EBE6DC]">
        <span className="flex items-center gap-1.5 font-medium">
          <Info className="w-4 h-4 text-[#2A9D8F] shrink-0" />
          <span>Interactive Circuit Blueprint: Drag to pan, scroll to zoom in on pins & holes, or hover over components for specs.</span>
        </span>
        <span className="font-mono text-[#899AA8] text-[11px] font-bold shrink-0">Wokwi Vector Standard</span>
      </div>
    </div>
  );
};
