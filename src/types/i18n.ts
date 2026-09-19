export type SupportedLanguage = 
  | 'en' // English (LTR)
  | 'ur' // Urdu (RTL)
  | 'ar' // Arabic (RTL)
  | 'de' // German (LTR)
  | 'fr' // French (LTR)
  | 'es' // Spanish (LTR)
  | 'tr' // Turkish (LTR)
  | 'zh' // Chinese (LTR)
  | 'hi' // Hindi (LTR)
  | 'pt' // Portuguese (LTR)
  | 'it' // Italian (LTR)
  | 'ja';// Japanese (LTR)

export type SupportedCurrency = 
  | 'USD'
  | 'PKR'
  | 'EUR'
  | 'GBP'
  | 'AED'
  | 'SAR'
  | 'QAR'
  | 'TRY'
  | 'INR'
  | 'CNY';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateAgainstUSD: number; // e.g. 1 USD = 278 PKR, 3.67 AED, 3.75 SAR, 0.92 EUR, 0.79 GBP, 3.64 QAR, 34.2 TRY, 83.5 INR, 7.24 CNY
  decimalDigits: number;
}

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export type ClientLifecycleStage =
  | 'DRAFT'
  | 'DESIGN_REVIEW'
  | 'REVISION_REQUESTED'
  | 'APPROVED'
  | 'PRODUCTION'
  | 'INSTALLATION'
  | 'COMPLETED'
  | 'DISMANTLED';

export interface ClientRevisionRequest {
  id: string;
  timestamp: string;
  requestedBy: string;
  role: string;
  comments: string;
  status: 'PENDING' | 'RESOLVED' | 'IN_PROGRESS';
  targetComponent: '3D_DESIGN' | 'BOQ_PRICING' | 'DIMENSIONS' | 'TIMELINE';
}
