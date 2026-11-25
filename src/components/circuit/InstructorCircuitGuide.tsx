import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Cpu, 
  Zap, 
  AlertCircle, 
  Sparkles, 
  Check, 
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { CircuitStep } from '../../types/curriculum.js';

interface InstructorCircuitGuideProps {
  levelNumber: number;
  steps: CircuitStep[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
}

export const InstructorCircuitGuide: React.FC<InstructorCircuitGuideProps> = ({
  levelNumber,
  steps,
  currentStepIndex,
  onStepChange,
}) => {
  const [circuitVerified, setCircuitVerified] = useState(false);

  // Component hardware checklist by level
  const getHardwareChecklist = (lvl: number) => {
    switch (lvl) {
      case 0:
        return [
          { name: 'ESP32 DevKit V1 Board (30-pin)', count: '1x', color: '#2A9D8F' },
          { name: 'Micro-USB Data Cable', count: '1x', color: '#576875' },
        ];
      case 1:
        return [
          { name: 'ESP32 DevKit V1 Board', count: '1x', color: '#2A9D8F' },
          { name: 'Built-in Onboard LED (GPIO 2)', count: 'Onboard', color: '#3B82F6' },
          { name: 'Micro-USB Cable (No external wiring)', count: '1x', color: '#576875' },
        ];
      case 2:
        return [
          { name: 'ESP32 DevKit V1 & Half/Full Breadboard', count: '1x', color: '#2A9D8F' },
          { name: 'Red 5mm LED', count: '1x', color: '#EF4444' },
          { name: 'Green 5mm LED', count: '1x', color: '#2A9D8F' },
          { name: '220Ω Resistors (Red-Red-Brown)', count: '2x', color: '#F4C95D' },
          { name: '4-Pin Tactile Push Button', count: '1x', color: '#3B82F6' },
          { name: 'Male-to-Male Jumper Wires', count: '6x', color: '#1E293B' },
        ];
      case 3:
        return [
          { name: 'ESP32 DevKit V1 & Breadboard', count: '1x', color: '#2A9D8F' },
          { name: 'Rotary Potentiometer Module (10kΩ)', count: '1x', color: '#2A9D8F' },
          { name: 'Male-to-Male Jumper Wires', count: '3x', color: '#1E293B' },
          { name: 'DHT22 / Soil / LDR Reference Modules', count: 'Classroom', color: '#F28C75' },
        ];
      case 4:
        return [
          { name: 'ESP32 DevKit V1 & Breadboard', count: '1x', color: '#2A9D8F' },
          { name: '0.96" I2C OLED Display (SSD1306 128x64)', count: '1x', color: '#3B82F6' },
          { name: 'Male-to-Male Jumper Wires (VCC, GND, SDA, SCL)', count: '4x', color: '#1E293B' },
        ];
      case 5:
        return [
          { name: 'ESP32 DevKit V1 & Breadboard', count: '1x', color: '#2A9D8F' },
          { name: '0.96" I2C OLED Display (from Stage 4)', count: '1x', color: '#3B82F6' },
          { name: 'Local Wi-Fi Network Credentials', count: '2.4GHz', color: '#2A9D8F' },
          { name: 'ThingSpeak Channel ID: 3594258', count: 'Cloud', color: '#F4C95D' },
        ];
      case 6:
        return [
          { name: 'ESP32 DevKit V1 & Breadboard', count: '1x', color: '#2A9D8F' },
          { name: '0.96" I2C OLED Display (SDA 21, SCL 22)', count: '1x', color: '#3B82F6' },
          { name: 'Red Alert LED & 220Ω Resistor (GPIO 18)', count: '1x', color: '#EF4444' },
          { name: 'Green Normal LED & 220Ω Resistor (GPIO 19)', count: '1x', color: '#2A9D8F' },
          { name: 'Active Buzzer Module (GPIO 23)', count: '1x', color: '#F4C95D' },
          { name: 'Jumper Wires to Common Ground Rail', count: '5x', color: '#1E293B' },
        ];
      default:
        return [];
    }
  };

  // Pin Plan quick reference by level
  const getPinPlanReference = (lvl: number) => {
    switch (lvl) {
      case 0:
        return [
          { pin: 'Micro-USB', destination: 'Computer 5V Power & Serial', note: 'Supplies 3.3V via onboard regulator' },
          { pin: '3V3 & GND', destination: 'Breadboard Power Rails', note: 'Never connect >3.6V to GPIO' },
        ];
      case 1:
        return [
          { pin: 'GPIO 2 (D2)', destination: 'Built-in Onboard LED', note: 'Surface mount LED on PCB (No wiring needed)' },
        ];
      case 2:
        return [
          { pin: 'GPIO 18 (D18)', destination: 'Red LED Anode (+)', note: 'Must have 220Ω resistor in series' },
          { pin: 'GPIO 19 (D19)', destination: 'Green LED Anode (+)', note: 'Must have 220Ω resistor in series' },
          { pin: 'GND (Pin 17)', destination: 'Both LED Cathodes (-)', note: 'Connects to bottom blue ground rail' },
          { pin: 'GPIO 27 (D27)', destination: 'Push Button Pin 1', note: 'Uses internal INPUT_PULLUP resistor' },
          { pin: 'GND Rail', destination: 'Push Button Pin 2', note: 'Pressing shorts GPIO 27 to GND (reads LOW)' },
        ];
      case 3:
        return [
          { pin: 'GPIO 35 (D35)', destination: 'Potentiometer Center Pin (SIG)', note: 'Analog input reading 0 to 4095' },
          { pin: '3V3 Rail', destination: 'Potentiometer Outer Pin (VCC)', note: '+3.3V reference voltage' },
          { pin: 'GND Rail', destination: 'Potentiometer Outer Pin (GND)', note: '0V ground reference' },
        ];
      case 4:
      case 5:
        return [
          { pin: 'GPIO 21 (D21)', destination: 'OLED SDA Pin', note: 'I2C Serial Data line' },
          { pin: 'GPIO 22 (D22)', destination: 'OLED SCL Pin', note: 'I2C Serial Clock line' },
          { pin: '3V3 Rail', destination: 'OLED VCC Pin', note: '3.3V power from rail' },
          { pin: 'GND Rail', destination: 'OLED GND Pin', note: 'Common ground from rail' },
        ];
      case 6:
        return [
          { pin: 'GPIO 21 & 22', destination: 'OLED SDA & SCL', note: 'Displays live status & soil %' },
          { pin: 'GPIO 18 (D18)', destination: 'Red Alert LED', note: 'Fires when soil < 30% or dark' },
          { pin: 'GPIO 19 (D19)', destination: 'Green Normal LED', note: 'Glows when plant is healthy' },
          { pin: 'GPIO 23 (D23)', destination: 'Active Buzzer (+)', note: 'Sounds audible alarm on alert' },
          { pin: 'GND Rail', destination: 'All Cathodes & Buzzer (-)', note: 'Common ground connection' },
        ];
      default:
        return [];
    }
  };

  const checklist = getHardwareChecklist(levelNumber);
  const pinPlan = getPinPlanReference(levelNumber);

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-7 shadow-sm space-y-6">
      
      {/* 1. Main Instructor Banner */}
      <div className="p-5 lg:p-6 rounded-2xl bg-[#FFFDF7] border-2 border-[#2A9D8F]/30 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F4F2] border border-[#B2DFDB] flex items-center justify-center text-[#2A9D8F] shrink-0 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E6F4F2] text-[#21867A] text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#2A9D8F]" />
              <span>Instructor-Led Physical Workbench</span>
            </div>
            
            <h3 className="text-xl font-black text-[#24313A] tracking-tight">
              Follow the instructor to make the circuit.
            </h3>
            
            <p className="text-xs lg:text-sm text-[#576875] font-medium leading-relaxed">
              Your instructor is building this circuit on the physical breadboard at the front of the classroom. Watch the demonstration, check your parts, and connect your wires according to the pin table below!
            </p>
          </div>
        </div>
      </div>

      {/* 2. Parts Needed Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase text-[#24313A] tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#2A9D8F]" />
            <span>Hardware Components for Stage {levelNumber}</span>
          </h4>
          <span className="text-[11px] font-mono text-[#899AA8]">Gather from your kit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#FFFDF7] border border-[#EBE6DC] flex items-center justify-between text-xs font-medium"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#24313A]">{item.name}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-white border border-[#EBE6DC] text-[11px] font-mono font-bold text-[#576875]">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Official Pin Reference Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase text-[#24313A] tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#F4C95D]" />
            <span>Pin Quick-Reference Plan</span>
          </h4>
          <span className="text-[11px] font-mono text-[#21867A] font-bold">Codebook Verified</span>
        </div>

        <div className="border border-[#EBE6DC] rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FFFDF7] border-b border-[#EBE6DC] text-[#576875] font-bold">
              <tr>
                <th className="py-2.5 px-3.5">ESP32 Pin</th>
                <th className="py-2.5 px-3.5">Connects To</th>
                <th className="py-2.5 px-3.5 hidden sm:table-cell">Function Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DC] bg-white">
              {pinPlan.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FFFDF7] transition-colors">
                  <td className="py-2.5 px-3.5 font-bold text-[#2A9D8F] whitespace-nowrap">
                    {row.pin}
                  </td>
                  <td className="py-2.5 px-3.5 font-semibold text-[#24313A]">
                    {row.destination}
                  </td>
                  <td className="py-2.5 px-3.5 text-[#576875] text-[11px] hidden sm:table-cell">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Step-by-Step Connection Guide */}
      {steps.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-[#24313A] tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" />
              <span>Step-by-Step Wiring Sequence</span>
            </h4>
            <span className="text-[11px] font-mono text-[#576875]">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>

          <div className="space-y-2">
            {steps.map((s, idx) => (
              <div
                key={idx}
                onClick={() => onStepChange(idx)}
                className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-3 ${
                  idx === currentStepIndex
                    ? 'bg-[#E6F4F2] border-[#2A9D8F] shadow-xs'
                    : 'bg-white border-[#EBE6DC] hover:border-[#D5CFC2]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono font-bold mt-0.5 ${
                    idx === currentStepIndex
                      ? 'bg-[#2A9D8F] text-white'
                      : 'bg-[#FFFDF7] border border-[#EBE6DC] text-[#576875]'
                  }`}
                >
                  {s.stepNumber}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-bold text-[#24313A] flex items-center justify-between">
                    <span>{s.title}</span>
                    <span className="text-[10px] font-mono font-semibold" style={{ color: s.color }}>
                      {s.fromPin} ➔ {s.toBreadboardHole}
                    </span>
                  </div>
                  <p className="text-[#576875] text-[11px] leading-relaxed">
                    {s.instruction}
                  </p>
                  {s.polarityNote && (
                    <p className="text-[10px] text-[#F28C75] font-bold flex items-center gap-1 pt-1">
                      <HelpCircle className="w-3 h-3 shrink-0" />
                      <span>{s.polarityNote}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Circuit Ready Confirmation Toggle */}
      <div className="pt-2">
        <button
          onClick={() => setCircuitVerified(!circuitVerified)}
          className={`w-full py-3.5 px-5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            circuitVerified
              ? 'bg-[#E6F4F2] border-[#2A9D8F] text-[#21867A] shadow-xs'
              : 'bg-[#FFFDF7] border-[#EBE6DC] hover:border-[#2A9D8F] text-[#24313A]'
          }`}
        >
          {circuitVerified ? (
            <>
              <Check className="w-4 h-4 text-[#2A9D8F]" />
              <span>Circuit Built & Verified with Instructor! (Ready for Code)</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-[#576875]" />
              <span>Click when you finish wiring with the instructor</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
