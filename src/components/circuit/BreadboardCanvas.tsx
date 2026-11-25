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
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { CircuitPanZoom } from './CircuitPanZoom.js';
import { 
  Breadboard, 
  ESP32, 
  Led, 
  Resistor, 
  PushButton, 
  Oled,
  Dht22,
  PotModule,
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
  dht22Meta,
  potModuleMeta,
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
      }, 600);
      return () => clearInterval(interval);
    }
  }, [levelNumber]);

  // Viewport & placement geometry
  // ESP32: placed with clean margin so the USB port, Wi-Fi shield, and all 30 pins are 100% visible
  const ESP = { x: 12, y: 40 };
  const BB = { x: 135, y: 40 };
  const at = (h: { x: number; y: number }) => ({ x: BB.x + h.x, y: BB.y + h.y });

  // Calculate highlighted breadboard holes dynamically
  const getHighlightHoles = (): string[] => {
    const holes: string[] = [];
    if (levelNumber === 2) {
      holes.push('b-2', 'a15', 'c15', 'e15', 'c20', 'e20', 'd20', 'd19', 'e19', 'b-4');
      if (currentStepIndex >= 2) holes.push('a22', 'c22', 'e22', 'c26', 'e26', 'd26', 'd25', 'e25', 'b-6');
      if (currentStepIndex >= 3) holes.push('a32', 'e32', 'f32', 'j32', 'b-8');
    } else if (levelNumber === 3) {
      holes.push('f15', 'b+12', 'b-12', 'f25', 'b+25', 'b-25');
    } else if (levelNumber >= 4) {
      holes.push('b+2', 'b-2', 'b+10', 'b-10', 'f38', 'f39', 'f40', 'f41');
      if (levelNumber === 6) {
        holes.push('a15', 'd20', 'd19', 'a22', 'd26', 'd25', 'a30', 'e30');
      }
    }
    return holes;
  };

  // Render curved jumper wire with drop shadow and DuPont sleeves
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
  // Level 2: Red LED circuit (Cols 15-20) on GPIO 18
  const l2RedResistor = placeByPin(resistorMeta, '1', at(getHole('c', 15)));
  const l2RedLed = placeByPin(ledMeta, 'A', at(getHole('d', 20)));

  // Level 2: Green LED circuit (Cols 22-26) on GPIO 19
  const l2GreenResistor = placeByPin(resistorMeta, '1', at(getHole('c', 22)));
  const l2GreenLed = placeByPin(ledMeta, 'A', at(getHole('d', 26)));

  // Level 2: Push Button straddling trench at Col 32 (Row E to Row F) on GPIO 27
  const l2Btn = placeByPin(pushButtonMeta, '1.l', at(getHole('c', 32)));

  // Level 3: Analog sensors (Potentiometer on GPIO 35, DHT22 on GPIO 4)
  const l3Pot = placeByPin(potModuleMeta, 'SIG', at(getHole('f', 15)));
  const l3Dht = placeByPin(dht22Meta, 'SDA', at(getHole('f', 26)));

  // Level 4, 5, 6: OLED Display mounted over lower breadboard section (Cols 38-41)
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
              <ESP32 x={65} y={40} scale={1.05} ledPower={true} led1={false} />
              <PartHover meta={esp32Meta} x={65} y={40} scale={1.05} />

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
                <text x="203" y="138" fill="#21867A">3. Xtensa 32-bit Dual-Core (240MHz)</text>
              </g>
            </g>
          )}

          {/* === STAGE 1: ONBOARD LED (GPIO 2) === */}
          {levelNumber === 1 && (
            <g>
              <ESP32 x={ESP.x} y={ESP.y} scale={1} ledPower={true} led1={onboardBlink} />
              
              {/* Callout to GPIO 2 Onboard LED */}
              <g filter="url(#wireShadow)">
                <circle cx={ESP.x + 92} cy={ESP.y + 115} r="6" fill="#3B82F6" opacity={onboardBlink ? 0.9 : 0.2} filter={onboardBlink ? 'url(#espGlow)' : undefined} />
                <line x1={ESP.x + 92} y1={ESP.y + 115} x2={ESP.x + 150} y2={ESP.y + 115} stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" />
                <rect x={ESP.x + 150} y={ESP.y + 102} width="160" height="26" rx="6" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.2" />
                <text x={ESP.x + 158} y={ESP.y + 118} fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#1E293B">
                  Built-in LED: GPIO 2
                </text>
              </g>

              {/* Breadboard background ready for next stage */}
              <Breadboard x={BB.x + 50} y={BB.y} highlight={[]} />
            </g>
          )}

          {/* === STAGES 2 - 6: BREADBOARD CIRCUITS === */}
          {levelNumber >= 2 && (
            <g>
              {/* 1. ESP32 DevKit V1 placed with clear view */}
              <ESP32 x={ESP.x} y={ESP.y} scale={1} ledPower={true} led1={false} />
              
              {/* Micro-USB Cable plugged into top */}
              <g className="pointer-events-none" filter="url(#wireShadow)">
                <rect x={ESP.x + 41.5} y={ESP.y - 25} width="24" height="24" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="0.8" />
                <line x1={ESP.x + 53.5} y1={ESP.y - 25} x2={ESP.x + 53.5} y2={ESP.y - 40} stroke="#475569" strokeWidth="5" strokeLinecap="round" />
              </g>

              {/* 2. Full Breadboard */}
              <Breadboard
                x={BB.x}
                y={BB.y}
                highlight={getHighlightHoles()}
              />

              {/* === LEVEL 2: Red (GPIO 18) & Green (GPIO 19) LEDs & Push Button (GPIO 27) === */}
              {levelNumber === 2 && (
                <g>
                  {/* Step 1: Main Ground Wire (ESP32 GND.1 -> Bottom Blue Rail Hole 2) */}
                  {renderWire(
                    pinPosition(esp32Meta, 'GND.1', ESP),
                    at(getRailHole('bottom', '-', 2)),
                    '#1E293B',
                    30,
                    'l2-gnd-main'
                  )}

                  {/* Step 2: Red LED Circuit on GPIO 18 (Col 15-20) */}
                  {renderWire(
                    pinPosition(esp32Meta, 'D18', ESP),
                    at(getHole('a', 15)),
                    '#EF4444',
                    40,
                    'l2-sig-d18'
                  )}
                  <Resistor {...l2RedResistor} ohms={220} />
                  <Led {...l2RedLed} color="red" lit={interactivePressed} brightness={1.4} />
                  {renderWire(
                    at(getHole('e', 19)),
                    at(getRailHole('bottom', '-', 4)),
                    '#1E293B',
                    -15,
                    'l2-red-gnd'
                  )}

                  {/* Step 3: Green LED Circuit on GPIO 19 (Col 22-26) */}
                  {currentStepIndex >= 2 && (
                    <g>
                      {renderWire(
                        pinPosition(esp32Meta, 'D19', ESP),
                        at(getHole('a', 22)),
                        '#2A9D8F',
                        35,
                        'l2-sig-d19'
                      )}
                      <Resistor {...l2GreenResistor} ohms={220} />
                      <Led {...l2GreenLed} color="green" lit={!interactivePressed} brightness={1.3} />
                      {renderWire(
                        at(getHole('e', 25)),
                        at(getRailHole('bottom', '-', 6)),
                        '#1E293B',
                        -15,
                        'l2-green-gnd'
                      )}
                    </g>
                  )}

                  {/* Step 4: Push Button straddling trench at Col 32 (GPIO 27) */}
                  {currentStepIndex >= 3 && (
                    <g>
                      <g transform={`translate(${at(getHole('e', 32)).x - 33.6}, ${at(getHole('e', 32)).y + 5}) rotate(90, 33.6, 22.2)`}>
                        <PushButton
                          {...l2Btn}
                          color="green"
                          pressed={interactivePressed}
                          onMouseDown={() => setInteractivePressed(true)}
                          onMouseUp={() => setInteractivePressed(false)}
                          className="cursor-pointer"
                        />
                      </g>
                      {renderWire(
                        pinPosition(esp32Meta, 'D27', ESP),
                        at(getHole('a', 32)),
                        '#F4C95D',
                        55,
                        'l2-btn-sig'
                      )}
                      {renderWire(
                        at(getHole('j', 32)),
                        at(getRailHole('bottom', '-', 8)),
                        '#1E293B',
                        20,
                        'l2-btn-gnd'
                      )}
                      <PartHover meta={pushButtonMeta} x={at(getHole('e', 32)).x - 22} y={at(getHole('e', 32)).y + 5} />
                    </g>
                  )}
                </g>
              )}

              {/* === LEVEL 3: Analog Sensors Hardware Overview === */}
              {levelNumber === 3 && (
                <g>
                  {/* Power Rails Connection */}
                  {renderWire(pinPosition(esp32Meta, '3V3', ESP), at(getRailHole('bottom', '+', 2)), '#EF4444', 25, 'l3-3v3')}
                  {renderWire(pinPosition(esp32Meta, 'GND.1', ESP), at(getRailHole('bottom', '-', 2)), '#1E293B', 30, 'l3-gnd')}

                  {/* Potentiometer on GPIO 35 (Col 15) */}
                  <g>
                    <PotModule {...l3Pot} scale={0.9} value={0.65} />
                    {renderWire(at(getHole('f', 15)), pinPosition(esp32Meta, 'D35', ESP), '#2A9D8F', -35, 'l3-pot-sig')}
                    {renderWire(at(getRailHole('bottom', '+', 5)), at(getHole('j', 16)), '#EF4444', 20, 'l3-pot-vcc')}
                    {renderWire(at(getRailHole('bottom', '-', 5)), at(getHole('j', 14)), '#1E293B', 25, 'l3-pot-gnd')}
                  </g>

                  {/* DHT22 on GPIO 4 (Col 26) */}
                  <g>
                    <Dht22 {...l3Dht} scale={0.8} />
                    {renderWire(at(getHole('f', 26)), pinPosition(esp32Meta, 'D4', ESP), '#F28C75', 40, 'l3-dht-sig')}
                    {renderWire(at(getRailHole('bottom', '+', 10)), at(getHole('j', 25)), '#EF4444', 20, 'l3-dht-vcc')}
                    {renderWire(at(getRailHole('bottom', '-', 10)), at(getHole('j', 27)), '#1E293B', 25, 'l3-dht-gnd')}
                  </g>
                </g>
              )}

              {/* === LEVEL 4: Activity 4 SSD1306 OLED (Name, Age, Hobby) === */}
              {levelNumber === 4 && (
                <g>
                  {/* OLED Hardware with Personal Profile Layout */}
                  <Oled {...l4Oled} scale={1}>
                    <text x="4" y="16" fill="#FFFFFF" fontFamily="sans-serif" fontSize="13" fontWeight="bold">Name: Alex</text>
                    <text x="4" y="34" fill="#FFFFFF" fontFamily="sans-serif" fontSize="13" fontWeight="bold">Age: 12</text>
                    <text x="4" y="52" fill="#38BDF8" fontFamily="monospace" fontSize="9">Hobby: Robotics</text>
                  </Oled>

                  {/* ESP32 Main Power to Rails (Hole 2) */}
                  {renderWire(pinPosition(esp32Meta, '3V3', ESP), at(getRailHole('bottom', '+', 2)), '#EF4444', 25, 'l4-esp-3v3')}
                  {renderWire(pinPosition(esp32Meta, 'GND.1', ESP), at(getRailHole('bottom', '-', 2)), '#1E293B', 30, 'l4-esp-gnd')}

                  {/* Power Rails Wires to OLED from Col 10 (Matching User Reference Image 4) */}
                  {renderWire(at(getRailHole('bottom', '+', 10)), at(getHole('f', 39)), '#EF4444', 25, 'l4-vcc')}
                  {renderWire(at(getRailHole('bottom', '-', 10)), at(getHole('f', 38)), '#1E293B', 20, 'l4-gnd')}

                  {/* I2C Signal Wires (ESP32 D21 SDA, D22 SCL) */}
                  {currentStepIndex >= 2 && (
                    renderWire(pinPosition(esp32Meta, 'D21', ESP), at(getHole('f', 41)), '#3B82F6', 45, 'l4-sda')
                  )}
                  {currentStepIndex >= 3 && (
                    renderWire(pinPosition(esp32Meta, 'D22', ESP), at(getHole('f', 40)), '#EAB308', 40, 'l4-scl')
                  )}

                  <PartHover meta={oledMeta} {...l4Oled} />
                </g>
              )}

              {/* === LEVEL 5: ThingSpeak Cloud Stream on OLED === */}
              {levelNumber === 5 && (
                <g>
                  <Oled {...l4Oled} scale={1}>
                    <text x="64" y="14" fill="#38BDF8" fontFamily="sans-serif" fontSize="8" textAnchor="middle">ThingSpeak readings</text>
                    <text x="64" y="32" fill="#FFFFFF" fontFamily="monospace" fontSize="13" fontWeight="bold" textAnchor="middle">Temp: 30.8 C</text>
                    <text x="64" y="48" fill="#4ADE80" fontFamily="monospace" fontSize="13" fontWeight="bold" textAnchor="middle">Humi: 72.0%</text>
                    <text x="64" y="60" fill="#94A3B8" fontFamily="monospace" fontSize="6.5" textAnchor="middle">Channel: 3594258 | OK</text>
                  </Oled>

                  {/* Power & Rails Wires */}
                  {renderWire(pinPosition(esp32Meta, '3V3', ESP), at(getRailHole('bottom', '+', 2)), '#EF4444', 25, 'l5-esp-3v3')}
                  {renderWire(pinPosition(esp32Meta, 'GND.1', ESP), at(getRailHole('bottom', '-', 2)), '#1E293B', 30, 'l5-esp-gnd')}
                  {renderWire(at(getRailHole('bottom', '+', 10)), at(getHole('f', 39)), '#EF4444', 25, 'l5-vcc')}
                  {renderWire(at(getRailHole('bottom', '-', 10)), at(getHole('f', 38)), '#1E293B', 20, 'l5-gnd')}

                  {/* I2C Lines */}
                  {renderWire(pinPosition(esp32Meta, 'D21', ESP), at(getHole('f', 41)), '#3B82F6', 45, 'l5-sda')}
                  {renderWire(pinPosition(esp32Meta, 'D22', ESP), at(getHole('f', 40)), '#EAB308', 40, 'l5-scl')}

                  <PartHover meta={oledMeta} {...l4Oled} />
                </g>
              )}

              {/* === LEVEL 6: Activity 7 Autonomous Plant Guardian === */}
              {levelNumber === 6 && (
                <g>
                  {/* OLED Screen */}
                  <Oled {...l4Oled} scale={1}>
                    <text x="4" y="12" fill="#38BDF8" fontFamily="sans-serif" fontSize="7">Soil and light status</text>
                    <text x="4" y="28" fill="#FFFFFF" fontFamily="monospace" fontSize="12" fontWeight="bold">Soil: 65%</text>
                    <text x="4" y="44" fill="#94A3B8" fontFamily="monospace" fontSize="7">Raw: 2100  Light: YES</text>
                    <text x="4" y="58" fill="#4ADE80" fontFamily="monospace" fontSize="9" fontWeight="bold">Status: GOOD</text>
                  </Oled>

                  {/* Power Rails */}
                  {renderWire(pinPosition(esp32Meta, '3V3', ESP), at(getRailHole('bottom', '+', 2)), '#EF4444', 25, 'l6-esp-3v3')}
                  {renderWire(pinPosition(esp32Meta, 'GND.1', ESP), at(getRailHole('bottom', '-', 2)), '#1E293B', 30, 'l6-esp-gnd')}
                  {renderWire(at(getRailHole('bottom', '+', 10)), at(getHole('f', 39)), '#EF4444', 25, 'l6-vcc')}
                  {renderWire(at(getRailHole('bottom', '-', 10)), at(getHole('f', 38)), '#1E293B', 20, 'l6-gnd')}
                  {renderWire(pinPosition(esp32Meta, 'D21', ESP), at(getHole('f', 41)), '#3B82F6', 45, 'l6-sda')}
                  {renderWire(pinPosition(esp32Meta, 'D22', ESP), at(getHole('f', 40)), '#EAB308', 40, 'l6-scl')}

                  {/* Red Alert LED (GPIO 18, Col 15-20) */}
                  {renderWire(pinPosition(esp32Meta, 'D18', ESP), at(getHole('a', 15)), '#EF4444', 40, 'l6-red-sig')}
                  <Resistor {...l2RedResistor} ohms={220} />
                  <Led {...l2RedLed} color="red" lit={false} brightness={1.4} />
                  {renderWire(at(getHole('e', 19)), at(getRailHole('bottom', '-', 4)), '#1E293B', -15, 'l6-red-gnd')}

                  {/* Green Normal LED (GPIO 19, Col 22-26) */}
                  {renderWire(pinPosition(esp32Meta, 'D19', ESP), at(getHole('a', 22)), '#2A9D8F', 35, 'l6-green-sig')}
                  <Resistor {...l2GreenResistor} ohms={220} />
                  <Led {...l2GreenLed} color="green" lit={true} brightness={1.4} />
                  {renderWire(at(getHole('e', 25)), at(getRailHole('bottom', '-', 6)), '#1E293B', -15, 'l6-green-gnd')}

                  {/* Active Buzzer on GPIO 23 (Col 30) */}
                  <g filter="url(#wireShadow)">
                    <circle cx={at(getHole('c', 30)).x} cy={at(getHole('c', 30)).y} r="10" fill="#1E293B" stroke="#F4C95D" strokeWidth="1.5" />
                    <text x={at(getHole('c', 30)).x} y={at(getHole('c', 30)).y + 3} fill="#FFFFFF" fontSize="7" fontFamily="sans-serif" textAnchor="middle">BUZZ</text>
                  </g>
                  {renderWire(pinPosition(esp32Meta, 'D23', ESP), at(getHole('a', 30)), '#F4C95D', 25, 'l6-buzzer-sig')}
                  {renderWire(at(getHole('e', 30)), at(getRailHole('bottom', '-', 8)), '#1E293B', 20, 'l6-buzzer-gnd')}

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
          <Eye className="w-3.5 h-3.5 text-[#2A9D8F]" />
          <span>Interactive Blueprint: Hover over any breadboard hole or component pin for live electrical net telemetry.</span>
        </span>
        <span className="font-mono text-[11px] text-[#899AA8]">ESP32 DevKit V1 • 3.3V Logic</span>
      </div>
    </div>
  );
};
