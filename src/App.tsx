import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BriefingView } from './components/BriefingView';
import { MacroEngineView } from './components/MacroEngineView';
import { VideoIntelligenceView } from './components/VideoIntelligenceView';
import { GeminiAnalystView } from './components/GeminiAnalystView';
import { AccountMappingRule } from './types';
import { INITIAL_MAPPING_RULES } from './data/mockBankData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('briefing');
  const [mappingRules, setMappingRules] = useState<AccountMappingRule[]>(INITIAL_MAPPING_RULES);
  const [suspenseCount, setSuspenseCount] = useState<number>(4);

  return (
    <div className="w-full h-screen bg-[#0a0a0a] text-[#e5e5e5] flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        suspenseCount={suspenseCount}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Dossier & Telemetry Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          suspenseCount={suspenseCount}
          totalMappedCount={mappingRules.length}
        />

        {/* Dynamic Center Stage */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'briefing' && (
            <BriefingView
              onStartMacro={() => setActiveTab('macro-engine')}
              onOpenAi={() => setActiveTab('ai-analyst')}
              onOpenVideoIntel={() => setActiveTab('video-moments')}
            />
          )}

          {activeTab === 'macro-engine' && (
            <MacroEngineView
              mappingRules={mappingRules}
              setMappingRules={setMappingRules}
              suspenseCount={suspenseCount}
            />
          )}

          {activeTab === 'video-moments' && (
            <VideoIntelligenceView />
          )}

          {activeTab === 'ai-analyst' && (
            <GeminiAnalystView />
          )}
        </div>
      </main>

      {/* Footer matching Sophisticated Dark design */}
      <footer className="h-12 border-t border-[#2a2a2a] px-6 lg:px-10 flex items-center justify-between text-[10px] tracking-widest uppercase text-[#666] bg-[#0d0d0d] shrink-0 select-none">
        <div className="flex items-center gap-2">
          <span className="text-[#c5a059]">Ref:</span>
          <span>ARC-REQ-8842-DK</span>
        </div>
        <div className="hidden sm:block">
          Confidential Information &copy; 2026 Aurelius Systems & PR Financial Group
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span>System Status: Synced</span>
        </div>
      </footer>
    </div>
  );
}
