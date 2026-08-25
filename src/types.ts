export interface BankTransaction {
  id: string;
  date: string;
  rawDescription: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'pending' | 'mapped' | 'suspense';
  assignedAccount?: string;
  accountName?: string;
  isRecurring?: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  accountNumber: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  status: 'verified' | 'suspense_900';
}

export interface AccountMappingRule {
  pattern: string;
  accountNumber: string;
  accountName: string;
  category: string;
  confidence: number;
}

export interface VideoKeyMoment {
  timestamp: string;
  seconds: number;
  title: string;
  speaker: string;
  summary: string;
  category: 'context' | 'workflow' | 'macro' | 'drake' | 'ai_strategy';
}
