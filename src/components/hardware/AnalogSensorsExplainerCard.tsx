import React, { useState } from 'react';
import { 
  Sliders, 
  Sun, 
  Moon, 
  Droplets, 
  Thermometer, 
  Gauge, 
  Sparkles, 
  Activity, 
  Cpu, 
  CheckCircle2,
  Info
} from 'lucide-react';
import PotModule, { potModuleMeta } from '../../hardware/PotModule.jsx';
import Dht22, { dht22Meta } from '../../hardware/Dht22.jsx';
import { PartHover } from '../../hardware/Hover.jsx';

export const AnalogSensorsExplainerCard: React.FC = () => {
  // Active sensor tab: 'pot' | 'soil' | 'ldr' | 'dht'
  const [activeSensor, setActiveSensor] = useState<'pot' | 'soil' | 'ldr' | 'dht'>('pot');

  // Potentiometer simulator (0..1)
  const [potVal, setPotVal] = useState<number>(0.65);
  const potRaw = Math.round(potVal * 4095);
  const potScaled = Math.max(1, Math.min(100, Math.round(1 + (potVal * 99))));

  // Soil Moisture simulator (Raw 1300 = soaked to 3000 = dry)
  const [soilRaw, setSoilRaw] = useState<number>(2100);
  const SOIL_DRY_RAW = 3000;
  const SOIL_WET_RAW = 1300;
  const soilPercent = Math.max(0, Math.min(100, Math.round(((SOIL_DRY_RAW - soilRaw) * 100) / (SOIL_DRY_RAW - SOIL_WET_RAW))));

  // LDR Digital simulator (LOW = light detected, HIGH = dark)
  const [isLightDetected, setIsLightDetected] = useState<boolean>(true);

  // DHT22 simulator
  const [simTemp, setSimTemp] = useState<number>(27.5);
  const [simHumi, setSimHumi] = useState<number>(65.0);

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EBE6DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A] text-xs font-bold font-mono uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Analog World ➔ Digital Microcontroller</span>
          </div>
          <h3 className="text-xl font-black text-[#24313A] tracking-tight">
            Analog Input & 12-Bit ADC Laboratory
          </h3>
          <p className="text-xs text-[#576875] mt-1">
            Computers only understand 0s and 1s, but nature is analog! The ESP32's 12-bit ADC converts continuous voltage (0–3.3V) into digital numbers (0–4095).
          </p>
        </div>

        {/* 12-Bit Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] text-xs font-mono font-bold text-[#24313A] shrink-0 self-start md:self-center">
          <Cpu className="w-4 h-4 text-[#2A9D8F]" />
          <span>Resolution: 2¹² = 4,096 Levels</span>
        </div>
      </div>

      {/* Sensor Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setActiveSensor('pot')}
          className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activeSensor === 'pot'
              ? 'bg-[#2A9D8F] text-white border-[#2A9D8F] shadow-sm'
              : 'bg-[#FFFDF7] text-[#24313A] border-[#EBE6DC] hover:border-[#2A9D8F]'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>1. Potentiometer (GPIO 35)</span>
        </button>

        <button
          onClick={() => setActiveSensor('soil')}
          className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activeSensor === 'soil'
              ? 'bg-[#2A9D8F] text-white border-[#2A9D8F] shadow-sm'
              : 'bg-[#FFFDF7] text-[#24313A] border-[#EBE6DC] hover:border-[#2A9D8F]'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>2. Soil Moisture (GPIO 34)</span>
        </button>

        <button
          onClick={() => setActiveSensor('ldr')}
          className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activeSensor === 'ldr'
              ? 'bg-[#2A9D8F] text-white border-[#2A9D8F] shadow-sm'
              : 'bg-[#FFFDF7] text-[#24313A] border-[#EBE6DC] hover:border-[#2A9D8F]'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>3. Digital LDR (GPIO 26)</span>
        </button>

        <button
          onClick={() => setActiveSensor('dht')}
          className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activeSensor === 'dht'
              ? 'bg-[#2A9D8F] text-white border-[#2A9D8F] shadow-sm'
              : 'bg-[#FFFDF7] text-[#24313A] border-[#EBE6DC] hover:border-[#2A9D8F]'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>4. DHT22 Sensor (GPIO 4)</span>
        </button>
      </div>

      {/* Active Sensor Interactive Workbench */}
      <div className="bg-[#FFFDF7] border border-[#EBE6DC] rounded-2xl p-6 lg:p-7 shadow-xs">
        
        {/* 1. POTENTIOMETER & SCALING */}
        {activeSensor === 'pot' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Dial visual */}
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-white border border-[#EBE6DC] rounded-2xl shadow-xs">
                  <PotModule x={0} y={0} scale={1.3} value={potVal} />
                </div>
                <span className="text-xs font-mono font-bold text-[#576875]">GPIO 35 Center Pin</span>
              </div>

              {/* Slider & Value Mapping */}
              <div className="flex-1 w-full space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#24313A] mb-2">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-[#2A9D8F]" />
                      <span>Rotate Potentiometer Knob</span>
                    </span>
                    <span className="font-mono text-[#2A9D8F]">{(potVal * 100).toFixed(0)}% Turn</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={potVal}
                    onChange={(e) => setPotVal(parseFloat(e.target.value))}
                    className="w-full accent-[#2A9D8F] cursor-pointer h-2 bg-[#EBE6DC] rounded-lg"
                  />
                </div>

                {/* Math & Mapping Pill Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-[#EBE6DC]">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#899AA8]">Raw ADC (analogRead)</span>
                    <p className="text-xl font-mono font-black text-[#24313A] mt-0.5">{potRaw}</p>
                    <span className="text-[10px] text-[#576875]">0 (0V) to 4095 (3.3V)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#E6F4F2] border border-[#B2DFDB]">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#21867A]">Scaled Range (map() in C)</span>
                    <p className="text-xl font-mono font-black text-[#21867A] mt-0.5">{potScaled} <span className="text-xs font-bold">/ 100</span></p>
                    <span className="text-[10px] text-[#21867A]">map(raw, 0, 4095, 1, 100)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#EBE6DC] text-xs font-mono text-[#576875]">
                  <strong className="text-[#24313A]">C Code:</strong> <code className="text-[#21867A]">int potScaled = map(analogRead(35), 0, 4095, 1, 100);</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SOIL MOISTURE */}
        {activeSensor === 'soil' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Soil Probe Graphic & Plant Status */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-32 h-36 rounded-2xl border flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                  soilPercent < 30 
                    ? 'bg-[#FDF1EE] border-[#F28C75] text-[#D95D43]' 
                    : 'bg-[#E6F4F2] border-[#B2DFDB] text-[#21867A]'
                }`}>
                  <Droplets className="w-10 h-10 mb-1" />
                  <span className="text-2xl font-black font-mono">{soilPercent}%</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider mt-1">
                    {soilPercent < 30 ? '🌵 Dry (Thirsty!)' : '🌱 Moist & Happy'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#576875]">GPIO 34 Analog Pin</span>
              </div>

              {/* Moisture Slider & Calibration Explanation */}
              <div className="flex-1 w-full space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#24313A] mb-2">
                    <span>Simulate Soil Wetness</span>
                    <span className="font-mono text-[#2A9D8F]">Raw ADC: {soilRaw}</span>
                  </div>
                  <input
                    type="range"
                    min={SOIL_WET_RAW}
                    max={SOIL_DRY_RAW}
                    step="10"
                    value={soilRaw}
                    onChange={(e) => setSoilRaw(parseInt(e.target.value))}
                    className="w-full accent-[#2A9D8F] cursor-pointer h-2 bg-[#EBE6DC] rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#899AA8] mt-1">
                    <span>1300 (Soaked Water)</span>
                    <span>3000 (Bone Dry Air)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#EBE6DC] space-y-2">
                  <h4 className="text-xs font-bold text-[#24313A] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F28C75]" />
                    <span>Inverted Calibration Formula</span>
                  </h4>
                  <p className="text-xs text-[#576875] leading-relaxed">
                    Notice that higher raw numbers mean <strong>drier soil</strong> because electrical resistance is higher without water! We invert it in C:
                  </p>
                  <pre className="p-2.5 rounded-lg bg-[#FFFDF7] border border-[#EBE6DC] text-[11px] font-mono text-[#21867A] overflow-x-auto">
                    float soilPercent = (float)(SOIL_DRY_RAW - soilRaw) * 100.0 / (SOIL_DRY_RAW - SOIL_WET_RAW);
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. DIGITAL LDR */}
        {activeSensor === 'ldr' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* LDR Icon & Threshold */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-32 h-36 rounded-2xl border flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                  isLightDetected
                    ? 'bg-[#FEF9EC] border-[#F4C95D] text-[#B88719]'
                    : 'bg-[#24313A] border-[#1E293B] text-white'
                }`}>
                  {isLightDetected ? <Sun className="w-10 h-10 mb-1 text-[#F4C95D]" /> : <Moon className="w-10 h-10 mb-1 text-[#899AA8]" />}
                  <span className="text-base font-black uppercase mt-1">
                    {isLightDetected ? 'Light' : 'Dark'}
                  </span>
                  <span className="text-[11px] font-mono mt-1">
                    {isLightDetected ? 'LOW (0)' : 'HIGH (1)'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#576875]">GPIO 26 Digital Pin</span>
              </div>

              {/* LDR Controls */}
              <div className="flex-1 w-full space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-[#24313A] mb-1">
                    Light-Dependent Resistor (LDR) Comparator Module
                  </h4>
                  <p className="text-xs text-[#576875] leading-relaxed">
                    This module has an onboard LM393 chip with a tiny blue sensitivity pot. When light hits the photocell above the threshold, its output drops to <strong>LOW (0V)</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsLightDetected(true)}
                    className={`flex-1 py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isLightDetected
                        ? 'bg-[#F4C95D] text-[#24313A] border-[#E0B448] shadow-sm'
                        : 'bg-white text-[#576875] border-[#EBE6DC] hover:bg-[#FFFDF7]'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>Sunlight / Torch (LOW)</span>
                  </button>

                  <button
                    onClick={() => setIsLightDetected(false)}
                    className={`flex-1 py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      !isLightDetected
                        ? 'bg-[#24313A] text-white border-[#1E293B] shadow-sm'
                        : 'bg-white text-[#576875] border-[#EBE6DC] hover:bg-[#FFFDF7]'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Night / Shadow (HIGH)</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#EBE6DC] text-xs font-mono text-[#576875]">
                  <strong className="text-[#24313A]">C Condition:</strong> <code className="text-[#21867A]">bool lightDetected = (digitalRead(26) == LOW);</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. DHT22 SENSOR */}
        {activeSensor === 'dht' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* DHT22 Graphic */}
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-white border border-[#EBE6DC] rounded-2xl shadow-xs">
                  <Dht22 x={0} y={0} scale={1.2} />
                </div>
                <span className="text-xs font-mono font-bold text-[#576875]">GPIO 4 (DHT22 Data)</span>
              </div>

              {/* Sliders for Temp & Humidity */}
              <div className="flex-1 w-full space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#24313A] mb-1">
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-[#F28C75]" />
                        <span>Temperature (°C)</span>
                      </span>
                      <span className="font-mono text-[#F28C75]">{simTemp.toFixed(1)} °C</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="45"
                      step="0.5"
                      value={simTemp}
                      onChange={(e) => setSimTemp(parseFloat(e.target.value))}
                      className="w-full accent-[#F28C75] cursor-pointer h-2 bg-[#EBE6DC] rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#24313A] mb-1">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-[#2A9D8F]" />
                        <span>Relative Humidity (%)</span>
                      </span>
                      <span className="font-mono text-[#2A9D8F]">{simHumi.toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="95"
                      step="1"
                      value={simHumi}
                      onChange={(e) => setSimHumi(parseFloat(e.target.value))}
                      className="w-full accent-[#2A9D8F] cursor-pointer h-2 bg-[#EBE6DC] rounded-lg"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#EBE6DC] text-xs text-[#576875] space-y-1">
                  <div className="font-bold text-[#24313A] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#2A9D8F]" />
                    <span>Timing Note: 2-Second Refresh Rule</span>
                  </div>
                  <p className="leading-relaxed">
                    The DHT22 measures air through a capacitive humidity sensor and thermistor. It takes about 2 seconds to prepare a sample, so your code must never call <code>dht.readTemperature()</code> faster than once every 2 seconds!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Field Map Reference Footer (from Document) */}
      <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#576875]">
        <div className="flex items-center gap-2 text-[#24313A] font-bold">
          <Sparkles className="w-4 h-4 text-[#2A9D8F]" />
          <span>ThingSpeak Channel Field Map:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-white border border-[#EBE6DC]">F1: Temp °C</span>
          <span className="px-2 py-0.5 rounded bg-white border border-[#EBE6DC]">F2: Humidity %</span>
          <span className="px-2 py-0.5 rounded bg-white border border-[#EBE6DC]">F3: Soil Raw ADC</span>
          <span className="px-2 py-0.5 rounded bg-white border border-[#EBE6DC]">F4: LDR Digital</span>
          <span className="px-2 py-0.5 rounded bg-white border border-[#EBE6DC] text-[#21867A] font-bold">F5: Pot 1–100</span>
        </div>
      </div>

    </div>
  );
};
