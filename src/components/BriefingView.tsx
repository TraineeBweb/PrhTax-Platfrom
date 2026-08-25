import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Play, FileSpreadsheet, KeyRound, Cpu, Layers } from 'lucide-react';

interface BriefingViewProps {
  onStartMacro: () => void;
  onOpenAi: () => void;
  onOpenVideoIntel: () => void;
}

export const BriefingView: React.FC<BriefingViewProps> = ({
  onStartMacro,
  onOpenAi,
  onOpenVideoIntel,
}) => {
  return (
    <section className="flex-1 p-8 lg:p-12 flex flex-col overflow-y-auto">
      {/* Title & Intro Header */}
      <div className="mb-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#262626] mb-4 text-[10px] uppercase tracking-[0.2em] text-[#c5a059] font-medium">
          <Sparkles className="w-3 h-3 text-[#c5a059]" />
          Executive Synthesis • Video & SOP Analysis
        </div>
        <h1 className="text-4xl lg:text-5xl font-serif italic text-[#f5f5f5] mb-4 tracking-tight leading-tight">
          The Primary Inquiry & Automation Blueprint
        </h1>
        <p className="text-[#888] text-sm lg:text-base max-w-3xl leading-relaxed font-light">
          The client (Prashantt, CPA) requires an automated pipeline to ingest bank statement CSVs, execute the standard 
          <span className="text-[#e5e5e5] font-normal"> Bank Macro SOP</span>, isolate unknown transactions into 
          <span className="text-[#c5a059] font-medium"> Suspense Account #900</span> for CPA triage, learn recurring vendor mappings, 
          and output verified journal entries directly into <span className="text-[#e5e5e5] font-normal">Drake Accounting</span>.
        </p>
      </div>

      {/* 4 Architectural Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 flex-1 max-w-6xl">
        {/* Card 1: Core Automation Ask */}
        <div className="bg-[#121212] border border-[#222] p-8 flex flex-col justify-between hover:border-[#333] transition-all group">
          <div>
            <div className="text-[#c5a059] text-[11px] mb-3 uppercase tracking-[3px] font-semibold flex items-center justify-between">
              <span>The Core Ask</span>
              <span className="text-[9px] text-[#666] font-mono">Phase 01</span>
            </div>
            <h2 className="text-2xl font-serif text-[#f5f5f5] mb-3 group-hover:text-[#c5a059] transition-colors">
              Zero-Touch Bank CSV Ingestion
            </h2>
            <p className="text-sm text-[#888] leading-relaxed font-light">
              Automatic extraction of the 3 essential data columns: <strong className="text-[#bbb]">Date</strong>, <strong className="text-[#bbb]">Raw Description</strong>, and <strong className="text-[#bbb]">Amount</strong>. Eliminates error-prone manual copy-pasting into Excel templates.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="bg-[#1a1a1a] px-3 py-1 text-[9px] uppercase border border-[#333] text-[#aaa] tracking-wider">
              Date / Desc / Amount
            </span>
            <span className="bg-[#1a1a1a] px-3 py-1 text-[9px] uppercase border border-[#333] text-[#aaa] tracking-wider">
              VBA Modernization
            </span>
          </div>
        </div>

        {/* Card 2: Suspense #900 & Rule Memory */}
        <div className="bg-[#121212] border border-[#222] p-8 flex flex-col justify-between hover:border-[#333] transition-all group">
          <div>
            <div className="text-[#c5a059] text-[11px] mb-3 uppercase tracking-[3px] font-semibold flex items-center justify-between">
              <span>Intelligence & Exception Triage</span>
              <span className="text-[9px] text-[#666] font-mono">Phase 02</span>
            </div>
            <h2 className="text-2xl font-serif text-[#f5f5f5] mb-3 group-hover:text-[#c5a059] transition-colors">
              Suspense Account #900 & 80-90% Rule Memory
            </h2>
            <p className="text-sm text-[#888] leading-relaxed font-light">
              Transactions without known GL account rules route to <span className="text-[#c5a059]">Suspense #900</span>. When staff assigns an account, the system persists the rule, automating 80–90% of recurring monthly overheads (Rent, Utilities, Drake Software).
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="bg-[#1a1a1a] px-3 py-1 text-[9px] uppercase border border-[#333] text-[#aaa] tracking-wider">
              Suspense #900 Triage
            </span>
            <span className="bg-[#1a1a1a] px-3 py-1 text-[9px] uppercase border border-[#333] text-[#aaa] tracking-wider">
              Recurring Match Engine
            </span>
          </div>
        </div>

        {/* Card 3: Drake Accounting Integration */}
        <div className="bg-[#121212] border border-[#222] p-8 flex flex-col justify-between hover:border-[#333] transition-all group">
          <div>
            <div className="text-[#c5a059] text-[11px] mb-3 uppercase tracking-[3px] font-semibold flex items-center justify-between">
              <span>Target Ecosystem</span>
              <span className="text-[9px] text-[#666] font-mono">Phase 03</span>
            </div>
            <h2 className="text-2xl font-serif text-[#f5f5f5] mb-3 group-hover:text-[#c5a059] transition-colors">
              Drake Accounting Import & Reconciliation
            </h2>
            <p className="text-sm text-[#888] leading-relaxed font-light">
              Formatting generated double-entry journal entries for seamless ingestion via <code className="text-[11px] bg-[#1a1a1a] px-1.5 py-0.5 text-[#bbb]">Drake Accounting → Tools → Import → Spreadsheets</code> to enable balanced bank reconciliation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="bg-[#1a1a1a] px-3 py-1 text-[9px] uppercase border border-[#333] text-[#aaa] tracking-wider">
              Double-Entry Format
            </span>
            <span className="bg-[#1a1a1a] px-3 py-1 text-[9px] uppercase border border-[#333] text-[#aaa] tracking-wider">
              Drake Import Matrix
            </span>
          </div>
        </div>

        {/* Card 4: Action Card matching Design Mockup */}
        <div className="bg-[#181818] border border-[#c5a059]/40 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-[#c5a059] transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#c5a059]/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="w-14 h-14 border border-[#c5a059] rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 bg-[#0d0d0d]">
            <ArrowRight className="w-6 h-6 text-[#c5a059] -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </div>

          <h2 className="text-2xl font-serif italic text-[#f5f5f5] mb-2">
            Launch Bank Macro Engine
          </h2>
          <p className="text-xs text-[#888] max-w-xs mb-6 font-light">
            Process Month 1 bank statement CSV, view live Suspense #900 allocations, and export for Drake Accounting.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={onStartMacro}
              className="flex-1 py-2.5 px-4 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0a0a0a] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c5a059]/10"
            >
              <span>Run Macro SOP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenAi}
              className="py-2.5 px-4 bg-[#1e1e1e] hover:bg-[#282828] text-[#e5e5e5] border border-[#333] text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>AI Analyst</span>
            </button>
          </div>

          <p className="text-[9px] uppercase tracking-widest text-[#666] mt-4 font-mono">
            Compliant with Drake SOP 2026 Guidelines
          </p>
        </div>
      </div>

      {/* Quick Summary Highlights Strip */}
      <div className="mt-10 p-6 bg-[#0f0f0f] border border-[#222] max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-[#333] bg-[#141414] flex items-center justify-center text-[#c5a059]">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-[#bbb] font-medium">Verified SOP Structure</div>
            <div className="text-[11px] text-[#777]">Date, Raw Description, Amount → First Month Setup → Suspense #900 Triage → Drake Export</div>
          </div>
        </div>

        <button
          onClick={onOpenVideoIntel}
          className="px-4 py-2 bg-[#171717] hover:bg-[#222] border border-[#2e2e2e] text-xs text-[#c5a059] uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-[#c5a059]" />
          <span>View Meeting Timestamps</span>
        </button>
      </div>
    </section>
  );
};
