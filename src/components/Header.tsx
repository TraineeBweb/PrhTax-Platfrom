import React from 'react';
import { Sparkles, FileText, Database, Video, Cpu, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  suspenseCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, suspenseCount }) => {
  return (
    <header className="h-20 border-b border-[#2a2a2a] flex items-center justify-between px-6 lg:px-10 bg-[#0f0f0f] z-20 shrink-0 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('briefing')}>
        <div className="w-8 h-8 border border-[#c5a059] flex items-center justify-center rotate-45 transition-transform hover:rotate-90 duration-500">
          <div className="w-4 h-4 bg-[#c5a059] -rotate-45"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl tracking-[0.2em] uppercase font-serif italic text-[#f5f5f5] font-semibold">
            Aurelius & Co.
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#c5a059] font-medium">
            Drake Macro & Intelligence Suite
          </span>
        </div>
      </div>

      {/* Navigation tabs matching Sophisticated Dark design */}
      <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[11px] uppercase tracking-[0.15em] font-medium text-[#888]">
        <button
          onClick={() => setActiveTab('briefing')}
          className={`flex items-center gap-1.5 transition-colors py-2 border-b-2 ${
            activeTab === 'briefing'
              ? 'text-[#c5a059] border-[#c5a059]'
              : 'border-transparent hover:text-white hover:border-[#444]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Briefing</span>
        </button>

        <button
          onClick={() => setActiveTab('macro-engine')}
          className={`flex items-center gap-1.5 transition-colors py-2 border-b-2 relative ${
            activeTab === 'macro-engine'
              ? 'text-[#c5a059] border-[#c5a059]'
              : 'border-transparent hover:text-white hover:border-[#444]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Bank Macro SOP</span>
          {suspenseCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 text-[9px] rounded-full">
              {suspenseCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('video-moments')}
          className={`flex items-center gap-1.5 transition-colors py-2 border-b-2 ${
            activeTab === 'video-moments'
              ? 'text-[#c5a059] border-[#c5a059]'
              : 'border-transparent hover:text-white hover:border-[#444]'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Meeting Intel</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-analyst')}
          className={`flex items-center gap-1.5 transition-colors py-2 border-b-2 ${
            activeTab === 'ai-analyst'
              ? 'text-[#c5a059] border-[#c5a059]'
              : 'border-transparent hover:text-white hover:border-[#444]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>Gemini 3.1 Pro</span>
        </button>
      </nav>

      {/* Right Metadata */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#151515] border border-[#262626] rounded-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] tracking-wider uppercase text-[#aaa] font-medium">Drake SOP v2.4</span>
        </div>
        <div className="h-8 w-[1px] bg-[#2a2a2a] hidden sm:block"></div>
        <span className="text-[10px] tracking-widest uppercase text-[#888] opacity-80 font-mono">
          Ref #8842-DK
        </span>
      </div>
    </header>
  );
};
