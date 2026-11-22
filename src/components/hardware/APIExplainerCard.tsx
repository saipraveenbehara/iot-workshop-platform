import React, { useState } from 'react';
import { Send, CheckCircle2, Server, Radio, ArrowRight, Utensils, Database, Cpu } from 'lucide-react';

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
    }, 1200);
  };

  return (
    <div className="bg-[#0B0F19] border border-gray-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
            Internet of Things • Simplified for Builders
          </span>
          <h3 className="text-xl font-extrabold text-white mt-0.5">
            What is an API? Explained Like You're at a Restaurant
          </h3>
        </div>

        <div className="text-xs text-purple-300 font-mono bg-purple-950/60 border border-purple-500/40 px-3 py-1 rounded-xl">
          Application Programming Interface
        </div>
      </div>

      {/* The Restaurant Analogy Story */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Customer */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase">The Customer</span>
            <h4 className="text-base font-bold text-white">Your Raspberry Pi Pico</h4>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Your Pico is sitting at a table hungry for information. It wants to know: <em>"What is the temperature in the room right now?"</em> But it has no permission to walk into the cloud server's private files.
          </p>
        </div>

        {/* Waiter */}
        <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-3 shadow-lg shadow-purple-500/10 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-purple-300 font-mono font-bold uppercase">The Waiter</span>
            <h4 className="text-base font-bold text-white">The Web API</h4>
          </div>
          <p className="text-xs text-purple-200/90 leading-relaxed">
            The API is your friendly waiter! It hands your Pico a <strong>Menu</strong> (the API URL). Your Pico says: <em>"I'd like to order <code>GET /api/feed</code> please!"</em> The waiter carries your order to the kitchen.
          </p>
        </div>

        {/* Kitchen */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-amber-400 font-mono font-bold uppercase">The Kitchen & Pantry</span>
            <h4 className="text-base font-bold text-white">The Central Server Database</h4>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            The chefs in the kitchen receive live telemetry from sensors across the world. The waiter grabs the latest fresh sensor numbers, packages them into a neat box (JSON), and serves them to your Pico!
          </p>
        </div>

      </div>

      {/* Interactive API Simulator */}
      <div className="p-6 rounded-2xl bg-[#070B14] border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-md">
          <span className="text-xs font-bold text-purple-400 uppercase font-mono flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive API Request Simulator</span>
          </span>
          <h4 className="text-base font-extrabold text-white">
            Send an HTTP GET Request to the Waiter
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Click the button to watch how your MicroPython code queries the API waiter and receives structured JSON data back.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 w-full md:w-auto shrink-0">
          <button
            disabled={isOrdering}
            onClick={handleOrderFromAPI}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Send className={`w-4 h-4 ${isOrdering ? 'animate-spin' : ''}`} />
            <span>{isOrdering ? 'Waiter is fetching from kitchen...' : 'Order Data: GET /api/feed'}</span>
          </button>

          {receivedMeal && (
            <div className="p-3 bg-gray-900 border border-purple-500/40 rounded-xl font-mono text-xs text-purple-200 animate-fade-in text-center space-y-0.5">
              <span className="text-[10px] text-emerald-400 font-bold block">{receivedMeal.status} Payload Received:</span>
              <span>{`{"temp": "${receivedMeal.temp}°C", "soil": "${receivedMeal.soil}%"}`}</span>
            </div>
          )}
        </div>
      </div>

      {/* The 4-Layer IoT Tower */}
      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          <span>The 4 Layers of Every IoT System on Earth</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-[10px] font-mono text-gray-500 font-bold">LAYER 1</span>
            <p className="text-xs font-bold text-emerald-400 mt-0.5">Perception Layer</p>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
              Physical sensors directly touching water, dirt, sunlight, and air.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-[10px] font-mono text-gray-500 font-bold">LAYER 2</span>
            <p className="text-xs font-bold text-cyan-400 mt-0.5">Network Layer</p>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
              2.4 GHz Wi-Fi radio waves flying through the air to the internet router.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-[10px] font-mono text-gray-500 font-bold">LAYER 3</span>
            <p className="text-xs font-bold text-purple-400 mt-0.5">Cloud / Server Layer</p>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
              ThingSpeak or central database storing and organizing records 24/7.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-[10px] font-mono text-gray-500 font-bold">LAYER 4</span>
            <p className="text-xs font-bold text-amber-400 mt-0.5">Application Layer</p>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
              Your team's OLED display, buzzers, and automated sirens alerting humans.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
