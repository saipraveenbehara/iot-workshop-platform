import React, { useState } from 'react';
import { 
  Key, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Copy, 
  Sparkles, 
  Radio, 
  Database, 
  Wifi, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Layers,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ThingSpeakPuzzleCard: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showInstructorCode, setShowInstructorCode] = useState(false);

  const handleVerify = () => {
    if (selectedOption === 1) { // Correct: Layer 3 Cloud Server
      setIsUnlocked(true);
      setShowError(false);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      setShowError(true);
    }
  };

  const copyToClipboard = (text: string, type: 'id' | 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-7 shadow-sm space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBE6DC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E6F4F2] border border-[#B2DFDB] flex items-center justify-center text-[#2A9D8F] shrink-0">
            {isUnlocked ? <Unlock className="w-5 h-5 text-[#2A9D8F]" /> : <Lock className="w-5 h-5 text-[#F28C75]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#21867A] font-mono">
                Mission Challenge • Stage 5
              </span>
              {isUnlocked && (
                <span className="px-2 py-0.5 rounded-full bg-[#E6F4F2] text-[#21867A] border border-[#B2DFDB] text-[10px] font-bold">
                  Unlocked ✓
                </span>
              )}
            </div>
            <h3 className="text-lg font-black text-[#24313A]">
              Cloud Uplink Decryption Puzzle
            </h3>
          </div>
        </div>

        <span className="text-xs text-[#576875] font-mono bg-[#FFFDF7] border border-[#EBE6DC] px-3 py-1.5 rounded-xl font-bold self-start sm:self-auto">
          ThingSpeak Channel Reward
        </span>
      </div>

      {!isUnlocked ? (
        /* Puzzle Challenge */
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#576875] leading-relaxed font-medium">
            To link your ESP32 node to the live weather station and receive real-time temperature and humidity readings, decode the cloud transmission layer:
          </p>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2">
            <span className="text-xs font-bold text-[#24313A] flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#2A9D8F]" />
              <span>Decryption Question:</span>
            </span>
            <p className="text-xs text-[#24313A] font-medium leading-relaxed">
              Which IoT layer does the <strong>central ThingSpeak server</strong> belong to, where your instructor’s sensor data is stored and distributed via REST APIs?
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {[
              { id: 0, label: "Layer 1: Perception Layer (Raw hardware probe touching nature)" },
              { id: 1, label: "Layer 3: Cloud Data Server (Database recording feeds & serving JSON over HTTP)" },
              { id: 2, label: "Layer 2: Network Carrier (Radio waves traveling through classroom air)" }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedOption(opt.id);
                  setShowError(false);
                }}
                className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between gap-3 ${
                  selectedOption === opt.id
                    ? 'bg-[#E6F4F2] border-[#2A9D8F] text-[#21867A] shadow-xs ring-1 ring-[#2A9D8F]'
                    : 'bg-white border-[#EBE6DC] hover:border-[#D5CFC2] text-[#24313A]'
                }`}
              >
                <span>{opt.label}</span>
                {selectedOption === opt.id && <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0" />}
              </button>
            ))}
          </div>

          {showError && (
            <div className="p-3 rounded-xl bg-[#FDF1EE] border border-[#F28C75] text-[#D95D43] text-xs font-bold animate-fade-in">
              Hint: The cloud database that holds records 24/7 is the 3rd floor of the 4-layer IoT tower!
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={selectedOption === null}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#2A9D8F] hover:bg-[#21867A] disabled:opacity-40 text-white font-black text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Key className="w-4 h-4" />
            <span>Verify & Unlock Live Channel Credentials</span>
          </button>
        </div>
      ) : (
        /* Unlocked Reward Box */
        <div className="space-y-5 animate-fade-in">
          <div className="p-5 rounded-2xl bg-[#FEF9EC] border border-[#F4C95D] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#B88719]">
              <Sparkles className="w-5 h-5 text-[#F4C95D]" />
              <h4 className="text-sm font-black uppercase tracking-wider">
                ThingSpeak Channel Decrypted & Unlocked!
              </h4>
            </div>
            <p className="text-xs text-[#576875] leading-relaxed">
              Use these exact credentials in your student C program to stream live temperature and humidity from the classroom station:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Channel ID */}
              <div className="p-3.5 rounded-xl bg-white border border-[#EBE6DC] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#576875] uppercase font-bold font-mono">Channel ID</span>
                  <p className="text-sm font-mono font-black text-[#24313A]">3594258</p>
                </div>
                <button
                  onClick={() => copyToClipboard('3594258', 'id')}
                  className="p-2 rounded-lg bg-[#FFFDF7] hover:bg-[#E6F4F2] border border-[#EBE6DC] hover:border-[#2A9D8F] text-[#576875] hover:text-[#2A9D8F] transition-all"
                  title="Copy Channel ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-[#2A9D8F]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Read API Key */}
              <div className="p-3.5 rounded-xl bg-white border border-[#EBE6DC] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#576875] uppercase font-bold font-mono">Read API Key</span>
                  <p className="text-sm font-mono font-black text-[#24313A]">XKXDZN01ERL8CVHX</p>
                </div>
                <button
                  onClick={() => copyToClipboard('XKXDZN01ERL8CVHX', 'key')}
                  className="p-2 rounded-lg bg-[#FFFDF7] hover:bg-[#E6F4F2] border border-[#EBE6DC] hover:border-[#2A9D8F] text-[#576875] hover:text-[#2A9D8F] transition-all cursor-pointer"
                  title="Copy Read API Key"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-[#2A9D8F]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-[#576875]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#2A9D8F]" />
                Field 1: <strong>Temperature (°C)</strong>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                Field 2: <strong>Humidity (%)</strong>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                Cadence: <strong>Every 20 seconds</strong>
              </span>
            </div>
          </div>

          {/* Instructor Transmitter Code Accordion */}
          <div className="rounded-2xl border border-[#EBE6DC] overflow-hidden">
            <button
              onClick={() => setShowInstructorCode(!showInstructorCode)}
              className="w-full p-4 bg-[#FFFDF7] hover:bg-white flex items-center justify-between text-xs font-bold text-[#24313A] transition-all"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#2A9D8F]" />
                <span>Curious? View the Instructor's Transmitter Code (DHT22 on Pin 4)</span>
              </div>
              {showInstructorCode ? <ChevronUp className="w-4 h-4 text-[#576875]" /> : <ChevronDown className="w-4 h-4 text-[#576875]" />}
            </button>

            {showInstructorCode && (
              <div className="p-4 bg-[#24313A] text-white space-y-3 font-mono text-[11px] leading-relaxed border-t border-[#EBE6DC]">
                <p className="text-gray-300">
                  // The instructor's station uploads live DHT22 readings to ThingSpeak using Write API Key: U19LIE7OXX9GSTTD
                </p>
                <pre className="bg-[#1A242B] p-3 rounded-xl overflow-x-auto text-[#B9DCE8]">
{`#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

#define DHT_PIN 4
#define DHT_TYPE DHT22

const char* THINGSPEAK_WRITE_API_KEY = "U19LIE7OXX9GSTTD";
const char* THINGSPEAK_URL = "http://api.thingspeak.com/update";
DHT dht(DHT_PIN, DHT_TYPE);

// Reads temperature & humidity every 20s and uploads via HTTP GET:
// http://api.thingspeak.com/update?api_key=U19LIE7OXX9GSTTD&field1=TEMP&field2=HUMI`}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
