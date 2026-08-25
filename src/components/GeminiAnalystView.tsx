import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight, Shield, Clock, BookOpen, CheckCircle2 } from 'lucide-react';

export const GeminiAnalystView: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const presets = [
    {
      id: 'summary',
      title: 'Executive Client Summary',
      query: 'Provide a structured executive briefing of what Prashantt (the client) is asking for regarding the Bank Macro SOP and Drake Accounting automation.',
    },
    {
      id: 'suspense',
      title: 'Suspense #900 Architecture',
      query: 'Explain the purpose and operational workflow of Suspense Account #900 in the client Bank Macro SOP, and how human-in-the-loop triage should work.',
    },
    {
      id: 'drake',
      title: 'Drake Accounting Bridge',
      query: 'Describe how the generated spreadsheet interacts with Drake Accounting (Tools -> Import -> Spreadsheets) and how keyboard macros can eliminate manual data entry.',
    },
    {
      id: 'roadmap',
      title: 'Engineering Implementation Plan',
      query: 'Draft a 3-phase technical implementation roadmap for automating bank CSV ingestion, recurring rule matching, and Drake export.',
    },
  ];

  const handleRunAnalysis = async (customQuery?: string) => {
    const queryToRun = customQuery || prompt;
    if (!queryToRun.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/analyze-video-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryToRun,
          videoContext: 'Client Meeting with Prashantt (PR Accounting & Faculty) regarding Bank Macro SOP, Drake Accounting import, 80-90% recurring transaction mapping, Suspense Account #900 triage, and automating grunt copy-paste work.',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.response);
      } else {
        setResponse(`Error: ${data.error || 'Failed to retrieve analysis'}`);
      }
    } catch (err: any) {
      setResponse(`Network Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setActivePreset(preset.id);
    setPrompt(preset.query);
    handleRunAnalysis(preset.query);
  };

  return (
    <div className="flex-1 p-6 lg:p-10 flex flex-col overflow-y-auto bg-[#0a0a0a]">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[#222]">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#c5a059] mb-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>Gemini 3.1 Pro Preview • Multimodal Reasoning Engine</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif italic text-[#f5f5f5]">
          AI Accounting & Workflow Analyst
        </h1>
        <p className="text-xs lg:text-sm text-[#888] mt-2 max-w-3xl font-light">
          Harness Google's advanced <span className="text-[#c5a059] font-medium">gemini-3.1-pro-preview</span> reasoning model to interrogate meeting requirements, audit SOP compliance, and draft system specifications.
        </p>
      </div>

      {/* Preset Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {presets.map(preset => (
          <div
            key={preset.id}
            onClick={() => handleSelectPreset(preset)}
            className={`p-4 border transition-all cursor-pointer flex flex-col justify-between group ${
              activePreset === preset.id
                ? 'bg-[#181818] border-[#c5a059]'
                : 'bg-[#121212] border-[#222] hover:border-[#3a3a3a]'
            }`}
          >
            <div>
              <div className="text-[9px] uppercase tracking-widest text-[#777] mb-1 font-mono">Preset Query</div>
              <h3 className="font-serif text-sm text-[#f5f5f5] group-hover:text-[#c5a059] transition-colors">
                {preset.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#c5a059] mt-3 uppercase tracking-wider font-medium">
              <span>Execute</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Query Input Bar */}
      <div className="bg-[#121212] border border-[#262626] p-4 flex flex-col gap-3 mb-8">
        <label className="text-[10px] uppercase tracking-widest text-[#888] font-mono">
          Custom Analysis Prompt for Gemini 3.1 Pro Preview:
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRunAnalysis()}
            placeholder="Ask anything about the client video, Bank Macro SOP, or Drake Accounting integration..."
            className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2.5 text-xs text-[#f5f5f5] focus:outline-none focus:border-[#c5a059] transition-colors placeholder-[#555]"
          />
          <button
            onClick={() => handleRunAnalysis()}
            disabled={loading || !prompt.trim()}
            className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d8b56f] disabled:opacity-50 text-[#0a0a0a] text-xs uppercase tracking-widest font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            {loading ? (
              <span className="animate-spin w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full"></span>
            ) : (
              <>
                <span>Analyze</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output Box */}
      <div className="flex-1 bg-[#121212] border border-[#222] p-6 lg:p-8 flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-[#222] mb-6">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#c5a059]" />
            <span className="text-xs uppercase tracking-widest text-[#f5f5f5] font-medium font-serif italic">
              Intelligence Briefing & Reasoning Result
            </span>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 bg-[#1a1a1a] border border-[#333] text-[#aaa] uppercase tracking-wider">
            Model: gemini-3.1-pro-preview
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-[#888] font-light">
              Synthesizing video intelligence and SOP logic using Gemini 3.1 Pro Preview...
            </p>
          </div>
        ) : response ? (
          <div className="prose prose-invert max-w-none text-xs lg:text-sm text-[#ddd] leading-relaxed font-light whitespace-pre-wrap">
            {response}
          </div>
        ) : (
          <div className="p-12 text-center text-[#666] flex flex-col items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#333] mb-2" />
            <p className="text-xs">Select a preset above or type a prompt to generate live analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
};
