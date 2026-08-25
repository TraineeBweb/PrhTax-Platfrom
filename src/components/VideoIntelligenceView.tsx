import React, { useState } from 'react';
import { Video, Play, Clock, Sparkles, User, Tag, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { VIDEO_KEY_MOMENTS } from '../data/videoTranscriptData';
import { VideoKeyMoment } from '../types';

export const VideoIntelligenceView: React.FC = () => {
  const [selectedMoment, setSelectedMoment] = useState<VideoKeyMoment>(VIDEO_KEY_MOMENTS[3]);
  const [filter, setFilter] = useState<string>('all');

  const filteredMoments = filter === 'all' 
    ? VIDEO_KEY_MOMENTS 
    : VIDEO_KEY_MOMENTS.filter(m => m.category === filter);

  return (
    <div className="flex-1 p-6 lg:p-10 flex flex-col overflow-y-auto bg-[#0a0a0a]">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[#222]">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#c5a059] mb-1 font-medium">
          <Video className="w-3.5 h-3.5" />
          <span>Multimodal Meeting Intelligence • Gemini 3.1 Pro Video Understanding</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif italic text-[#f5f5f5]">
          Client Meeting Analysis & Timestamped Key Moments
        </h1>
        <p className="text-xs lg:text-sm text-[#888] mt-2 max-w-3xl font-light">
          Breakdown of the 18-minute client session with Prashantt (PR Financial & Accounting Faculty), detailing the Bank Macro SOP, Drake software boundaries, Suspense 900 rules, and Keystroke/Macro automation.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left Column: Interactive Timeline List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-2">
            {[
              { id: 'all', label: 'All Moments' },
              { id: 'macro', label: 'Bank Macro SOP' },
              { id: 'workflow', label: 'Suspense #900' },
              { id: 'drake', label: 'Drake Accounting' },
              { id: 'ai_strategy', label: 'AI & Automation' },
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setFilter(pill.id)}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider border transition-colors cursor-pointer ${
                  filter === pill.id
                    ? 'bg-[#c5a059] text-[#0a0a0a] border-[#c5a059] font-semibold'
                    : 'bg-[#141414] text-[#888] border-[#262626] hover:text-[#e5e5e5]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto max-h-[580px] pr-1">
            {filteredMoments.map((moment, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedMoment(moment)}
                className={`p-4 border transition-all cursor-pointer flex flex-col gap-2 ${
                  selectedMoment.title === moment.title
                    ? 'bg-[#181818] border-[#c5a059] shadow-md shadow-[#c5a059]/5'
                    : 'bg-[#121212] border-[#222] hover:border-[#333]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#c5a059] px-2 py-0.5 bg-[#1e1a12] border border-[#c5a059]/30 rounded-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {moment.timestamp}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#666]">
                    {moment.speaker}
                  </span>
                </div>

                <h3 className="font-serif text-base text-[#f5f5f5] leading-snug">
                  {moment.title}
                </h3>

                <p className="text-[11px] text-[#777] line-clamp-2 font-light leading-relaxed">
                  {moment.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Deep-Dive Card (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-[#121212] border border-[#262626] p-6 lg:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#222]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5a059] font-medium font-mono">
                Moment Breakdown • {selectedMoment.timestamp}
              </span>
            </div>
            <span className="px-2.5 py-0.5 bg-[#1a1a1a] border border-[#333] text-[9px] text-[#aaa] uppercase tracking-wider">
              Category: {selectedMoment.category}
            </span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-serif italic text-[#f5f5f5] mt-4 mb-2">
            {selectedMoment.title}
          </h2>

          <div className="flex items-center gap-2 text-xs text-[#888] mb-6">
            <User className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Key Speakers: <strong className="text-[#bbb]">{selectedMoment.speaker}</strong></span>
          </div>

          {/* Transcript & Summary Extract */}
          <div className="bg-[#0e0e0e] border border-[#222] p-5 rounded-sm mb-6">
            <h4 className="text-[10px] uppercase tracking-widest text-[#777] mb-2 font-mono">
              Key Insights & Client Intent
            </h4>
            <p className="text-sm text-[#ddd] leading-relaxed font-light">
              {selectedMoment.summary}
            </p>
          </div>

          {/* Actionable Engineering Translation */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] uppercase tracking-widest text-[#c5a059] font-mono">
              System Engineering Directives
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-[#151515] border border-[#222]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-[#eee]">Automated Trigger:</strong> Ingest bank statement CSV containing Date, Raw Description, and Amount without requiring manual Excel copy-pasting.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#151515] border border-[#222]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-[#eee]">Suspense #900 Protocol:</strong> Unmatched raw descriptions automatically populate Account #900 and trigger a priority triage view for CPAs.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#151515] border border-[#222]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-[#eee]">Drake Format Parity:</strong> Output standard double-entry records compatible with Drake Accounting's spreadsheet importer for zero-friction reconciliation.
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-auto pt-6 border-t border-[#1f1f1f] flex items-center justify-between text-[10px] text-[#666] font-mono">
            <span>Video Reference: Meeting_2026_08_24.mp4</span>
            <span>Analyzed by Gemini 3.1 Pro Preview</span>
          </div>
        </div>
      </div>
    </div>
  );
};
