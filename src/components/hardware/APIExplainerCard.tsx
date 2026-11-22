import React, { useState } from 'react';
import { Send, Server, Radio, Utensils, Database, Cpu, Compass, Layers } from 'lucide-react';

export const APIExplainerCard: React.FC = () => {
  const [isOrdering, setIsOrdering] = useState(false);
  const [receivedMeal, setReceivedMeal] = useState<{ temp: string; soil: string; status: string } | null>(null);

  const handleOrderFromAPI = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setReceivedMeal({
        temp: (24 + Math.random() * 8).toFixed(1),
        soil: (35 + Math.random() * 15).toFixed(1),
        status: '200 OK'
      });
    }, 900);
  };

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 space-y-6 shadow-sm">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBE6DC]">
        <div>
          <span className="text-xs font-bold text-[#21867A] uppercase tracking-wider font-mono">
            Internet of Things • Intuitive Model
          </span>
          <h3 className="text-xl lg:text-2xl font-black text-[#24313A] mt-0.5">
            What is an API? The Restaurant Analogy
          </h3>
        </div>

        <div className="text-xs text-[#21867A] font-mono bg-[#E6F4F2] border border-[#B2DFDB] px-3.5 py-1.5 rounded-xl font-bold self-start sm:self-auto">
          Application Programming Interface
        </div>
      </div>

      {/* The Restaurant Analogy Story */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Customer */}
        <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-3 relative overflow-hidden">
          <div className="w-11 h-11 rounded-xl bg-[#F1F7FA] border border-[#D4EBF2] flex items-center justify-center text-[#2A9D8F]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#576875] font-mono font-bold uppercase">1. The Customer</span>
            <h4 className="text-base font-bold text-[#24313A]">Your Pico Station</h4>
          </div>
          <p className="text-xs text-[#576875] leading-relaxed">
            Your Pico sits at the workbench hungry for live data. It needs to know: <em>"What is the temperature in the greenhouse?"</em> But it cannot reach directly into the cloud database on its own.
          </p>
        </div>

        {/* Waiter */}
        <div className="p-5 rounded-2xl bg-[#E6F4F2]/50 border border-[#B2DFDB] space-y-3 shadow-sm relative overflow-hidden">
          <div className="w-11 h-11 rounded-xl bg-white border border-[#B2DFDB] flex items-center justify-center text-[#21867A]">
            <Utensils className="w-5 h-5 text-[#2A9D8F]" />
          </div>
          <div>
            <span className="text-[10px] text-[#21867A] font-mono font-bold uppercase">2. The Waiter</span>
            <h4 className="text-base font-bold text-[#24313A]">The Web API</h4>
          </div>
          <p className="text-xs text-[#576875] leading-relaxed">
            The API is the helpful waiter. Your Pico calls out an order: <em>"GET /api/feed please!"</em> The waiter carries this request across the Wi-Fi network straight into the cloud kitchen.
          </p>
        </div>

        {/* Kitchen */}
        <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-3 relative overflow-hidden">
          <div className="w-11 h-11 rounded-xl bg-[#FEF9EC] border border-[#FCEFCB] flex items-center justify-center text-[#DBAF40]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#576875] font-mono font-bold uppercase">3. The Kitchen</span>
            <h4 className="text-base font-bold text-[#24313A]">The Cloud Database</h4>
          </div>
          <p className="text-xs text-[#576875] leading-relaxed">
            The cloud database receives real-time streams from field sensors. The waiter packages the freshest measurements into a neat, labeled meal box (JSON) and brings it back to your Pico!
          </p>
        </div>

      </div>

      {/* Interactive API Simulator */}
      <div className="p-6 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 max-w-md">
          <span className="text-xs font-bold text-[#21867A] uppercase font-mono flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>Interactive API Request Test</span>
          </span>
          <h4 className="text-base font-extrabold text-[#24313A]">
            Send an HTTP GET Request to the Waiter
          </h4>
          <p className="text-xs text-[#576875] leading-relaxed">
            Click below to see how your MicroPython code queries the API and receives neatly packaged environmental readings.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 w-full md:w-auto shrink-0">
          <button
            disabled={isOrdering}
            onClick={handleOrderFromAPI}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#2A9D8F] hover:bg-[#21867A] disabled:opacity-50 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <Send className={`w-4 h-4 ${isOrdering ? 'animate-spin' : ''}`} />
            <span>{isOrdering ? 'Waiter Fetching Telemetry...' : 'Order Data: GET /api/feed'}</span>
          </button>

          {receivedMeal && (
            <div className="p-3 bg-white border border-[#B2DFDB] rounded-xl font-mono text-xs text-[#24313A] animate-fade-in text-center space-y-0.5 shadow-sm">
              <span className="text-[10px] text-[#21867A] font-bold block">{receivedMeal.status} Response Delivered:</span>
              <span>{`{"temp": "${receivedMeal.temp}°C", "soil": "${receivedMeal.soil}%"}`}</span>
            </div>
          )}
        </div>
      </div>

      {/* The 4-Layer IoT Tower */}
      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-bold text-[#24313A] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2A9D8F]" />
          <span>The 4 Layers of Every IoT System</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#EBE6DC]">
            <span className="text-[10px] font-mono text-[#899AA8] font-bold">LAYER 1</span>
            <p className="text-xs font-bold text-[#21867A] mt-0.5">Perception Layer</p>
            <p className="text-[11px] text-[#576875] mt-1 leading-relaxed">
              Physical sensors touching sunlight, temperature, soil, and moisture.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#EBE6DC]">
            <span className="text-[10px] font-mono text-[#899AA8] font-bold">LAYER 2</span>
            <p className="text-xs font-bold text-[#2A9D8F] mt-0.5">Network Layer</p>
            <p className="text-[11px] text-[#576875] mt-1 leading-relaxed">
              Wi-Fi radio waves beaming data packets between the Pico and the local router.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#EBE6DC]">
            <span className="text-[10px] font-mono text-[#899AA8] font-bold">LAYER 3</span>
            <p className="text-xs font-bold text-[#DBAF40] mt-0.5">Cloud Storage Layer</p>
            <p className="text-[11px] text-[#576875] mt-1 leading-relaxed">
              The central server database storing time-stamped records 24/7.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#EBE6DC]">
            <span className="text-[10px] font-mono text-[#899AA8] font-bold">LAYER 4</span>
            <p className="text-xs font-bold text-[#F28C75] mt-0.5">Application Layer</p>
            <p className="text-[11px] text-[#576875] mt-1 leading-relaxed">
              Your station's OLED display, buzzers, and automated sirens alerting people.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
