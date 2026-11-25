import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Zap, 
  Droplets, 
  Sun, 
  Moon, 
  Terminal, 
  Cpu, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Radio,
  ExternalLink
} from 'lucide-react';
import { Oled, oledMeta, Led, ledMeta } from '../../hardware/index.js';

export const AutonomousPlantGuardianCard: React.FC = () => {
  // Interactive Simulation Controls
  const [simSoilPercent, setSimSoilPercent] = useState<number>(65);
  const [simLightDetected, setSimLightDetected] = useState<boolean>(true);
  const [showInstructorCode, setShowInstructorCode] = useState<boolean>(false);
  const [copiedInstructorCode, setCopiedInstructorCode] = useState<boolean>(false);

  // Decision Logic (from Codebook Activity 7)
  const MIN_GOOD_SOIL_PERCENT = 30.0;
  const isSoilGood = simSoilPercent >= MIN_GOOD_SOIL_PERCENT;
  const isGood = isSoilGood && simLightDetected;

  // Output actuator states
  const redLedOn = !isGood;
  const greenLedOn = isGood;
  const buzzerSounding = !isGood;

  // Simulated raw soil based on percentage
  const SOIL_DRY_RAW = 3000;
  const SOIL_WET_RAW = 1300;
  const simSoilRaw = Math.round(SOIL_DRY_RAW - (simSoilPercent / 100) * (SOIL_DRY_RAW - SOIL_WET_RAW));

  const copyInstructorCode = () => {
    navigator.clipboard.writeText(instructorCodeText);
    setCopiedInstructorCode(true);
    setTimeout(() => setCopiedInstructorCode(false), 2000);
  };

  const instructorCodeText = `#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "DHT.h"

const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* WRITE_API_KEY = "U19LIE7OXX9GSTTD";
const char* THINGSPEAK_URL = "http://api.thingspeak.com/update";

#define DHT_PIN 4
#define DHT_TYPE DHT22
#define SOIL_PIN 34
#define LDR_PIN 26
#define POT_PIN 35
#define OLED_SDA 21
#define OLED_SCL 22

Adafruit_SSD1306 display(128, 64, &Wire, -1);
DHT dht(DHT_PIN, DHT_TYPE);

const unsigned long UPLOAD_INTERVAL_MS = 20000;
unsigned long lastUpload = 0;

void setup() {
  Serial.begin(115200);
  pinMode(LDR_PIN, INPUT);
  analogReadResolution(12);
  dht.begin();
  Wire.begin(OLED_SDA, OLED_SCL);

  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  // Uploads Temp(F1), Humidity(F2), Soil(F3), LDR(F4), Pot(F5) every 20s
}`;

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EBE6DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A] text-xs font-bold font-mono uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Activity 7 · Autonomous IoT Decision Loop</span>
          </div>
          <h3 className="text-xl font-black text-[#24313A] tracking-tight">
            Smart Plant Guardian: Decisions, Multi-Modal Alerts & OLED
          </h3>
          <p className="text-xs text-[#576875] mt-1">
            An autonomous IoT agent doesn't just read data — it makes intelligent decisions! Here, your ESP32 polls Cloud Fields 3 & 4 and triggers physical light, sound, and visual indicators.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] text-xs font-mono font-bold text-[#24313A] shrink-0 self-start md:self-center">
          <Radio className="w-4 h-4 text-[#2A9D8F] animate-pulse" />
          <span>Closed-Loop Automation</span>
        </div>
      </div>

      {/* Interactive Testing Simulator */}
      <div className="bg-[#FFFDF7] border border-[#EBE6DC] rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-[#24313A] tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#F4C95D]" />
            <span>Interactive Decision & Alert Simulator</span>
          </span>
          <span className="text-[11px] font-mono text-[#576875]">Adjust inputs to test actuators</span>
        </div>

        {/* Inputs & Condition Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Soil Moisture Slider */}
          <div className="p-4 rounded-xl bg-white border border-[#EBE6DC] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#24313A]">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#2A9D8F]" />
                <span>Cloud Field 3: Soil Moisture</span>
              </span>
              <span className={`font-mono font-black ${isSoilGood ? 'text-[#21867A]' : 'text-[#D95D43]'}`}>
                {simSoilPercent}% ({isSoilGood ? 'Good ≥30%' : 'Low <30%'})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={simSoilPercent}
              onChange={(e) => setSimSoilPercent(parseInt(e.target.value))}
              className="w-full accent-[#2A9D8F] cursor-pointer h-2 bg-[#EBE6DC] rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#899AA8]">
              <span>0% (Dry Air)</span>
              <span className="text-[#F28C75] font-bold">30% Threshold</span>
              <span>100% (Water)</span>
            </div>
          </div>

          {/* Light Detected Toggle */}
          <div className="p-4 rounded-xl bg-white border border-[#EBE6DC] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#24313A]">
              <span className="flex items-center gap-1.5">
                {simLightDetected ? <Sun className="w-4 h-4 text-[#F4C95D]" /> : <Moon className="w-4 h-4 text-[#576875]" />}
                <span>Cloud Field 4: LDR Light Status</span>
              </span>
              <span className={`font-mono font-black ${simLightDetected ? 'text-[#21867A]' : 'text-[#D95D43]'}`}>
                {simLightDetected ? 'YES (LOW)' : 'NO (HIGH)'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 pt-0.5">
              <button
                onClick={() => setSimLightDetected(true)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  simLightDetected 
                    ? 'bg-[#FEF9EC] border-[#F4C95D] text-[#B88719]' 
                    : 'bg-white border-[#EBE6DC] text-[#576875]'
                }`}
              >
                Light Detected (LOW)
              </button>
              <button
                onClick={() => setSimLightDetected(false)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  !simLightDetected 
                    ? 'bg-[#24313A] border-[#1E293B] text-white' 
                    : 'bg-white border-[#EBE6DC] text-[#576875]'
                }`}
              >
                Darkness (HIGH)
              </button>
            </div>
          </div>

        </div>

        {/* Live System Actuators Response (OLED + LEDs + Buzzer) */}
        <div className="p-5 rounded-2xl bg-white border border-[#EBE6DC] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EBE6DC]">
            <div className="flex items-center gap-2">
              {isGood ? (
                <ShieldCheck className="w-5 h-5 text-[#2A9D8F]" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-[#F28C75] animate-bounce" />
              )}
              <span className="text-sm font-black text-[#24313A]">
                System Response: {isGood ? 'NORMAL HEALTH' : 'ACTIVE ALERT!'}
              </span>
            </div>
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
              isGood ? 'bg-[#E6F4F2] text-[#21867A]' : 'bg-[#FDF1EE] text-[#D95D43]'
            }`}>
              bool good = {isGood ? 'TRUE' : 'FALSE'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Live Virtual OLED */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-[#899AA8] uppercase font-bold mb-1.5">
                SSD1306 OLED (GPIO 21 / 22)
              </span>
              <div className="p-2 rounded-xl bg-[#0F172A] border-2 border-[#334155] shadow-md">
                <svg viewBox="0 0 128 64" className="w-48 h-24 font-mono select-none">
                  <rect width="128" height="64" fill="#000000" />
                  <text x="4" y="10" fill="#38BDF8" fontSize="7" fontFamily="sans-serif">Soil and light status</text>
                  <text x="4" y="28" fill="#FFFFFF" fontSize="13" fontWeight="bold">Soil: {simSoilPercent}%</text>
                  <text x="4" y="44" fill="#94A3B8" fontSize="7">Raw: {simSoilRaw}  Light: {simLightDetected ? 'YES' : 'NO'}</text>
                  <text x="4" y="58" fill={isGood ? '#4ADE80' : '#F87171'} fontSize="9" fontWeight="bold">
                    Status: {isGood ? 'GOOD' : 'CHECK'}
                  </text>
                </svg>
              </div>
            </div>

            {/* Red & Green LEDs */}
            <div className="flex items-center justify-around">
              {/* Red LED (GPIO 18) */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-12 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  redLedOn 
                    ? 'bg-[#FDF1EE] border-2 border-[#F28C75] shadow-lg shadow-red-200 scale-105' 
                    : 'bg-[#FFFDF7] border border-[#EBE6DC] opacity-40'
                }`}>
                  <Led x={1} y={2} scale={0.8} color="red" lit={redLedOn} brightness={1.4} />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#D95D43]">Red (D18)</span>
                <span className="text-[9px] font-mono">{redLedOn ? 'HIGH (ON)' : 'LOW (OFF)'}</span>
              </div>

              {/* Green LED (GPIO 19) */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-12 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  greenLedOn 
                    ? 'bg-[#E6F4F2] border-2 border-[#2A9D8F] shadow-lg shadow-teal-200 scale-105' 
                    : 'bg-[#FFFDF7] border border-[#EBE6DC] opacity-40'
                }`}>
                  <Led x={1} y={2} scale={0.8} color="green" lit={greenLedOn} brightness={1.4} />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#21867A]">Green (D19)</span>
                <span className="text-[9px] font-mono">{greenLedOn ? 'HIGH (ON)' : 'LOW (OFF)'}</span>
              </div>
            </div>

            {/* Active Buzzer (GPIO 23) */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono text-[#899AA8] uppercase font-bold">
                Active Buzzer (GPIO 23)
              </span>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                buzzerSounding 
                  ? 'bg-[#FDF1EE] border-2 border-[#F28C75] text-[#D95D43] animate-pulse shadow-md' 
                  : 'bg-[#FFFDF7] border border-[#EBE6DC] text-[#899AA8]'
              }`}>
                {buzzerSounding ? <Volume2 className="w-8 h-8" /> : <VolumeX className="w-8 h-8" />}
              </div>
              <span className={`text-xs font-mono font-black ${buzzerSounding ? 'text-[#D95D43]' : 'text-[#899AA8]'}`}>
                {buzzerSounding ? '🔊 BEEPING!' : 'Silent'}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Instructor Station Integration Drawer */}
      <div className="border border-[#EBE6DC] rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowInstructorCode(!showInstructorCode)}
          className="w-full p-4 bg-[#FFFDF7] hover:bg-white flex items-center justify-between text-xs font-bold text-[#24313A] transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#2A9D8F]" />
            <span>Instructor Station Codebook: Combined 5-Sensor Cloud Transmitter</span>
          </span>
          <div className="flex items-center gap-2 text-[#576875]">
            <span className="text-[11px] font-mono">DHT22 + Soil + LDR + Pot + OLED</span>
            {showInstructorCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showInstructorCode && (
          <div className="p-4 bg-white border-t border-[#EBE6DC] space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#576875]">
                This is the complete transmitter sketch running on the facilitator's classroom ESP32. It reads all 5 sensors and updates ThingSpeak every 20 seconds.
              </p>
              <button
                onClick={copyInstructorCode}
                className="px-3 py-1.5 rounded-lg bg-[#E6F4F2] hover:bg-[#D5EFEA] text-[#21867A] text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                {copiedInstructorCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInstructorCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#1E293B] text-[#F8FAFC] text-[11px] font-mono leading-relaxed overflow-x-auto max-h-72">
              {instructorCodeText}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
};
