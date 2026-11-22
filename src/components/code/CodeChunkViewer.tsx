import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { CodeChunk } from '../../types/curriculum.js';

interface CodeChunkViewerProps {
  chunks: CodeChunk[];
  fullScript: string;
}

export const CodeChunkViewer: React.FC<CodeChunkViewerProps> = ({
  chunks,
  fullScript,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFullCode, setShowFullCode] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-extrabold text-white">MicroPython Code Chunks</h3>
        </div>
        <button
          onClick={() => handleCopy(fullScript, 'full')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold transition-all"
        >
          {copiedId === 'full' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedId === 'full' ? 'Full Code Copied!' : 'Copy Full Script'}</span>
        </button>
      </div>

      {/* Code Chunks List */}
      <div className="space-y-4">
        {chunks.map((chunk) => (
          <div
            key={chunk.blockId}
            className={`rounded-2xl border transition-all ${
              chunk.isConfigurable
                ? 'bg-amber-950/20 border-amber-500/40 shadow-sm shadow-amber-500/5'
                : 'bg-gray-900/70 border-gray-800 hover:border-gray-700'
            }`}
          >
            {/* Chunk Header */}
            <div className="px-4 py-2.5 bg-gray-900/90 rounded-t-2xl border-b border-gray-800 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {chunk.title}
              </span>
              <button
                onClick={() => handleCopy(chunk.code, chunk.blockId)}
                className="text-gray-400 hover:text-white p-1 text-[11px] font-semibold flex items-center gap-1"
              >
                {copiedId === chunk.blockId ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block */}
            <div className="p-4 overflow-x-auto font-mono text-sm text-emerald-300 bg-[#0B0F19]/80 leading-relaxed font-medium">
              <pre>{chunk.code}</pre>
            </div>

            {/* Plain English Explanation */}
            <div className="px-4 py-3 bg-gray-900/60 rounded-b-2xl border-t border-gray-800/80 text-xs text-gray-300 leading-relaxed">
              <span className="font-semibold text-emerald-400">Explanation:</span> <span>{chunk.explanation}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Script Accordion View */}
      <div className="pt-2 border-t border-gray-800">
        <button
          onClick={() => setShowFullCode(!showFullCode)}
          className="w-full flex items-center justify-between text-xs font-bold text-gray-400 hover:text-white p-2"
        >
          <span className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-emerald-400" />
            {showFullCode ? 'Hide Full Ready-to-Run Script' : 'View Full Ready-to-Run Script'}
          </span>
          {showFullCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFullCode && (
          <div className="mt-3 p-4 rounded-2xl bg-gray-950 border border-gray-800 font-mono text-xs text-emerald-300 overflow-x-auto animate-fade-in">
            <pre>{fullScript}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
