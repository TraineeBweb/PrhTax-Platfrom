import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Download, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  ArrowRight, 
  Sparkles,
  Search,
  BookOpen,
  Layers,
  HelpCircle
} from 'lucide-react';
import { BankTransaction, JournalEntry, AccountMappingRule } from '../types';
import { CHART_OF_ACCOUNTS, INITIAL_MAPPING_RULES, MONTH_1_RAW_TRANSACTIONS, MONTH_2_RAW_TRANSACTIONS } from '../data/mockBankData';

interface MacroEngineViewProps {
  mappingRules: AccountMappingRule[];
  setMappingRules: React.Dispatch<React.SetStateAction<AccountMappingRule[]>>;
  suspenseCount: number;
}

export const MacroEngineView: React.FC<MacroEngineViewProps> = ({
  mappingRules,
  setMappingRules,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<'month1' | 'month2'>('month1');
  const [transactions, setTransactions] = useState<BankTransaction[]>(MONTH_1_RAW_TRANSACTIONS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [macroExecuted, setMacroExecuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'raw' | 'journal' | 'rules' | 'exception'>('raw');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTxForTriage, setSelectedTxForTriage] = useState<BankTransaction | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Switch between Month 1 and Month 2 sample datasets
  const handleSelectMonth = (month: 'month1' | 'month2') => {
    setSelectedMonth(month);
    setTransactions(month === 'month1' ? MONTH_1_RAW_TRANSACTIONS : MONTH_2_RAW_TRANSACTIONS);
    setJournalEntries([]);
    setMacroExecuted(false);
  };

  // Run the "First Month Setup" / "Subsequent Month Batch" macro logic
  const handleExecuteMacro = () => {
    const newJournalEntries: JournalEntry[] = [];
    const updatedTxs: BankTransaction[] = [];

    transactions.forEach((tx, index) => {
      // Find rule in learned mapping rules
      const matchedRule = mappingRules.find(rule => 
        tx.rawDescription.toUpperCase().includes(rule.pattern.toUpperCase())
      );

      const refNumber = `JE-2026-${String(index + 1).padStart(3, '0')}`;
      const isExpense = tx.amount < 0;
      const absAmount = Math.abs(tx.amount);

      if (matchedRule) {
        // Mapped with Known Account
        updatedTxs.push({
          ...tx,
          status: 'mapped',
          assignedAccount: matchedRule.accountNumber,
          accountName: matchedRule.accountName,
          isRecurring: true,
        });

        // Double-entry balancing (Operating Cash 1010 + Expense/Revenue Account)
        if (isExpense) {
          // Debit Expense Account
          newJournalEntries.push({
            id: `${tx.id}-dr`,
            date: tx.date,
            reference: refNumber,
            accountNumber: matchedRule.accountNumber,
            accountName: matchedRule.accountName,
            description: tx.rawDescription,
            debit: absAmount,
            credit: 0,
            status: 'verified',
          });
          // Credit Operating Cash 1010
          newJournalEntries.push({
            id: `${tx.id}-cr`,
            date: tx.date,
            reference: refNumber,
            accountNumber: '1010',
            accountName: 'Operating Checking Account',
            description: `Payment: ${tx.rawDescription}`,
            debit: 0,
            credit: absAmount,
            status: 'verified',
          });
        } else {
          // Debit Operating Cash 1010
          newJournalEntries.push({
            id: `${tx.id}-dr`,
            date: tx.date,
            reference: refNumber,
            accountNumber: '1010',
            accountName: 'Operating Checking Account',
            description: `Deposit: ${tx.rawDescription}`,
            debit: absAmount,
            credit: 0,
            status: 'verified',
          });
          // Credit Revenue Account
          newJournalEntries.push({
            id: `${tx.id}-cr`,
            date: tx.date,
            reference: refNumber,
            accountNumber: matchedRule.accountNumber,
            accountName: matchedRule.accountName,
            description: tx.rawDescription,
            debit: 0,
            credit: absAmount,
            status: 'verified',
          });
        }
      } else {
        // Suspense Account #900 routing
        updatedTxs.push({
          ...tx,
          status: 'suspense',
          assignedAccount: '900',
          accountName: 'Suspense Account (Unclassified)',
          isRecurring: false,
        });

        if (isExpense) {
          // Debit Suspense 900
          newJournalEntries.push({
            id: `${tx.id}-dr`,
            date: tx.date,
            reference: refNumber,
            accountNumber: '900',
            accountName: 'Suspense Account (Unclassified)',
            description: `[TRIAGE NEEDED] ${tx.rawDescription}`,
            debit: absAmount,
            credit: 0,
            status: 'suspense_900',
          });
          // Credit Cash 1010
          newJournalEntries.push({
            id: `${tx.id}-cr`,
            date: tx.date,
            reference: refNumber,
            accountNumber: '1010',
            accountName: 'Operating Checking Account',
            description: `Payment: ${tx.rawDescription}`,
            debit: 0,
            credit: absAmount,
            status: 'suspense_900',
          });
        } else {
          // Debit Cash 1010
          newJournalEntries.push({
            id: `${tx.id}-dr`,
            date: tx.date,
            reference: refNumber,
            accountNumber: '1010',
            accountName: 'Operating Checking Account',
            description: `Deposit: ${tx.rawDescription}`,
            debit: absAmount,
            credit: 0,
            status: 'suspense_900',
          });
          // Credit Suspense 900
          newJournalEntries.push({
            id: `${tx.id}-cr`,
            date: tx.date,
            reference: refNumber,
            accountNumber: '900',
            accountName: 'Suspense Account (Unclassified)',
            description: `[TRIAGE NEEDED] ${tx.rawDescription}`,
            debit: 0,
            credit: absAmount,
            status: 'suspense_900',
          });
        }
      }
    });

    setTransactions(updatedTxs);
    setJournalEntries(newJournalEntries);
    setMacroExecuted(true);
    setActiveTab('journal');
  };

  // Assign GL Account from Suspense #900 and optionally memorize rule
  const handleAssignAccount = (txId: string, accountNum: string, accountName: string, savePattern: boolean) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    // Update transaction
    const updatedTxs = transactions.map(t => {
      if (t.id === txId) {
        return {
          ...t,
          status: 'mapped' as const,
          assignedAccount: accountNum,
          accountName: accountName,
        };
      }
      return t;
    });

    // Update journal entries
    const updatedEntries = journalEntries.map(entry => {
      if (entry.id.startsWith(txId) && entry.accountNumber === '900') {
        return {
          ...entry,
          accountNumber: accountNum,
          accountName: accountName,
          description: tx.rawDescription,
          status: 'verified' as const,
        };
      }
      if (entry.id.startsWith(txId)) {
        return {
          ...entry,
          status: 'verified' as const,
        };
      }
      return entry;
    });

    // Learn mapping pattern for subsequent months
    if (savePattern) {
      const keyword = tx.rawDescription.split(' ')[0] + ' ' + (tx.rawDescription.split(' ')[1] || '');
      const existing = mappingRules.find(r => r.pattern.toUpperCase() === keyword.toUpperCase());
      if (!existing) {
        setMappingRules(prev => [
          ...prev,
          {
            pattern: keyword,
            accountNumber: accountNum,
            accountName: accountName,
            category: 'User Trained',
            confidence: 1.0,
          },
        ]);
      }
    }

    setTransactions(updatedTxs);
    setJournalEntries(updatedEntries);
    setSelectedTxForTriage(null);
  };

  // Export formatted CSV for Drake Accounting
  const handleExportDrakeCSV = () => {
    if (journalEntries.length === 0) return;

    const headers = ['Date', 'Reference', 'Account Number', 'Account Title', 'Description', 'Debit', 'Credit'];
    const rows = journalEntries.map(entry => [
      entry.date,
      entry.reference,
      entry.accountNumber,
      `"${entry.accountName}"`,
      `"${entry.description}"`,
      entry.debit > 0 ? entry.debit.toFixed(2) : '0.00',
      entry.credit > 0 ? entry.credit.toFixed(2) : '0.00',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Drake_Accounting_Journal_Entries_${selectedMonth}_Import.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`Exported ${journalEntries.length} lines formatted for Drake Accounting Spreadsheet Import.`);
    setTimeout(() => setExportNotice(null), 5000);
  };

  const currentSuspenseItems = transactions.filter(t => t.status === 'suspense');
  const totalDebits = journalEntries.reduce((acc, curr) => acc + curr.debit, 0);
  const totalCredits = journalEntries.reduce((acc, curr) => acc + curr.credit, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01 && journalEntries.length > 0;

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto bg-[#0a0a0a]">
      {/* Top Controller Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#222]">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#c5a059] mb-1 font-medium">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Bank Macro SOP Engine • Drake Accounting Bridge</span>
          </div>
          <h1 className="text-3xl font-serif italic text-[#f5f5f5]">
            Bank Statement to Journal Entry Automation
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Month Selector Toggle */}
          <div className="inline-flex p-1 bg-[#141414] border border-[#2a2a2a] rounded-sm text-xs">
            <button
              onClick={() => handleSelectMonth('month1')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                selectedMonth === 'month1' ? 'bg-[#222] text-[#f5f5f5] font-medium' : 'text-[#777] hover:text-[#bbb]'
              }`}
            >
              Month 1 (Initial Setup)
            </button>
            <button
              onClick={() => handleSelectMonth('month2')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                selectedMonth === 'month2' ? 'bg-[#222] text-[#f5f5f5] font-medium' : 'text-[#777] hover:text-[#bbb]'
              }`}
            >
              Month 2 (Recurring Rules)
            </button>
          </div>

          {/* Execute Button */}
          <button
            onClick={handleExecuteMacro}
            className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4b068] text-[#0a0a0a] font-semibold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-[#c5a059]/10"
          >
            <Play className="w-3.5 h-3.5 fill-[#0a0a0a]" />
            <span>{selectedMonth === 'month1' ? 'Run "First Month Setup"' : 'Run Recurring Batch'}</span>
          </button>
        </div>
      </div>

      {/* Export Notice Notification */}
      {exportNotice && (
        <div className="mt-4 p-3 bg-[#162218] border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{exportNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono">Drake Ready</span>
        </div>
      )}

      {/* Status Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="p-4 bg-[#121212] border border-[#222]">
          <div className="text-[10px] uppercase tracking-wider text-[#777]">Statement Ingestion</div>
          <div className="text-xl font-serif text-[#f5f5f5] mt-1 flex items-center justify-between">
            <span>{transactions.length} Transactions</span>
            <span className="text-[10px] text-[#c5a059] font-mono uppercase bg-[#1a1a1a] px-2 py-0.5 border border-[#333]">
              {selectedMonth === 'month1' ? 'M1 Setup' : 'M2 Batch'}
            </span>
          </div>
          <p className="text-[11px] text-[#666] mt-1 font-light">3 Core Fields: Date, Raw Desc, Amount</p>
        </div>

        <div className="p-4 bg-[#121212] border border-[#222]">
          <div className="text-[10px] uppercase tracking-wider text-[#777]">Suspense Account #900</div>
          <div className="text-xl font-serif mt-1 flex items-center justify-between">
            <span className={currentSuspenseItems.length > 0 ? 'text-[#c5a059]' : 'text-emerald-400'}>
              {currentSuspenseItems.length} Exceptions
            </span>
            {currentSuspenseItems.length > 0 && (
              <span className="text-[10px] text-[#c5a059] animate-pulse">Needs Triage</span>
            )}
          </div>
          <p className="text-[11px] text-[#666] mt-1 font-light">Unrecognized GL items flagged for CPA</p>
        </div>

        <div className="p-4 bg-[#121212] border border-[#222]">
          <div className="text-[10px] uppercase tracking-wider text-[#777]">Memorized Vendor Rules</div>
          <div className="text-xl font-serif text-[#f5f5f5] mt-1 flex items-center justify-between">
            <span>{mappingRules.length} Rules Active</span>
            <span className="text-[10px] text-emerald-400 font-mono">80-90% Target</span>
          </div>
          <p className="text-[11px] text-[#666] mt-1 font-light">Rent, Drake Software, Utilities, Gusto</p>
        </div>

        <div className="p-4 bg-[#121212] border border-[#222]">
          <div className="text-[10px] uppercase tracking-wider text-[#777]">Drake Balance Check</div>
          <div className="text-xl font-serif mt-1 flex items-center justify-between">
            <span className={isBalanced ? 'text-emerald-400' : 'text-[#777]'}>
              {isBalanced ? 'Balanced ($' + totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ')' : 'Pending Execution'}
            </span>
            {isBalanced && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <p className="text-[11px] text-[#666] mt-1 font-light">Debits == Credits (Double Entry)</p>
        </div>
      </div>

      {/* Subnavigation Tabs */}
      <div className="flex items-center justify-between mt-8 border-b border-[#222]">
        <div className="flex gap-6 text-xs uppercase tracking-wider font-medium">
          <button
            onClick={() => setActiveTab('journal')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'journal' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-[#888] hover:text-[#ccc]'
            }`}
          >
            <span>Drake Journal Entries</span>
            {journalEntries.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#222] text-[#bbb] text-[10px] rounded">
                {journalEntries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('raw')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'raw' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-[#888] hover:text-[#ccc]'
            }`}
          >
            <span>Raw Statement CSV (Date / Desc / Amt)</span>
            <span className="px-1.5 py-0.2 bg-[#222] text-[#bbb] text-[10px] rounded">
              {transactions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('exception')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'exception' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-[#888] hover:text-[#ccc]'
            }`}
          >
            <span>Suspense #900 Exception Report</span>
            {currentSuspenseItems.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#c5a059]/20 text-[#c5a059] text-[10px] rounded">
                {currentSuspenseItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'rules' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-[#888] hover:text-[#ccc]'
            }`}
          >
            <span>Mapping Rule Matrix</span>
            <span className="px-1.5 py-0.2 bg-[#222] text-[#bbb] text-[10px] rounded">
              {mappingRules.length}
            </span>
          </button>
        </div>

        {/* Right Tab Actions */}
        {journalEntries.length > 0 && (
          <button
            onClick={handleExportDrakeCSV}
            className="mb-2 px-3 py-1.5 bg-[#171717] hover:bg-[#222] text-[#c5a059] border border-[#2e2e2e] text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Drake CSV</span>
          </button>
        )}
      </div>

      {/* TAB CONTENT: Journal Entries Table (Formatted for Drake Accounting) */}
      {activeTab === 'journal' && (
        <div className="mt-6 flex-1 flex flex-col">
          {journalEntries.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-[#262626] bg-[#0e0e0e] flex flex-col items-center justify-center">
              <FileSpreadsheet className="w-10 h-10 text-[#444] mb-3" />
              <h3 className="font-serif text-xl text-[#f5f5f5] mb-1">No Journal Entries Generated Yet</h3>
              <p className="text-xs text-[#888] max-w-md mb-6 font-light">
                Click the <strong className="text-[#c5a059]">Run "First Month Setup"</strong> button above to execute the macro SOP logic and create balanced double-entry records.
              </p>
              <button
                onClick={handleExecuteMacro}
                className="px-4 py-2 bg-[#c5a059] text-[#0a0a0a] text-xs uppercase tracking-widest font-semibold cursor-pointer"
              >
                Execute Macro SOP Now
              </button>
            </div>
          ) : (
            <div className="border border-[#222] bg-[#121212] overflow-hidden">
              <div className="p-4 bg-[#161616] border-b border-[#222] flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#aaa] font-medium">
                  Drake Accounting Journal Entry Matrix • Double-Entry Verification
                </span>
                <span className="text-[11px] font-mono text-[#c5a059]">
                  Total Debit: ${totalDebits.toFixed(2)} | Total Credit: ${totalCredits.toFixed(2)}
                </span>
              </div>

              <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f0f0f] text-[#777] uppercase tracking-wider text-[10px] border-b border-[#222] sticky top-0">
                    <tr>
                      <th className="py-3 px-4 font-medium">Date</th>
                      <th className="py-3 px-4 font-medium">Ref #</th>
                      <th className="py-3 px-4 font-medium">Acct #</th>
                      <th className="py-3 px-4 font-medium">Account Title</th>
                      <th className="py-3 px-4 font-medium">Description</th>
                      <th className="py-3 px-4 font-medium text-right">Debit ($)</th>
                      <th className="py-3 px-4 font-medium text-right">Credit ($)</th>
                      <th className="py-3 px-4 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1c1c] text-[#ccc]">
                    {journalEntries.map(entry => (
                      <tr key={entry.id} className="hover:bg-[#181818] transition-colors">
                        <td className="py-2.5 px-4 font-mono text-[#aaa]">{entry.date}</td>
                        <td className="py-2.5 px-4 font-mono text-[#888]">{entry.reference}</td>
                        <td className="py-2.5 px-4 font-mono font-medium text-[#e5e5e5]">
                          <span className={entry.accountNumber === '900' ? 'text-[#c5a059] bg-[#c5a059]/10 px-1.5 py-0.5 rounded border border-[#c5a059]/30' : ''}>
                            {entry.accountNumber}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-[#ddd]">{entry.accountName}</td>
                        <td className="py-2.5 px-4 text-[#888] max-w-xs truncate">{entry.description}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-[#f5f5f5]">
                          {entry.debit > 0 ? entry.debit.toFixed(2) : '-'}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-[#f5f5f5]">
                          {entry.credit > 0 ? entry.credit.toFixed(2) : '-'}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {entry.status === 'verified' ? (
                            <span className="px-2 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 text-[9px] uppercase tracking-wider rounded">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 text-[9px] uppercase tracking-wider rounded animate-pulse">
                              Suspense #900
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Raw Statement CSV */}
      {activeTab === 'raw' && (
        <div className="mt-6 border border-[#222] bg-[#121212] overflow-hidden">
          <div className="p-4 bg-[#161616] border-b border-[#222] flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#aaa] font-medium">
              3 Core Columns Extraction: Date, Raw Description, Amount
            </span>
            <span className="text-[11px] text-[#888] font-mono">
              Dataset: {selectedMonth === 'month1' ? 'January Statement (Month 1)' : 'February Statement (Month 2)'}
            </span>
          </div>

          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f0f0f] text-[#777] uppercase tracking-wider text-[10px] border-b border-[#222] sticky top-0">
                <tr>
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium">Raw Bank Description</th>
                  <th className="py-3 px-4 font-medium text-right">Amount ($)</th>
                  <th className="py-3 px-4 font-medium text-center">Type</th>
                  <th className="py-3 px-4 font-medium">Assigned Account</th>
                  <th className="py-3 px-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c] text-[#ccc]">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-[#181818] transition-colors">
                    <td className="py-3 px-4 font-mono text-[#aaa]">{tx.date}</td>
                    <td className="py-3 px-4 font-mono text-[#e5e5e5]">{tx.rawDescription}</td>
                    <td className={`py-3 px-4 text-right font-mono font-medium ${tx.amount < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {tx.amount < 0 ? `-${Math.abs(tx.amount).toFixed(2)}` : `+${tx.amount.toFixed(2)}`}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider rounded ${tx.type === 'debit' ? 'bg-[#1e1e1e] text-[#aaa]' : 'bg-emerald-950/40 text-emerald-400'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {tx.assignedAccount ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[#c5a059]">{tx.assignedAccount}</span>
                          <span className="text-[#888] truncate text-[11px]">— {tx.accountName}</span>
                        </div>
                      ) : (
                        <span className="text-[#555] italic">Pending Macro Run</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedTxForTriage(tx)}
                        className="px-2.5 py-1 bg-[#1c1c1c] hover:bg-[#282828] text-[#c5a059] border border-[#333] text-[10px] uppercase tracking-wider rounded cursor-pointer"
                      >
                        {tx.status === 'suspense' ? 'Triage #900' : 'Map Acct'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Suspense #900 Exception Report */}
      {activeTab === 'exception' && (
        <div className="mt-6 flex-1 flex flex-col gap-6">
          <div className="p-5 bg-[#141414] border border-[#c5a059]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a059] font-medium mb-1">
                <AlertTriangle className="w-4 h-4 text-[#c5a059]" />
                <span>CPA Triage Station: Suspense Account #900 Exceptions</span>
              </div>
              <p className="text-xs text-[#888] max-w-2xl font-light">
                As Prashantt explained in the meeting, any transaction without an established keyword rule defaults to 
                <strong className="text-[#e5e5e5]"> Account #900</strong> so the balance stays in check while awaiting human classification.
              </p>
            </div>
            <div className="px-4 py-2 bg-[#0d0d0d] border border-[#2a2a2a] text-right">
              <div className="text-[10px] uppercase tracking-widest text-[#777]">Unresolved Items</div>
              <div className="text-xl font-serif text-[#c5a059]">{currentSuspenseItems.length} Items</div>
            </div>
          </div>

          {currentSuspenseItems.length === 0 ? (
            <div className="p-12 text-center border border-[#222] bg-[#121212]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-serif text-2xl text-[#f5f5f5] mb-1">All Transactions Successfully Classified</h3>
              <p className="text-xs text-[#888]">Zero items remaining in Suspense Account #900. Ready for Drake Accounting import.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSuspenseItems.map(tx => (
                <div key={tx.id} className="p-5 bg-[#121212] border border-[#2a2a2a] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#777] mb-2 font-mono">
                      <span>{tx.date}</span>
                      <span className="text-rose-400 font-medium">${Math.abs(tx.amount).toFixed(2)}</span>
                    </div>
                    <h4 className="font-mono text-sm text-[#f5f5f5] mb-2">{tx.rawDescription}</h4>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 text-[10px] uppercase tracking-wider rounded">
                      <span>Currently: #900 Suspense</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#1f1f1f] flex items-center justify-between">
                    <span className="text-[11px] text-[#666]">Assign GL Account & Memorize:</span>
                    <button
                      onClick={() => setSelectedTxForTriage(tx)}
                      className="px-3 py-1.5 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0a0a0a] text-xs uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      Assign Account
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Mapping Rule Matrix */}
      {activeTab === 'rules' && (
        <div className="mt-6 border border-[#222] bg-[#121212] overflow-hidden">
          <div className="p-4 bg-[#161616] border-b border-[#222] flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#aaa] font-medium">
                Recurring Rule Knowledge Base (80–90% Match Target)
              </span>
              <p className="text-[11px] text-[#666] font-light mt-0.5">
                Automatically matches subsequent monthly bank statements based on substring patterns.
              </p>
            </div>
            <span className="text-xs font-mono text-[#c5a059]">{mappingRules.length} Rules Active</span>
          </div>

          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f0f0f] text-[#777] uppercase tracking-wider text-[10px] border-b border-[#222]">
                <tr>
                  <th className="py-3 px-4 font-medium">Description Pattern Match</th>
                  <th className="py-3 px-4 font-medium">Assigned GL Number</th>
                  <th className="py-3 px-4 font-medium">Account Title</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c] text-[#ccc]">
                {mappingRules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-[#181818] transition-colors">
                    <td className="py-3 px-4 font-mono text-[#c5a059] font-medium">{rule.pattern}</td>
                    <td className="py-3 px-4 font-mono text-[#e5e5e5]">{rule.accountNumber}</td>
                    <td className="py-3 px-4 text-[#ddd]">{rule.accountName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-[#1a1a1a] text-[#aaa] border border-[#2e2e2e] text-[9px] uppercase tracking-wider rounded">
                        {rule.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400">
                      {(rule.confidence * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Triage & Assign Account */}
      {selectedTxForTriage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#333] w-full max-w-lg p-6 lg:p-8 flex flex-col gap-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[#c5a059] font-medium">
                GL Account Classification
              </div>
              <button
                onClick={() => setSelectedTxForTriage(null)}
                className="text-[#777] hover:text-[#f5f5f5] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#0e0e0e] p-4 border border-[#222] rounded-sm">
              <div className="text-[10px] text-[#666] uppercase tracking-widest">Transaction Details</div>
              <div className="font-mono text-sm text-[#f5f5f5] mt-1">{selectedTxForTriage.rawDescription}</div>
              <div className="flex items-center justify-between mt-2 text-xs font-mono">
                <span className="text-[#888]">{selectedTxForTriage.date}</span>
                <span className={selectedTxForTriage.amount < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                  ${Math.abs(selectedTxForTriage.amount).toFixed(2)} ({selectedTxForTriage.type})
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#aaa] uppercase tracking-wider block mb-2 font-medium">
                Select Chart of Accounts Destination:
              </label>
              <div className="max-h-56 overflow-y-auto divide-y divide-[#1f1f1f] border border-[#222] bg-[#0f0f0f]">
                {CHART_OF_ACCOUNTS.filter(a => a.number !== '900').map(account => (
                  <div
                    key={account.number}
                    onClick={() => handleAssignAccount(selectedTxForTriage.id, account.number, account.name, true)}
                    className="p-3 hover:bg-[#1c1c1c] cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#c5a059] group-hover:text-white">
                        #{account.number}
                      </span>
                      <span className="text-xs text-[#ddd]">{account.name}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#181818] border border-[#282828] text-[#888]">
                      {account.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[#777] italic">
              * Selecting an account automatically trains the rule engine to recognize future recurring charges from this vendor.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
