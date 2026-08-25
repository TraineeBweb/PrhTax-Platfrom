import { BankTransaction, AccountMappingRule } from '../types';

export const CHART_OF_ACCOUNTS = [
  { number: '1010', name: 'Operating Checking Account', type: 'Asset' },
  { number: '1020', name: 'Payroll Clearing Account', type: 'Asset' },
  { number: '2010', name: 'Accounts Payable', type: 'Liability' },
  { number: '4010', name: 'Client Retainer Revenue', type: 'Revenue' },
  { number: '4020', name: 'Tax Advisory Fees', type: 'Revenue' },
  { number: '5010', name: 'Office Rent & Lease', type: 'Expense' },
  { number: '5020', name: 'Cloud Software & Drake SaaS', type: 'Expense' },
  { number: '5030', name: 'Electric & Utility Services', type: 'Expense' },
  { number: '5040', name: 'Staff Compensation & Salaries', type: 'Expense' },
  { number: '5050', name: 'Professional Insurance (E&O)', type: 'Expense' },
  { number: '5060', name: 'Office Supplies & Logistics', type: 'Expense' },
  { number: '900', name: 'Suspense Account (Unclassified)', type: 'Suspense' },
];

export const INITIAL_MAPPING_RULES: AccountMappingRule[] = [
  { pattern: 'VANGUARD PROP MGMT RENT', accountNumber: '5010', accountName: 'Office Rent & Lease', category: 'Rent', confidence: 0.99 },
  { pattern: 'DRAKE SOFTWARE TECH INC', accountNumber: '5020', accountName: 'Cloud Software & Drake SaaS', category: 'Software', confidence: 0.98 },
  { pattern: 'PACIFIC GAS ELECTRIC UTIL', accountNumber: '5030', accountName: 'Electric & Utility Services', category: 'Utilities', confidence: 0.96 },
  { pattern: 'GUSTO PAYROLL SVCS', accountNumber: '5040', accountName: 'Staff Compensation & Salaries', category: 'Payroll', confidence: 0.99 },
];

export const MONTH_1_RAW_TRANSACTIONS: BankTransaction[] = [
  { id: 'tx-101', date: '01/02/2026', rawDescription: 'VANGUARD PROP MGMT RENT SUITE 400', amount: -4250.00, type: 'debit', status: 'pending' },
  { id: 'tx-102', date: '01/04/2026', rawDescription: 'DRAKE SOFTWARE TECH INC RENEWAL', amount: -1150.00, type: 'debit', status: 'pending' },
  { id: 'tx-103', date: '01/08/2026', rawDescription: 'PACIFIC GAS ELECTRIC UTIL DIRECT', amount: -380.45, type: 'debit', status: 'pending' },
  { id: 'tx-104', date: '01/15/2026', rawDescription: 'GUSTO PAYROLL SVCS TX-883921', amount: -14850.00, type: 'debit', status: 'pending' },
  { id: 'tx-105', date: '01/18/2026', rawDescription: 'CLIENT DEPOSIT ACME MFG CORP ADVISORY', amount: 8500.00, type: 'credit', status: 'pending' },
  { id: 'tx-106', date: '01/22/2026', rawDescription: 'AMAZON MKTPLACE SHREDDER AND TONER', amount: -245.80, type: 'debit', status: 'pending' },
  { id: 'tx-107', date: '01/25/2026', rawDescription: 'TRAVELERS CASUALTY INS PREM', amount: -650.00, type: 'debit', status: 'pending' },
  { id: 'tx-108', date: '01/29/2026', rawDescription: 'UNKNOWN WIRE TRANSFER VENDOR 992', amount: -1850.00, type: 'debit', status: 'pending' },
];

export const MONTH_2_RAW_TRANSACTIONS: BankTransaction[] = [
  { id: 'tx-201', date: '02/01/2026', rawDescription: 'VANGUARD PROP MGMT RENT SUITE 400', amount: -4250.00, type: 'debit', status: 'pending' },
  { id: 'tx-202', date: '02/03/2026', rawDescription: 'DRAKE SOFTWARE TECH INC ADDON', amount: -450.00, type: 'debit', status: 'pending' },
  { id: 'tx-203', date: '02/07/2026', rawDescription: 'PACIFIC GAS ELECTRIC UTIL DIRECT', amount: -412.10, type: 'debit', status: 'pending' },
  { id: 'tx-204', date: '02/15/2026', rawDescription: 'GUSTO PAYROLL SVCS TX-884102', amount: -14850.00, type: 'debit', status: 'pending' },
  { id: 'tx-205', date: '02/20/2026', rawDescription: 'TRAVELERS CASUALTY INS PREM', amount: -650.00, type: 'debit', status: 'pending' },
  { id: 'tx-206', date: '02/24/2026', rawDescription: 'CLIENT DEPOSIT SUMMIT DENTAL PARTNERS', amount: 6200.00, type: 'credit', status: 'pending' },
  { id: 'tx-207', date: '02/27/2026', rawDescription: 'NEW CAFE CATERING PARTNERS LUNCH', amount: -320.00, type: 'debit', status: 'pending' },
];
