import React, { useEffect, useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  ExternalLink, 
  Zap, 
  Cpu, 
  Terminal,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  Radio,
  Sliders,
  Volume2,
  VolumeX,
  Droplets,
  Sun,
  Moon,
  Gauge
} from 'lucide-react';
import { CircuitPanZoom } from '../circuit/CircuitPanZoom.js';
import { 
  ESP32, 
  esp32Meta, 
  Led, 
  ledMeta, 
  PushButton, 
  pushButtonMeta, 
  Oled, 
  oledMeta, 
  Resistor, 
  resistorMeta,
  PartHover 
} from '../../hardware/index.js';
import PotModule from '../../hardware/PotModule.jsx';
import Dht22 from '../../hardware/Dht22.jsx';

interface WokwiInteractiveBoardProps {
  levelNumber: number;
}

export const WokwiInteractiveBoard: React.FC<WokwiInteractiveBoardProps> = ({ levelNumber }) => {
  // Simulator interactive states
  const [ledState, setLedState] = useState({
    onboard: false, // GPIO 2
    red: false,     // GPIO 18
    green: true,    // GPIO 19
  });
  const [isButtonPressed, setIsButtonPressed] = useState(false); // GPIO 27
  const [isSimRunning, setIsSimRunning] = useState(false);
  
  // Level 3 Analog values
  const [potVal, setPotVal] = useState<number>(0.65);
  const potRaw = Math.round(potVal * 4095);
  const potScaled = Math.max(1, Math.min(100, Math.round(1 + (potVal * 99))));

  // Level 4 Custom OLED inputs
  const [studentName, setStudentName] = useState('Alex');
  const [studentAge, setStudentAge] = useState('12');
  const [studentHobby, setStudentHobby] = useState('Robotics');

  // Level 5 ThingSpeak view tab
  const [thingSpeakTab, setThingSpeakTab] = useState<'pot' | 'dht'>('dht');

  // Level 6 Autonomous Plant Guardian states
  const [simSoilPercent, setSimSoilPercent] = useState<number>(65);
  const [simLightDetected, setSimLightDetected] = useState<boolean>(true);
  const isSoilGood = simSoilPercent >= 30.0;
  const isGuardianGood = isSoilGood && simLightDetected;

  const [replLogs, setReplLogs] = useState<string[]>([
    '[ESP32 Boot] Chip: ESP32-D0WDQ6 (240MHz Dual-Core Xtensa LX6)',
    '[ESP32] Flash: 4MB | RAM: 520KB | WiFi: 802.11 b/g/n',
    '[Serial] Connected at 115200 baud.',
    '>>> Serial.println("ESP32 Sensor Project Codebook Ready");'
  ]);

  const addReplLog = (command: string, response?: string) => {
    setReplLogs((prev) => {
      const updated = [...prev, `>>> ${command}`];
      if (response) updated.push(response);
      return updated.slice(-8); // Keep last 8 lines
    });
  };

  // Auto-pulse loop if simulation running in Level 1 or Level 2
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimRunning && levelNumber === 1) {
      interval = setInterval(() => {
        setLedState((prev) => {
          const next = !prev.onboard;
          addReplLog(`digitalWrite(2, ${next ? 'HIGH' : 'LOW'});`, next ? 'GPIO 2: HIGH (+3.3V ON)' : 'GPIO 2: LOW (0V OFF)');
          return { ...prev, onboard: next };
        });
      }, 500);
    } else if (isSimRunning && levelNumber === 2) {
      interval = setInterval(() => {
        setLedState((prev) => {
          const nextRed = !prev.red;
          const nextGreen = prev.red;
          addReplLog(
            `digitalWrite(18, ${nextRed ? 'HIGH' : 'LOW'}); digitalWrite(19, ${nextGreen ? 'HIGH' : 'LOW'});`,
            `Red (GPIO 18): ${nextRed ? 'ON' : 'OFF'} | Green (GPIO 19): ${nextGreen ? 'ON' : 'OFF'}`
          );
          return { ...prev, red: nextRed, green: nextGreen };
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isSimRunning, levelNumber]);

  // Handle push button interaction in Level 2/3 (GPIO 27)
  const handleButtonDown = () => {
    setIsButtonPressed(true);
    setLedState((prev) => ({ ...prev, red: true, green: false }));
    addReplLog('digitalRead(27) == LOW', 'Button pressed (GPIO 27 connected to GND): Red (D18) ON, Green (D19) OFF');
  };

  const handleButtonUp = () => {
    setIsButtonPressed(false);
    setLedState((prev) => ({ ...prev, red: false, green: true }));
    addReplLog('digitalRead(27) == HIGH', 'Button released (INPUT_PULLUP pulled to 3.3V): Red (D18) OFF, Green (D19) ON');
  };

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      {/* Top Simulator Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBE6DC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F]" />
            <span className="text-xs font-bold text-[#2A9D8F] uppercase tracking-wider">
              Interactive Hardware Twin
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-[#24313A] mt-0.5">
            Stage {levelNumber} Live Simulation Testbench
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {(levelNumber === 1 || levelNumber === 2) && (
            <button
              onClick={() => setIsSimRunning(!isSimRunning)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                isSimRunning
                  ? 'bg-[#F4C95D] hover:bg-[#E5BC50] text-[#24313A]'
                  : 'bg-[#2A9D8F] hover:bg-[#21867A] text-white'
              }`}
            >
              {isSimRunning ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" /> Pause Blink
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> Run Blink Loop
                </>
              )}
            </button>
          )}

          <a
            href="https://wokwi.com/projects/new/esp32"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#2A9D8F] hover:bg-[#E6F4F2] text-[#576875] hover:text-[#2A9D8F] text-xs font-bold transition-all"
          >
            <span>Open Wokwi</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Interactive Hardware Stage with Pan & Zoom */}
      <CircuitPanZoom
        key={`wokwi-stage-${levelNumber}`}
        heightClass="min-h-[350px] h-[350px]"
        initialScale={1.0}
      >
        {/* Level 0: ESP32 DevKit V1 Architecture Inspector */}
        {levelNumber === 0 && (
          <div className="flex flex-col items-center text-center space-y-4 max-w-md z-10 animate-fade-in">
            <span className="text-[11px] font-mono font-bold text-[#899AA8] uppercase tracking-wider">
              Hover over pins for pinout and specifications
            </span>
            <div className="relative p-6 rounded-2xl bg-white border border-[#EBE6DC] shadow-sm flex justify-center">
              <svg viewBox="0 0 107 201" className="w-[140px] h-[230px]" style={{ overflow: 'visible' }}>
                <ESP32 x={0} y={0} scale={1} ledPower={true} led1={true} />
                <PartHover meta={esp32Meta} x={0} y={0} scale={1} />
              </svg>
            </div>
            <p className="text-xs text-[#576875] bg-white border border-[#EBE6DC] p-3 rounded-xl shadow-sm">
              ESP32 DevKit V1: 30 pins, Dual-Core Xtensa LX6 at 240MHz, 2.4GHz Wi-Fi + Bluetooth, 12-bit ADC.
            </p>
          </div>
        )}

        {/* Level 1: Onboard LED Blink Simulator (GPIO 2) */}
        {levelNumber === 1 && (
          <div className="flex flex-col items-center text-center space-y-5 z-10 animate-fade-in">
            <div className="flex items-center gap-8 bg-white border border-[#EBE6DC] p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col items-center gap-2">
                <div 
                  className={`p-3 rounded-2xl border-2 transition-all duration-300 ${
                    ledState.onboard
                      ? 'bg-[#E6F4F2] border-[#2A9D8F] shadow-lg shadow-[#2A9D8F]/20 scale-105'
                      : 'bg-[#F1F5F9] border-[#CBD5E1]'
                  }`}
                >
                  <svg viewBox="0 0 40 45" className="w-12 h-14" style={{ overflow: 'visible' }}>
                    <Led x={5} y={5} scale={1} color="blue" lit={ledState.onboard} brightness={1.4} />
                    <PartHover meta={ledMeta} x={5} y={5} scale={1} />
                  </svg>
                </div>
                <span className="text-xs font-bold text-[#24313A]">Onboard LED (GPIO 2)</span>
                <span className="text-[10px] font-mono text-[#899AA8]">digitalWrite(2, HIGH)</span>
              </div>

              <div className="h-16 w-px bg-[#EBE6DC]" />

              <div className="flex flex-col items-start text-left space-y-2.5">
                <div className="text-xs font-semibold text-[#576875]">
                  Voltage State:{' '}
                  <span className={ledState.onboard ? 'text-[#2A9D8F] font-bold' : 'text-[#899AA8] font-bold'}>
                    {ledState.onboard ? 'HIGH (3.3V ON)' : 'LOW (0V OFF)'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const next = !ledState.onboard;
                    setLedState((p) => ({ ...p, onboard: next }));
                    addReplLog(`digitalWrite(2, ${next ? 'HIGH' : 'LOW'});`, next ? 'GPIO 2: HIGH (+3.3V ON)' : 'GPIO 2: LOW (0V OFF)');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FFFDF7] hover:bg-[#E6F4F2] border border-[#EBE6DC] hover:border-[#2A9D8F] text-xs font-bold text-[#24313A] transition-all shadow-sm cursor-pointer"
                >
                  Click to Toggle LED
                </button>
              </div>
            </div>
            <p className="text-xs text-[#576875] max-w-md">
              Activity 1: No external wiring needed! Blinks the built-in LED wired directly to GPIO 2.
            </p>
          </div>
        )}

        {/* Level 2: External Red (GPIO 18), Green (GPIO 19) LEDs & Push Button (GPIO 27) */}
        {levelNumber === 2 && (
          <div className="flex flex-col items-center space-y-6 z-10 w-full animate-fade-in">
            <span className="text-[11px] font-mono font-bold text-[#899AA8] uppercase tracking-wider">
              Activities 2 & 3: Alternating LEDs & Push Button (GPIO 27 INPUT_PULLUP)
            </span>
            <div className="flex flex-col md:flex-row items-center gap-6 bg-white border border-[#EBE6DC] p-6 rounded-2xl w-full max-w-xl shadow-sm justify-around">
              
              {/* Push Button (GPIO 27) */}
              <div className="flex flex-col items-center gap-2">
                <div
                  onMouseDown={handleButtonDown}
                  onMouseUp={handleButtonUp}
                  onTouchStart={handleButtonDown}
                  onTouchEnd={handleButtonUp}
                  className="cursor-pointer"
                >
                  <svg viewBox="0 0 80 55" className="w-20 h-14" style={{ overflow: 'visible' }}>
                    <PushButton x={6} y={5} scale={1} color="green" pressed={isButtonPressed} />
                    <PartHover meta={pushButtonMeta} x={6} y={5} scale={1} />
                  </svg>
                </div>
                <span className="text-xs font-bold text-[#24313A]">Button (GPIO 27)</span>
                <span className="text-[10px] text-[#576875] font-mono">
                  {isButtonPressed ? 'Pressed: LOW (0V)' : 'Released: HIGH (3.3V)'}
                </span>
              </div>

              <div className="h-20 w-px bg-[#EBE6DC] hidden md:block" />

              {/* Red LED (GPIO 18) */}
              <div className="flex flex-col items-center gap-2">
                <svg viewBox="0 0 35 45" className="w-12 h-14" style={{ overflow: 'visible' }}>
                  <Led x={3} y={5} scale={1} color="red" lit={ledState.red} brightness={1.4} />
                  <PartHover meta={ledMeta} x={3} y={5} scale={1} />
                </svg>
                <span className="text-xs font-bold text-[#D95D43] font-mono">Red LED (GPIO 18)</span>
                <span className="text-[10px] font-mono text-[#576875]">
                  {ledState.red ? 'HIGH (3.3V ON)' : 'LOW (0V OFF)'}
                </span>
              </div>

              {/* Green LED (GPIO 19) */}
              <div className="flex flex-col items-center gap-2">
                <svg viewBox="0 0 35 45" className="w-12 h-14" style={{ overflow: 'visible' }}>
                  <Led x={3} y={5} scale={1} color="green" lit={ledState.green} brightness={1.4} />
                  <PartHover meta={ledMeta} x={3} y={5} scale={1} />
                </svg>
                <span className="text-xs font-bold text-[#2A9D8F] font-mono">Green LED (GPIO 19)</span>
                <span className="text-[10px] font-mono text-[#576875]">
                  {ledState.green ? 'HIGH (3.3V ON)' : 'LOW (0V OFF)'}
                </span>
              </div>

            </div>
            <p className="text-xs text-[#576875] text-center max-w-md">
              Hold the tactile button to see active-low logic: pressing pulls GPIO 27 to GND, switching Red ON and Green OFF!
            </p>
          </div>
        )}

        {/* Level 3: Analog Sensors Interactive Twin (Potentiometer GPIO 35 & Scaling) */}
        {levelNumber === 3 && (
          <div className="flex flex-col items-center space-y-5 z-10 w-full animate-fade-in">
            <span className="text-[11px] font-mono font-bold text-[#899AA8] uppercase tracking-wider">
              12-Bit ADC Live Converter (0..4095 ➔ 1..100)
            </span>
            <div className="flex flex-col md:flex-row items-center gap-6 bg-white border border-[#EBE6DC] p-6 rounded-2xl w-full max-w-lg shadow-sm">
              <div className="flex flex-col items-center gap-2">
                <PotModule x={0} y={0} scale={1.2} value={potVal} />
                <span className="text-xs font-mono font-bold text-[#576875]">Potentiometer (GPIO 35)</span>
              </div>

              <div className="flex-1 w-full space-y-3">
                <div className="flex justify-between text-xs font-bold text-[#24313A]">
                  <span>Turn Knob:</span>
                  <span className="font-mono text-[#2A9D8F]">{(potVal * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={potVal}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setPotVal(v);
                    const raw = Math.round(v * 4095);
                    const scaled = Math.max(1, Math.min(100, Math.round(1 + (v * 99))));
                    addReplLog(`analogRead(35) == ${raw}`, `Scaled to 1–100: ${scaled}`);
                  }}
                  className="w-full accent-[#2A9D8F] cursor-pointer h-2 bg-[#EBE6DC] rounded-lg"
                />

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#FFFDF7] border border-[#EBE6DC]">
                    <span className="text-[9px] font-mono text-[#899AA8] uppercase">Raw 12-Bit</span>
                    <p className="text-lg font-mono font-black text-[#24313A]">{potRaw}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#E6F4F2] border border-[#B2DFDB]">
                    <span className="text-[9px] font-mono text-[#21867A] uppercase">Scaled (map)</span>
                    <p className="text-lg font-mono font-black text-[#21867A]">{potScaled} / 100</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#576875] text-center max-w-md">
              The ESP32 reads continuous voltage on GPIO 35. <code className="text-[#21867A]">map(raw, 0, 4095, 1, 100)</code> converts it into a clean percentage.
            </p>
          </div>
        )}

        {/* Level 4: Activity 4 OLED Name, Age, Hobby Display */}
        {levelNumber === 4 && (
          <div className="flex flex-col items-center space-y-5 z-10 animate-fade-in w-full max-w-md">
            <span className="text-[11px] font-mono font-bold text-[#899AA8] uppercase tracking-wider">
              Activity 4: SSD1306 OLED (SDA 21, SCL 22, 0x3C)
            </span>
            <div className="flex flex-col items-center gap-4 bg-white border border-[#EBE6DC] p-6 rounded-2xl shadow-sm w-full">
              <svg viewBox="0 0 160 120" className="w-68 h-44" style={{ overflow: 'visible' }}>
                <Oled x={28} y={15} scale={1}>
                  <text x="4" y="16" fill="#FFFFFF" fontFamily="sans-serif" fontSize="13" fontWeight="bold">Name: {studentName}</text>
                  <text x="4" y="34" fill="#FFFFFF" fontFamily="sans-serif" fontSize="13" fontWeight="bold">Age: {studentAge}</text>
                  <text x="4" y="52" fill="#38BDF8" fontFamily="monospace" fontSize="9">Hobby: {studentHobby}</text>
                </Oled>
                <PartHover meta={oledMeta} x={28} y={15} scale={1} />
              </svg>

              {/* Editable Name / Age / Hobby fields */}
              <div className="grid grid-cols-3 gap-2 w-full pt-1">
                <div>
                  <span className="text-[10px] font-bold text-[#576875]">Name</span>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-[#EBE6DC] font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#576875]">Age</span>
                  <input
                    type="text"
                    value={studentAge}
                    onChange={(e) => setStudentAge(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-[#EBE6DC] font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#576875]">Hobby</span>
                  <input
                    type="text"
                    value={studentHobby}
                    onChange={(e) => setStudentHobby(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-[#EBE6DC] font-mono"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-[#576875] text-center">
              Type your profile details above to preview how Adafruit SSD1306 renders them in off-screen RAM before calling <code>display.display()</code>!
            </p>
          </div>
        )}

        {/* Level 5: ThingSpeak Activities 5 & 6 (Potentiometer & DHT22 from Cloud) */}
        {levelNumber === 5 && (
          <div className="flex flex-col items-center space-y-4 z-10 w-full animate-fade-in max-w-md">
            {/* Tab switch between Activity 5 (Pot) and Activity 6 (DHT22) */}
            <div className="flex items-center gap-2 p-1 bg-white border border-[#EBE6DC] rounded-xl shadow-xs">
              <button
                onClick={() => setThingSpeakTab('pot')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  thingSpeakTab === 'pot' ? 'bg-[#2A9D8F] text-white' : 'text-[#576875] hover:text-[#24313A]'
                }`}
              >
                Activity 5: Potentiometer (Field 5)
              </button>
              <button
                onClick={() => setThingSpeakTab('dht')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  thingSpeakTab === 'dht' ? 'bg-[#2A9D8F] text-white' : 'text-[#576875] hover:text-[#24313A]'
                }`}
              >
                Activity 6: DHT22 (Fields 1 & 2)
              </button>
            </div>

            <div className="bg-white border border-[#EBE6DC] rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm w-full">
              <svg viewBox="0 0 160 120" className="w-68 h-44" style={{ overflow: 'visible' }}>
                <Oled x={28} y={15} scale={1}>
                  {thingSpeakTab === 'pot' ? (
                    <>
                      <text x="64" y="14" fill="#38BDF8" fontFamily="sans-serif" fontSize="8" textAnchor="middle">Potentiometer</text>
                      <text x="64" y="42" fill="#FFFFFF" fontFamily="monospace" fontSize="22" fontWeight="bold" textAnchor="middle">65</text>
                      <text x="64" y="58" fill="#94A3B8" fontFamily="monospace" fontSize="6.5" textAnchor="middle">Field 5 / 100 • 20s Polling</text>
                    </>
                  ) : (
                    <>
                      <text x="64" y="12" fill="#38BDF8" fontFamily="sans-serif" fontSize="7" textAnchor="middle">DHT22 from ThingSpeak</text>
                      <text x="64" y="30" fill="#FFFFFF" fontFamily="monospace" fontSize="13" fontWeight="bold" textAnchor="middle">T: 30.8 C</text>
                      <text x="64" y="48" fill="#4ADE80" fontFamily="monospace" fontSize="13" fontWeight="bold" textAnchor="middle">H: 72.0%</text>
                      <text x="64" y="60" fill="#94A3B8" fontFamily="monospace" fontSize="6.5" textAnchor="middle">Channel: 3594258 | OK</text>
                    </>
                  )}
                </Oled>
                <PartHover meta={oledMeta} x={28} y={15} scale={1} />
              </svg>
              <span className="text-[10px] font-mono text-[#899AA8] mt-2">HTTP GET /channels/3594258/feeds/last.json ➔ 200 OK</span>
            </div>
            <p className="text-xs text-[#576875] text-center">
              Student ESP32 polls the instructor's cloud feeds every 20 seconds, deserializes the JSON with ArduinoJson, and renders the latest values.
            </p>
          </div>
        )}

        {/* Level 6: Activity 7 Autonomous Plant Guardian (Decisions, Alerts, Buzzer & LEDs) */}
        {levelNumber === 6 && (
          <div className="flex flex-col items-center space-y-4 z-10 w-full animate-fade-in max-w-xl">
            <span className="text-[11px] font-mono font-bold text-[#899AA8] uppercase tracking-wider">
              Activity 7: Smart Plant Guardian Decision Simulator
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              
              {/* Virtual OLED */}
              <div className="bg-white border border-[#EBE6DC] rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                <svg viewBox="0 0 150 115" className="w-full max-w-[200px]" style={{ overflow: 'visible' }}>
                  <Oled x={22} y={15} scale={1}>
                    <text x="4" y="12" fill="#38BDF8" fontFamily="sans-serif" fontSize="7">Soil and light status</text>
                    <text x="4" y="28" fill="#FFFFFF" fontFamily="monospace" fontSize="12" fontWeight="bold">Soil: {simSoilPercent}%</text>
                    <text x="4" y="44" fill="#94A3B8" fontFamily="monospace" fontSize="7">Raw: 2100  Light: {simLightDetected ? 'YES' : 'NO'}</text>
                    <text x="4" y="58" fill={isGuardianGood ? '#4ADE80' : '#F87171'} fontFamily="monospace" fontSize="9" fontWeight="bold">
                      Status: {isGuardianGood ? 'GOOD' : 'CHECK'}
                    </text>
                  </Oled>
                </svg>
                <span className="text-[10px] font-mono text-[#899AA8] mt-1">Status: {isGuardianGood ? 'GOOD' : 'ALERT!'}</span>
              </div>

              {/* Physical Actuators (Red 18, Green 19, Buzzer 23) */}
              <div className="bg-white border border-[#EBE6DC] rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-sm">
                <div className="flex items-center justify-around">
                  {/* Red Alert LED (GPIO 18) */}
                  <div className="flex flex-col items-center">
                    <svg viewBox="0 0 35 45" className="w-10 h-12" style={{ overflow: 'visible' }}>
                      <Led x={3} y={5} scale={0.9} color="red" lit={!isGuardianGood} brightness={1.4} />
                    </svg>
                    <span className="text-[10px] text-[#D95D43] font-bold mt-1">Red (D18)</span>
                    <span className="text-[9px] font-mono">{!isGuardianGood ? 'ON' : 'OFF'}</span>
                  </div>

                  {/* Green Normal LED (GPIO 19) */}
                  <div className="flex flex-col items-center">
                    <svg viewBox="0 0 35 45" className="w-10 h-12" style={{ overflow: 'visible' }}>
                      <Led x={3} y={5} scale={0.9} color="green" lit={isGuardianGood} brightness={1.4} />
                    </svg>
                    <span className="text-[10px] text-[#2A9D8F] font-bold mt-1">Green (D19)</span>
                    <span className="text-[9px] font-mono">{isGuardianGood ? 'ON' : 'OFF'}</span>
                  </div>

                  {/* Buzzer (GPIO 23) */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      !isGuardianGood ? 'bg-[#FDF1EE] text-[#D95D43] animate-pulse border border-[#F28C75]' : 'bg-[#FFFDF7] text-[#899AA8] border border-[#EBE6DC]'
                    }`}>
                      {!isGuardianGood ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] text-[#B88719] font-bold mt-1">Buzzer (D23)</span>
                    <span className="text-[9px] font-mono">{!isGuardianGood ? 'BEEP!' : 'Off'}</span>
                  </div>
                </div>

                {/* Simulation input toggles */}
                <div className="pt-2 border-t border-[#EBE6DC] flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      const next = simSoilPercent >= 30 ? 15 : 65;
                      setSimSoilPercent(next);
                      addReplLog(`sim_soil = ${next}%`, next < 30 ? 'HAZARD: Soil moisture below 30%' : 'Soil moisture restored');
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#FFFDF7] hover:bg-[#E6F4F2] border border-[#EBE6DC] text-[10px] font-bold text-[#24313A] cursor-pointer"
                  >
                    Toggle Soil ({simSoilPercent}%)
                  </button>
                  <button
                    onClick={() => {
                      const next = !simLightDetected;
                      setSimLightDetected(next);
                      addReplLog(`sim_light = ${next}`, next ? 'Light detected (LOW)' : 'Darkness (HIGH)');
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#FFFDF7] hover:bg-[#FEF9EC] border border-[#EBE6DC] text-[10px] font-bold text-[#24313A] cursor-pointer"
                  >
                    Toggle Light ({simLightDetected ? 'Light' : 'Dark'})
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </CircuitPanZoom>

      {/* Simulated Arduino Serial Monitor */}
      <div className="bg-[#F8F9FA] border border-[#EBE6DC] rounded-2xl p-4 font-mono shadow-inner space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-[#EBE6DC] text-xs text-[#576875]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#2A9D8F]" />
            <span className="font-bold text-[#24313A]">Arduino Serial Monitor (115200 Baud)</span>
          </div>
          <button
            onClick={() => setReplLogs(['[Serial] 115200 baud connected.', '>>> '])}
            className="text-[11px] text-[#899AA8] hover:text-[#24313A] transition-colors cursor-pointer"
          >
            Clear Monitor
          </button>
        </div>

        <div className="h-28 overflow-y-auto space-y-1 text-xs scrollbar-thin">
          {replLogs.map((log, i) => (
            <div 
              key={i} 
              className={log.startsWith('>>>') ? 'text-[#2A9D8F] font-semibold' : 'text-[#24313A]'}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
