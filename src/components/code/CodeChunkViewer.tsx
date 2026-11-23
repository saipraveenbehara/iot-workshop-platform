import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2, ChevronDown, ChevronUp, Sparkles, Sliders } from 'lucide-react';
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
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 shadow-sm flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#EBE6DC]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E6F4F2] border border-[#B2DFDB] flex items-center justify-center text-[#2A9D8F]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#24313A]">C / C++ Code Blocks</h3>
            <p className="text-xs text-[#576875]">Follow along chunk by chunk or copy the complete C sketch</p>
          </div>
        </div>
        <button
          onClick={() => handleCopy(fullScript, 'full')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E6F4F2] border border-[#B2DFDB] hover:bg-[#D5EFEA] text-[#2A9D8F] text-xs font-bold transition-all shadow-sm"
        >
          {copiedId === 'full' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedId === 'full' ? 'Full Code Copied!' : 'Copy Full C Code'}</span>
        </button>
      </div>

      {/* Code Chunks List */}
      <div className="space-y-4">
        {chunks.map((chunk) => (
          <div
            key={chunk.blockId}
            className={`rounded-2xl border transition-all overflow-hidden ${
              chunk.isConfigurable
                ? 'bg-[#FEF9EC] border-[#F4C95D] shadow-sm'
                : 'bg-[#FFFDF7] border-[#EBE6DC] hover:border-[#D5CFC2]'
            }`}
          >
            {/* Chunk Header */}
            <div className="px-4 py-2.5 bg-white border-b border-[#EBE6DC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${chunk.isConfigurable ? 'bg-[#F4C95D]' : 'bg-[#2A9D8F]'}`} />
                <span className="text-xs font-bold text-[#24313A]">{chunk.title}</span>
                {chunk.isConfigurable && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF9EC] text-[#B88719] border border-[#F4C95D]">
                    <Sliders className="w-2.5 h-2.5" />
                    Customize This
                  </span>
                )}
              </div>
              <button
                onClick={() => handleCopy(chunk.code, chunk.blockId)}
                className="text-[#576875] hover:text-[#2A9D8F] p-1 text-[11px] font-bold flex items-center gap-1 transition-colors"
              >
                {copiedId === chunk.blockId ? (
                  <>
                    <Check className="w-3 h-3 text-[#2A9D8F]" />
                    <span className="text-[#2A9D8F]">Copied!</span>
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
            <div className="p-4 overflow-x-auto font-mono text-xs sm:text-sm text-[#1E293B] bg-[#F8F9FA] leading-relaxed font-medium">
              <pre>{chunk.code}</pre>
            </div>

            {/* Plain English Explanation */}
            <div className="px-4 py-3 bg-white border-t border-[#EBE6DC] text-xs text-[#576875] leading-relaxed">
              <span className="font-bold text-[#2A9D8F]">What this does:</span> <span>{chunk.explanation}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Script Accordion View */}
      <div className="pt-2 border-t border-[#EBE6DC]">
        <button
          onClick={() => setShowFullCode(!showFullCode)}
          className="w-full flex items-center justify-between text-xs font-bold text-[#576875] hover:text-[#24313A] p-2 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-[#2A9D8F]" />
            {showFullCode ? 'Hide Full Ready-to-Run Script' : 'View Full Ready-to-Run Script'}
          </span>
          {showFullCode ? <ChevronUp className="w-4 h-4 text-[#2A9D8F]" /> : <ChevronDown className="w-4 h-4 text-[#2A9D8F]" />}
        </button>

        {showFullCode && (
          <div className="mt-3 p-4 rounded-2xl bg-[#F8F9FA] border border-[#EBE6DC] font-mono text-xs text-[#1E293B] overflow-x-auto animate-fade-in shadow-inner">
            <pre>{fullScript}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
