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
  Radio
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
            Level {levelNumber} Live Simulation Test
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimRunning(!isSimRunning)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isSimRunning
                ? 'bg-[#F4C95D] hover:bg-[#E5BC50] text-[#24313A]'
                : 'bg-[#2A9D8F] hover:bg-[#21867A] text-white'
            }`}
          >
            {isSimRunning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" /> Pause Auto-Pulse
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Run Test Pulse
              </>
            )}
          </button>

          <a
            href="https://wokwi.com/projects/new/micropython-pi-pico"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#2A9D8F] hover:bg-[#E6F4F2] text-[#576875] hover:text-[#2A9D8F] text-xs font-bold transition-all"
          >
            <span>Open in Wokwi Web</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Interactive Hardware Stage */}
      <div className="relative min-h-[320px] bg-[#F8F9FA] border border-[#EBE6DC] rounded-2xl p-6 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #CBD5E1 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Level 0: Pico WH Architecture Inspector */}
        {levelNumber === 0 && (
          <div className="flex flex-col items-center text-center space-y-4 max-w-md z-10 animate-fade-in">
            <div className="relative p-6 rounded-2xl bg-white border border-[#EBE6DC] shadow-sm">
              <Cpu className="w-16 h-16 text-[#2A9D8F] mx-auto" />
              <div className="mt-3">
                <span className="text-xs font-bold tracking-wider text-[#2A9D8F] uppercase bg-[#E6F4F2] px-2.5 py-1 rounded-md border border-[#B2DFDB] font-mono">
                  RP2040 Dual-Core ARM @ 133MHz
                </span>
                <h4 className="text-lg font-extrabold text-[#24313A] mt-2">Raspberry Pi Pico WH</h4>
                <p className="text-xs text-[#576875] mt-1">Pre-soldered headers • 2.4GHz Wi-Fi • 26 Multi-Function GPIOs</p>
              </div>
            </div>
            <p className="text-xs text-[#576875] bg-white border border-[#EBE6DC] p-3 rounded-xl shadow-sm">
              Inspect your hardware kit and verify the pre-soldered pins are ready for breadboard insertion.
            </p>
          </div>
        )}

        {/* Level 1: Onboard LED Blink Simulator */}
        {levelNumber === 1 && (
          <div className="flex flex-col items-center text-center space-y-5 z-10 animate-fade-in">
            <div className="flex items-center gap-8 bg-white border border-[#EBE6DC] p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col items-center gap-2">
                <div 
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                    ledState.onboard
                      ? 'bg-[#2A9D8F] border-[#21867A] shadow-lg shadow-[#2A9D8F]/30 scale-105'
                      : 'bg-[#F1F5F9] border-[#CBD5E1]'
                  }`}
                >
                  <Zap className={`w-7 h-7 ${ledState.onboard ? 'text-white' : 'text-[#94A3B8]'}`} />
                </div>
                <span className="text-xs font-bold text-[#24313A]">Pico Onboard LED</span>
                <span className="text-[10px] font-mono text-[#899AA8]">Pin("LED", Pin.OUT)</span>
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
                    addReplLog(`led.value(${next ? 1 : 0})`, next ? 'LED ON' : 'LED OFF');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FFFDF7] hover:bg-[#E6F4F2] border border-[#EBE6DC] hover:border-[#2A9D8F] text-xs font-bold text-[#24313A] transition-all shadow-sm"
                >
                  Click to Toggle LED
                </button>
              </div>
            </div>
            <p className="text-xs text-[#576875] max-w-md">
              Toggle the LED to see the corresponding MicroPython command and voltage state change in real time.
            </p>
          </div>
        )}

        {/* Level 2: External Breadboard LEDs with 220Ω Resistors */}
        {levelNumber === 2 && (
          <div className="flex flex-col items-center space-y-6 z-10 w-full animate-fade-in">
            <div className="grid grid-cols-3 gap-6 bg-white border border-[#EBE6DC] p-6 rounded-2xl w-full max-w-lg shadow-sm">
              
              {/* Green LED (GP15) */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  ledState.green ? 'bg-[#2A9D8F] shadow-md shadow-[#2A9D8F]/30 ring-4 ring-[#E6F4F2] scale-105' : 'bg-[#F1F5F9] border border-[#CBD5E1]'
                }`}>
                  <Zap className={`w-6 h-6 ${ledState.green ? 'text-white' : 'text-[#94A3B8]'}`} />
                </div>
                <span className="text-xs font-bold text-[#2A9D8F] font-mono">Green (GP15)</span>
                <span className="text-[10px] text-[#576875]">220Ω in series</span>
                <button
                  onClick={() => handleToggleLED('green')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                    ledState.green 
                      ? 'bg-[#E6F4F2] border border-[#B2DFDB] text-[#2A9D8F]'
                      : 'bg-white border border-[#EBE6DC] text-[#576875] hover:text-[#24313A]'
                  }`}
                >
                  {ledState.green ? 'Turn Off (0V)' : 'Turn On (3.3V)'}
                </button>
              </div>

              {/* Orange LED (GP16) */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  ledState.orange ? 'bg-[#F4C95D] shadow-md shadow-[#F4C95D]/40 ring-4 ring-[#FEF9EC] scale-105' : 'bg-[#F1F5F9] border border-[#CBD5E1]'
                }`}>
                  <Zap className={`w-6 h-6 ${ledState.orange ? 'text-[#24313A]' : 'text-[#94A3B8]'}`} />
                </div>
                <span className="text-xs font-bold text-[#B88719] font-mono">Orange (GP16)</span>
                <span className="text-[10px] text-[#576875]">220Ω in series</span>
                <button
                  onClick={() => handleToggleLED('orange')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                    ledState.orange 
                      ? 'bg-[#FEF9EC] border border-[#F4C95D] text-[#B88719]'
                      : 'bg-white border border-[#EBE6DC] text-[#576875] hover:text-[#24313A]'
                  }`}
                >
                  {ledState.orange ? 'Turn Off (0V)' : 'Turn On (3.3V)'}
                </button>
              </div>

              {/* Red LED (GP17) */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  ledState.red ? 'bg-[#F28C75] shadow-md shadow-[#F28C75]/40 ring-4 ring-[#FDF1EE] scale-105' : 'bg-[#F1F5F9] border border-[#CBD5E1]'
                }`}>
                  <Zap className={`w-6 h-6 ${ledState.red ? 'text-white' : 'text-[#94A3B8]'}`} />
                </div>
                <span className="text-xs font-bold text-[#D95D43] font-mono">Red (GP17)</span>
                <span className="text-[10px] text-[#576875]">220Ω in series</span>
                <button
                  onClick={() => handleToggleLED('red')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                    ledState.red 
                      ? 'bg-[#FDF1EE] border border-[#F28C75] text-[#D95D43]'
                      : 'bg-white border border-[#EBE6DC] text-[#576875] hover:text-[#24313A]'
                  }`}
                >
                  {ledState.red ? 'Turn Off (0V)' : 'Turn On (3.3V)'}
                </button>
              </div>

            </div>
            <p className="text-xs text-[#576875] text-center">
              Each semiconductor LED connects through a 220Ω current-limiting resistor to protect the circuit.
            </p>
          </div>
        )}

        {/* Level 3: Push Button with Internal Pull-Up Logic */}
        {levelNumber === 3 && (
          <div className="flex flex-col items-center space-y-6 z-10 animate-fade-in">
            <div className="flex items-center gap-10 bg-white border border-[#EBE6DC] p-6 rounded-2xl shadow-sm">
              
              {/* Pushbutton */}
              <div className="flex flex-col items-center gap-2">
                <div
                  onMouseDown={handleButtonDown}
                  onMouseUp={handleButtonUp}
                  onTouchStart={handleButtonDown}
                  onTouchEnd={handleButtonUp}
                  className={`w-14 h-14 rounded-2xl border-2 cursor-pointer flex items-center justify-center transition-all shadow-sm ${
                    isButtonPressed 
                      ? 'bg-[#F4C95D] border-[#E5BC50] scale-95 shadow-inner' 
                      : 'bg-[#FFFDF7] border-[#EBE6DC] hover:border-[#2A9D8F]'
                  }`}
                >
                  <span className="text-xs font-black text-[#24313A]">{isButtonPressed ? 'GND' : 'PRESS'}</span>
                </div>
                <span className="text-xs font-bold text-[#24313A]">Tactile Switch (GP14)</span>
                <span className="text-[10px] text-[#576875]">Press & Hold</span>
              </div>

              {/* Logical Arrow */}
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-mono font-bold text-[#2A9D8F]">
                  {isButtonPressed ? 'button.value() == 0' : 'button.value() == 1'}
                </span>
                <span className="text-[10px] text-[#576875] mt-1 font-mono">
                  {isButtonPressed ? 'GND (Active Low)' : 'PULL_UP (3.3V)'}
                </span>
              </div>

              {/* Controlled LEDs */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full ${!isButtonPressed ? 'bg-[#2A9D8F] shadow-md shadow-[#2A9D8F]/30 ring-2 ring-[#E6F4F2]' : 'bg-[#E2E8F0]'}`} />
                  <span className="text-[10px] font-bold text-[#2A9D8F]">Normal (GP15)</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full ${isButtonPressed ? 'bg-[#F4C95D] shadow-md shadow-[#F4C95D]/30 ring-2 ring-[#FEF9EC]' : 'bg-[#E2E8F0]'}`} />
                  <span className="text-[10px] font-bold text-[#B88719]">Alert (GP16)</span>
                </div>
              </div>

            </div>
            <p className="text-xs text-[#576875] text-center max-w-md">
              Press and hold the virtual button to simulate active-low logic pulling GP14 to Ground.
            </p>
          </div>
        )}

        {/* Level 4: I2C SSD1306 OLED Display */}
        {levelNumber === 4 && (
          <div className="flex flex-col items-center space-y-5 z-10 animate-fade-in">
            <div className="flex flex-col items-center gap-4 bg-white border border-[#EBE6DC] p-6 rounded-2xl shadow-sm">
              
              {/* Virtual OLED Screen */}
              <div className="w-68 h-36 bg-[#0E1520] border-4 border-[#334155] rounded-lg p-3.5 flex flex-col justify-between font-mono shadow-md">
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-1 text-[10px] text-[#38BDF8]">
                  <span>SSD1306 128x64</span>
                  <span>I2C0 @ 0x3C</span>
                </div>
                <div className="space-y-1 text-xs text-[#E0F2FE] font-bold">
                  <p className="truncate">NAME: CyberKnights</p>
                  <p>MISSION: NXplorers IoT</p>
                  <p className="text-[10px] text-[#38BDF8]">Pico WH: ONLINE</p>
                </div>
                <div className="text-[9px] text-[#94A3B8] text-right">
                  SDA: GP4 | SCL: GP5
                </div>
              </div>

              {/* Pin Connections Guide */}
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#24313A]">
                <span className="px-2.5 py-1 rounded-md bg-[#FFFDF7] border border-[#EBE6DC]">VCC ➔ 3V3</span>
                <span className="px-2.5 py-1 rounded-md bg-[#FFFDF7] border border-[#EBE6DC]">GND ➔ Rail</span>
                <span className="px-2.5 py-1 rounded-md bg-[#E6F4F2] border border-[#B2DFDB] text-[#2A9D8F] font-bold">SDA ➔ GP4</span>
                <span className="px-2.5 py-1 rounded-md bg-[#E6F4F2] border border-[#B2DFDB] text-[#2A9D8F] font-bold">SCL ➔ GP5</span>
              </div>
            </div>
            <p className="text-xs text-[#576875] text-center max-w-md">
              The SSD1306 controller receives drawing commands over I2C at address 0x3C.
            </p>
          </div>
        )}

        {/* Level 5: ThingSpeak Cloud Telemetry & Alert Alarms */}
        {levelNumber === 5 && (
          <div className="flex flex-col items-center space-y-5 z-10 w-full animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
              
              {/* Virtual OLED Alert Display */}
              <div className="bg-[#0E1520] border-2 border-[#F4C95D] rounded-xl p-4 font-mono shadow-md flex flex-col justify-between h-36">
                <div className="flex items-center justify-between text-[10px] text-[#F4C95D] border-b border-[#1E293B] pb-1">
                  <span>LIVE CLOUD FEED</span>
                  <span className="animate-pulse">● REC</span>
                </div>
                <div className="space-y-1 text-xs text-[#FEF9EC]">
                  <p className="font-bold">TEMP: 26.8°C (Normal)</p>
                  <p>HUMID: 55.4%</p>
                  <p className="text-[11px] text-[#2A9D8F]">SOIL: 42.1% (OK)</p>
                </div>
                <div className="text-[9px] text-[#94A3B8]">
                  HTTP GET /api/feed ➔ 200 OK
                </div>
              </div>

              {/* Virtual Alarm Hardware (Red LED & Buzzer) */}
              <div className="bg-white border border-[#EBE6DC] rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full ${ledState.red ? 'bg-[#F28C75] shadow-md shadow-[#F28C75]/40 ring-2 ring-[#FDF1EE]' : 'bg-[#E2E8F0]'}`} />
                    <span className="text-[10px] text-[#D95D43] font-bold mt-1">Alarm LED (GP17)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#FFFDF7] border border-[#EBE6DC] flex items-center justify-center">
                      <Zap className="w-4 h-4 text-[#F4C95D]" />
                    </div>
                    <span className="text-[10px] text-[#B88719] font-bold mt-1">Buzzer (GP18)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const next = !ledState.red;
                    setLedState((p) => ({ ...p, red: next }));
                    addReplLog(next ? 'trigger_hazard_alarm()' : 'clear_alarm()', next ? 'HAZARD: Temperature exceeded 30C threshold' : 'Condition normal');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                    ledState.red 
                      ? 'bg-[#FDF1EE] border border-[#F28C75] text-[#D95D43]'
                      : 'bg-white border border-[#EBE6DC] hover:border-[#F28C75] text-[#576875] hover:text-[#D95D43]'
                  }`}
                >
                  {ledState.red ? 'Silence Alarm' : 'Inject Hazard Alert'}
                </button>
              </div>

            </div>
            <p className="text-xs text-[#576875] text-center max-w-md">
              When broadcast telemetry exceeds safe thresholds, the Pico automatically triggers the buzzer and LED.
            </p>
          </div>
        )}

      </div>

      {/* Simulated Thonny MicroPython REPL Terminal */}
      <div className="bg-[#F8F9FA] border border-[#EBE6DC] rounded-2xl p-4 font-mono shadow-inner space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-[#EBE6DC] text-xs text-[#576875]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#2A9D8F]" />
            <span className="font-bold text-[#24313A]">Thonny Shell / REPL Output</span>
          </div>
          <button
            onClick={() => setReplLogs(['MicroPython v1.22.0 on RP2040', '>>> '])}
            className="text-[11px] text-[#899AA8] hover:text-[#24313A] transition-colors"
          >
            Clear Terminal
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
