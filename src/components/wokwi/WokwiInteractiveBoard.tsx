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
  Sparkles
} from 'lucide-react';
import '@wokwi/elements';

interface WokwiInteractiveBoardProps {
  levelNumber: number;
}

export const WokwiInteractiveBoard: React.FC<WokwiInteractiveBoardProps> = ({ levelNumber }) => {
  // Simulator interactive states
  const [ledState, setLedState] = useState({
    onboard: false,
    green: false,
    orange: false,
    red: false,
  });
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isSimRunning, setIsSimRunning] = useState(false);
  const [replLogs, setReplLogs] = useState<string[]>([
    'MicroPython v1.22.0 on Raspberry Pi Pico WH with RP2040',
    'Type "help()" for more information.',
    '>>> '
  ]);

  const addReplLog = (command: string, response?: string) => {
    setReplLogs((prev) => {
      const updated = [...prev, `>>> ${command}`];
      if (response) updated.push(response);
      return updated.slice(-8); // Keep last 8 lines
    });
  };

  // Auto-pulse loop if simulation running in Level 1
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimRunning && levelNumber === 1) {
      interval = setInterval(() => {
        setLedState((prev) => {
          const next = !prev.onboard;
          addReplLog(`led.value(${next ? 1 : 0})`, next ? 'LED turned ON (3.3V)' : 'LED turned OFF (0V)');
          return { ...prev, onboard: next };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimRunning, levelNumber]);

  // Handle push button interaction in Level 3
  const handleButtonDown = () => {
    setIsButtonPressed(true);
    setLedState((prev) => ({ ...prev, green: false, orange: true }));
    addReplLog('button.value() == 0', 'Switch closed to Ground: Green OFF, Orange ON');
  };

  const handleButtonUp = () => {
    setIsButtonPressed(false);
    setLedState((prev) => ({ ...prev, green: true, orange: false }));
    addReplLog('button.value() == 1', 'Button released: Pull-up active, Green ON');
  };

  const handleToggleLED = (color: 'green' | 'orange' | 'red') => {
    setLedState((prev) => {
      const next = !prev[color];
      addReplLog(`${color}_led.value(${next ? 1 : 0})`, `${color.toUpperCase()} LED set to ${next ? 'HIGH (3.3V)' : 'LOW (0V)'}`);
      return { ...prev, [color]: next };
    });
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
      {/* Top Simulator Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              Virtual Hardware Lab
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-white mt-0.5">
            Level {levelNumber} Interactive Simulation Twin
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimRunning(!isSimRunning)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md ${
              isSimRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-gray-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-gray-950 shadow-emerald-500/20'
            }`}
          >
            {isSimRunning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" /> Pause Auto-Loop
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Run Simulation
              </>
            )}
          </button>

          <a
            href="https://wokwi.com/projects/new/micropython-pi-pico"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-700 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-gray-300 hover:text-cyan-300 text-xs font-semibold transition-all"
          >
            <span>Open in Wokwi Web</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Interactive Hardware Stage */}
      <div className="relative min-h-[320px] bg-[#070B14] border border-gray-800/80 rounded-2xl p-6 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #06B6D4 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Level 0: Pico WH Architecture Inspector */}
        {levelNumber === 0 && (
          <div className="flex flex-col items-center text-center space-y-4 max-w-md z-10 animate-fade-in">
            <div className="relative p-6 rounded-2xl bg-[#0F172A] border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/10">
              <Cpu className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
              <div className="mt-3">
                <span className="text-xs font-black tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/30 font-mono">
                  RP2040 Dual-Core ARM @ 133MHz
                </span>
                <h4 className="text-lg font-extrabold text-white mt-2">Raspberry Pi Pico WH</h4>
                <p className="text-xs text-gray-400 mt-1">Pre-soldered headers • 2.4GHz Wi-Fi • 26 Multi-Function GPIOs</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 bg-gray-900/80 border border-gray-800 p-3 rounded-xl">
              Inspect your hardware kit and verify the pre-soldered pins are ready for breadboard insertion.
            </p>
          </div>
        )}

        {/* Level 1: Onboard LED Blink Simulator */}
        {levelNumber === 1 && (
          <div className="flex flex-col items-center text-center space-y-5 z-10 animate-fade-in">
            <div className="flex items-center gap-8 bg-gray-900/90 border border-gray-800 p-6 rounded-2xl shadow-xl">
              <div className="flex flex-col items-center gap-2">
                <div 
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                    ledState.onboard
                      ? 'bg-emerald-500 border-emerald-300 shadow-xl shadow-emerald-500/50 scale-110'
                      : 'bg-emerald-950/40 border-emerald-900/60 opacity-40'
                  }`}
                >
                  <Zap className={`w-7 h-7 ${ledState.onboard ? 'text-gray-950' : 'text-emerald-700'}`} />
                </div>
                <span className="text-xs font-bold text-gray-200">Pico Onboard LED</span>
                <span className="text-[10px] font-mono text-gray-400">Pin("LED", Pin.OUT)</span>
              </div>

              <div className="h-16 w-px bg-gray-800" />

              <div className="flex flex-col items-start text-left space-y-2.5">
                <div className="text-xs font-semibold text-gray-200">
                  Voltage State: <span className={ledState.onboard ? 'text-emerald-400 font-bold' : 'text-gray-500 font-bold'}>
                    {ledState.onboard ? 'HIGH (3.3V ON)' : 'LOW (0V OFF)'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const next = !ledState.onboard;
                    setLedState((p) => ({ ...p, onboard: next }));
                    addReplLog(`led.value(${next ? 1 : 0})`, next ? 'LED ON' : 'LED OFF');
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-emerald-600 text-xs font-bold text-white transition-all border border-gray-700 shadow-md"
                >
                  Toggle in REPL (Click)
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 max-w-md">
              Toggle the LED to see the corresponding MicroPython command and voltage response below.
            </p>
          </div>
        )}

        {/* Level 2: External Breadboard LEDs with 220Ω Resistors */}
        {levelNumber === 2 && (
          <div className="flex flex-col items-center space-y-6 z-10 w-full animate-fade-in">
            <div className="grid grid-cols-3 gap-6 bg-gray-900/90 border border-gray-800 p-6 rounded-2xl w-full max-w-lg shadow-xl">
              
              {/* Green LED (GP15) */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  ledState.green ? 'bg-emerald-400 shadow-xl shadow-emerald-400/60 scale-110' : 'bg-emerald-950/50 border border-emerald-900'
                }`}>
                  <Zap className={`w-6 h-6 ${ledState.green ? 'text-gray-950' : 'text-emerald-800'}`} />
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">Green LED (GP15)</span>
                <span className="text-[10px] text-gray-400">220Ω Resistor in Series</span>
                <button
                  onClick={() => handleToggleLED('green')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-xs font-bold text-emerald-300 hover:bg-emerald-900 transition-all shadow-sm"
                >
                  {ledState.green ? 'Cut 0V' : 'Supply 3.3V'}
                </button>
              </div>

              {/* Orange LED (GP16) */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  ledState.orange ? 'bg-amber-400 shadow-xl shadow-amber-400/60 scale-110' : 'bg-amber-950/50 border border-amber-900'
                }`}>
                  <Zap className={`w-6 h-6 ${ledState.orange ? 'text-gray-950' : 'text-amber-800'}`} />
                </div>
                <span className="text-xs font-bold text-amber-400 font-mono">Orange LED (GP16)</span>
                <span className="text-[10px] text-gray-400">220Ω Resistor in Series</span>
                <button
                  onClick={() => handleToggleLED('orange')}
                  className="px-3 py-1.5 rounded-lg bg-amber-950 border border-amber-500/40 text-xs font-bold text-amber-300 hover:bg-amber-900 transition-all shadow-sm"
                >
                  {ledState.orange ? 'Cut 0V' : 'Supply 3.3V'}
                </button>
              </div>

              {/* Red LED (GP17) */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  ledState.red ? 'bg-rose-500 shadow-xl shadow-rose-500/60 scale-110' : 'bg-rose-950/50 border border-rose-900'
                }`}>
                  <Zap className={`w-6 h-6 ${ledState.red ? 'text-gray-950' : 'text-rose-800'}`} />
                </div>
                <span className="text-xs font-bold text-rose-400 font-mono">Red LED (GP17)</span>
                <span className="text-[10px] text-gray-400">220Ω Resistor in Series</span>
                <button
                  onClick={() => handleToggleLED('red')}
                  className="px-3 py-1.5 rounded-lg bg-rose-950 border border-rose-500/40 text-xs font-bold text-rose-300 hover:bg-rose-900 transition-all shadow-sm"
                >
                  {ledState.red ? 'Cut 0V' : 'Supply 3.3V'}
                </button>
              </div>

            </div>
            <p className="text-xs text-gray-400 text-center">
              Each semiconductor LED connects through a series 220 ohm resistor to prevent over-current.
            </p>
          </div>
        )}

        {/* Level 3: Push Button with Internal Pull-Up Logic */}
        {levelNumber === 3 && (
          <div className="flex flex-col items-center space-y-6 z-10 animate-fade-in">
            <div className="flex items-center gap-10 bg-gray-900/90 border border-gray-800 p-6 rounded-2xl shadow-xl">
              
              {/* Pushbutton */}
              <div className="flex flex-col items-center gap-2">
                <div
                  onMouseDown={handleButtonDown}
                  onMouseUp={handleButtonUp}
                  onTouchStart={handleButtonDown}
                  onTouchEnd={handleButtonUp}
                  className={`w-14 h-14 rounded-2xl border-2 cursor-pointer flex items-center justify-center transition-all shadow-xl ${
                    isButtonPressed 
                      ? 'bg-amber-500 border-amber-300 scale-95 shadow-amber-500/40' 
                      : 'bg-gray-800 border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <span className="text-xs font-black text-white">{isButtonPressed ? 'GND' : 'CLICK'}</span>
                </div>
                <span className="text-xs font-bold text-gray-200">Push Button (GP14)</span>
                <span className="text-[10px] text-gray-400">Click & Hold</span>
              </div>

              {/* Logical Arrow */}
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {isButtonPressed ? 'button.value() == 0' : 'button.value() == 1'}
                </span>
                <span className="text-[10px] text-gray-500 mt-1 font-mono">
                  {isButtonPressed ? 'GND (Active Low)' : 'PULL_UP (3.3V)'}
                </span>
              </div>

              {/* Controlled LEDs */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full ${!isButtonPressed ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-emerald-950'}`} />
                  <span className="text-[10px] font-bold text-emerald-400">Normal (GP15)</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full ${isButtonPressed ? 'bg-amber-400 shadow-lg shadow-amber-400/50' : 'bg-amber-950'}`} />
                  <span className="text-[10px] font-bold text-amber-400">Alert (GP16)</span>
                </div>
              </div>

            </div>
            <p className="text-xs text-gray-400 text-center max-w-md">
              Press and hold the virtual button to simulate active-low logic pulling GP14 to Ground.
            </p>
          </div>
        )}

        {/* Level 4: I2C SSD1306 OLED Display */}
        {levelNumber === 4 && (
          <div className="flex flex-col items-center space-y-5 z-10 animate-fade-in">
            <div className="flex flex-col items-center gap-4 bg-gray-900/90 border border-gray-800 p-6 rounded-2xl shadow-xl">
              
              {/* Virtual OLED Screen */}
              <div className="w-68 h-36 bg-black border-4 border-gray-700 rounded-lg p-3.5 flex flex-col justify-between font-mono shadow-2xl shadow-cyan-500/10">
                <div className="flex items-center justify-between border-b border-cyan-900/60 pb-1 text-[10px] text-cyan-400">
                  <span>SSD1306 128x64</span>
                  <span>I2C0 @ 0x3C</span>
                </div>
                <div className="space-y-1 text-xs text-cyan-300 font-bold">
                  <p className="truncate">NAME: CyberKnights</p>
                  <p>MISSION: NXplorers IoT</p>
                  <p className="text-[10px] text-cyan-400/80">Pico WH: ONLINE</p>
                </div>
                <div className="text-[9px] text-cyan-500/70 text-right">
                  SDA: GP4 | SCL: GP5
                </div>
              </div>

              {/* Pin Connections Guide */}
              <div className="flex items-center gap-3 text-xs font-mono text-gray-300">
                <span className="px-2.5 py-1 rounded bg-gray-800 border border-gray-700">VCC ➔ 3V3</span>
                <span className="px-2.5 py-1 rounded bg-gray-800 border border-gray-700">GND ➔ Rail</span>
                <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">SDA ➔ GP4</span>
                <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">SCL ➔ GP5</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center max-w-md">
              The SSD1306 controller receives drawing commands over I2C at address 0x3C.
            </p>
          </div>
        )}

        {/* Level 5: ThingSpeak Cloud Telemetry & Alert Alarms */}
        {levelNumber === 5 && (
          <div className="flex flex-col items-center space-y-5 z-10 w-full animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
              
              {/* Virtual OLED Alert Display */}
              <div className="bg-black border-2 border-amber-500/50 rounded-xl p-4 font-mono shadow-xl flex flex-col justify-between h-36">
                <div className="flex items-center justify-between text-[10px] text-amber-400 border-b border-amber-900/60 pb-1">
                  <span>LIVE CLOUD FEED</span>
                  <span className="animate-pulse">● REC</span>
                </div>
                <div className="space-y-1 text-xs text-amber-300">
                  <p className="font-bold">TEMP: 26.8°C (Normal)</p>
                  <p>HUMID: 55.4%</p>
                  <p className="text-[11px] text-emerald-400">SOIL: 42.1% (OK)</p>
                </div>
                <div className="text-[9px] text-gray-500">
                  HTTP GET /api/feed ➔ 200 OK
                </div>
              </div>

              {/* Virtual Alarm Hardware (Red LED & Buzzer) */}
              <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full ${ledState.red ? 'bg-rose-500 shadow-lg shadow-rose-500/50' : 'bg-rose-950'}`} />
                    <span className="text-[10px] text-rose-400 font-bold mt-1">Alarm LED (GP17)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold mt-1">Buzzer (GP18)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const next = !ledState.red;
                    setLedState((p) => ({ ...p, red: next }));
                    addReplLog(next ? 'trigger_hazard_alarm()' : 'clear_alarm()', next ? 'HAZARD: Temperature exceeded 30C threshold' : 'Condition normal');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-950 border border-rose-500/40 text-xs font-bold text-rose-300 hover:bg-rose-900 transition-all shadow-sm"
                >
                  {ledState.red ? 'Silence Alarm' : 'Inject Hazard Alert'}
                </button>
              </div>

            </div>
            <p className="text-xs text-gray-400 text-center max-w-md">
              When broadcast telemetry exceeds safe thresholds, the Pico automatically triggers the buzzer and LED.
            </p>
          </div>
        )}

      </div>

      {/* Simulated Thonny MicroPython REPL Terminal */}
      <div className="bg-[#070B14] border border-gray-800 rounded-2xl p-4 font-mono shadow-inner space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-gray-800/80 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-gray-300">Thonny MicroPython Terminal (Simulated)</span>
          </div>
          <button
            onClick={() => setReplLogs(['MicroPython v1.22.0 on RP2040', '>>> '])}
            className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
          >
            Clear Terminal
          </button>
        </div>

        <div className="h-28 overflow-y-auto space-y-1 text-xs scrollbar-thin">
          {replLogs.map((log, i) => (
            <div 
              key={i} 
              className={log.startsWith('>>>') ? 'text-cyan-300 font-semibold' : 'text-gray-400'}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
