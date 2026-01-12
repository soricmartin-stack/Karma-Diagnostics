
export interface KarmaScores {
  intentionClarity: number;
  actionIntegrity: number;
  positiveImpact: number;
  lessonDepth: number;
  spiritualGrowth: number;
}

export interface KarmaDiagnostic {
  simpleSummary: string;
  intent: string;
  action: string;
  ripening: string;
  wisdom: string;
  remedy: string;
  soulAdvice: string;
  overallBalance: 'Positive' | 'Neutral' | 'Constructive';
  scores: KarmaScores;
}

export interface FullSoulDiagnostic {
  deepInsights: string;
  harshTruth: string;
  hardInstructions: string;
  divineConnection: string;
}

export interface StoredResult {
  id: string;
  date: string;
  situation: string;
  diagnostic: KarmaDiagnostic;
}

export type AuthMethod = 'PASSWORD' | 'BIOMETRIC' | 'GOOGLE';

export interface UserProfile {
  name: string;
  email: string;
  language: string;
  authMethod: AuthMethod;
  lastReflectionDate?: string;
  history: StoredResult[];
}

export interface QuestionWithOptions {
  question: string;
  options: string[];
}

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export type LanguageCode = 'en' | 'de' | 'fr' | 'es' | 'it' | 'zh' | 'hi' | 'ar' | 'hr';

export type AppPhase = 'LANGUAGE_SELECT' | 'AUTH_CHOICE' | 'SIGN_UP' | 'AUTH_INPUT' | 'BIOMETRIC_SETUP' | 'DASHBOARD' | 'CHOICE' | 'QUESTIONING' | 'RESULT' | 'FULL_RESULT';

export interface DiagnosisState {
  loading: boolean;
  phase: AppPhase;
  language: LanguageCode;
  user: UserProfile | null;
  initialSituation: string;
  currentHistory: QuestionAnswer[];
  currentQuestions: QuestionWithOptions[];
  result: KarmaDiagnostic | null;
  fullResult: FullSoulDiagnostic | null;
  error: string | null;
}
