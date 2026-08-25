import React from 'react';
import { Shield, Sparkles, Clock, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { CLIENT_DOSSIER } from '../data/videoTranscriptData';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  suspenseCount: number;
  totalMappedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, suspenseCount, totalMappedCount }) => {
  return (
    <aside className="w-80 border-r border-[#2a2a2a] bg-[#0d0d0d] p-6 lg:p-8 flex flex-col gap-8 shrink-0 overflow-y-auto select-none">
      {/* Client Partner Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#c5a059] font-medium">
            Client Partner
          </h3>
          <span className="text-[9px] px-2 py-0.5 bg-[#1a1a1a] border border-[#333] text-[#aaa] uppercase tracking-wider">
            Verified
          </span>
        </div>
        <p className="font-serif text-2xl text-[#f5f5f5] leading-tight">
          {CLIENT_DOSSIER.partnerName}
        </p>
        <p className="text-xs text-[#888] mt-1 font-light">
          {CLIENT_DOSSIER.primaryContact}
        </p>
      </section>

      {/* Strategic Priority & Status */}
      <section className="flex flex-col gap-5 border-t border-[#1f1f1f] pt-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#666] mb-1.5 font-medium">
            Strategic Priority
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#c5a059] animate-ping"></div>
            <span className="text-sm font-medium text-[#e5e5e5]">
              {CLIENT_DOSSIER.strategicPriority}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#666] mb-1.5 font-medium">
            Est. Monthly Time Saved
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif italic text-[#f5f5f5]">
              38.5 hrs
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              +88% Efficiency
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#666] mb-1.5 font-medium">
            Status
          </h3>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#151515] border border-[#2a2a2a] text-[10px] uppercase tracking-wider text-[#d4af37]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
            Active Tax Season
          </div>
        </div>
      </section>

      {/* Live System Metrics */}
      <section className="border-t border-[#1f1f1f] pt-6 flex flex-col gap-3">
        <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#666] font-medium">
          Macro Engine Telemetry
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div 
            onClick={() => setActiveTab('macro-engine')}
            className="p-3 bg-[#121212] border border-[#222] hover:border-[#3a3a3a] cursor-pointer transition-colors"
          >
            <div className="text-[10px] text-[#888] uppercase tracking-wider">Mapped Rules</div>
            <div className="text-lg font-serif text-[#f5f5f5] mt-0.5">{totalMappedCount} Accts</div>
          </div>

          <div 
            onClick={() => setActiveTab('macro-engine')}
            className={`p-3 bg-[#121212] border transition-colors cursor-pointer ${
              suspenseCount > 0 ? 'border-[#c5a059]/40 bg-[#c5a059]/5' : 'border-[#222]'
            }`}
          >
            <div className="text-[10px] text-[#888] uppercase tracking-wider flex items-center gap-1">
              <span>Suspense #900</span>
              {suspenseCount > 0 && <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-pulse"></span>}
            </div>
            <div className={`text-lg font-serif mt-0.5 ${suspenseCount > 0 ? 'text-[#c5a059]' : 'text-[#f5f5f5]'}`}>
              {suspenseCount} Items
            </div>
          </div>
        </div>
      </section>

      {/* Brief Extract Quote */}
      <div className="mt-auto p-5 bg-[#121212] border border-[#222] rounded-sm relative">
        <div className="absolute top-2 right-2 text-[#333] text-2xl font-serif">“</div>
        <p className="text-[11px] leading-relaxed italic text-[#999]">
          {CLIENT_DOSSIER.quote}
        </p>
        <div className="mt-3 text-[9px] uppercase tracking-widest text-[#c5a059] font-mono">
          — Prashantt, CPA & Accounting Faculty
        </div>
      </div>
    </aside>
  );
};
