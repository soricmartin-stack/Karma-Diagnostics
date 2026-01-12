
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProgressDashboard from './components/ProgressDashboard';
import DiagnosticForm from './components/DiagnosticForm';
import DiagnosticResult from './components/DiagnosticResult';
import QuestionFlow from './components/QuestionFlow';
import FullSoulDiagnosticResult from './components/FullSoulDiagnosticResult';
import LanguageSelector from './components/LanguageSelector';
import AuthChoice from './components/AuthChoice';
import { diagnoseKarma, generateQuestionsWithOptions, generateFullSoulDiagnostic } from './services/geminiService';
import { DiagnosisState, QuestionAnswer, UserProfile, StoredResult, LanguageCode, AuthMethod } from './types';
import { translations } from './translations';

// Universal Sync Integration
import { firestoreService, authService, formatDate } from './firebase-integration.ts';

const App: React.FC = () => {
  const [state, setState] = useState<DiagnosisState>({
    loading: false,
    phase: 'LANGUAGE_SELECT',
    language: 'en',
    user: null,
    initialSituation: '',
    currentHistory: [],
    currentQuestions: [],
    result: null,
    fullResult: null,
    error: null,
  });

  const [authType, setAuthType] = useState<AuthMethod | null>(null);
  const [showChoiceDashboard, setShowChoiceDashboard] = useState(false);

  const t = translations[state.language] || translations['en'];

  useEffect(() => {
    if (state.phase === 'CHOICE') {
      const timer = setTimeout(() => setShowChoiceDashboard(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowChoiceDashboard(false);
    }
  }, [state.phase]);

  const handleLanguageSelect = (lang: LanguageCode) => {
    setState(prev => ({ ...prev, language: lang, phase: 'AUTH_CHOICE' }));
  };

  const handleAuthChoice = async (method: AuthMethod) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      let user: UserProfile | null = null;
      
      if (method === 'GOOGLE') {
        user = await authService.signInWithGoogle();
        setAuthType('GOOGLE');
      } else {
        // Fallback for Biometric/Password simulation
        user = await firestoreService.getUserProfile('guest@soul.com');
        if (!user) {
          user = { 
            name: "Soul Guest", 
            email: "guest@soul.com", 
            language: state.language, 
            authMethod: method, 
            history: [] 
          };
          await firestoreService.saveUserProfile(user);
        }
        setAuthType(method);
      }

      // Ensure history is fresh using reflections.getAll pattern
      const reflections = await firestoreService.reflections.getAll(user!.email);
      user!.history = reflections;

      setState(prev => ({ 
        ...prev, 
        user, 
        phase: 'DASHBOARD', 
        loading: false,
        language: (user?.language as LanguageCode) || prev.language
      }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: "Universal Sync Failed. Try again." }));
    }
  };

  const handleStartReflection = async (situation: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const questions = await generateQuestionsWithOptions(situation, [], 'specific', state.language);
      setState(prev => ({
        ...prev, loading: false, initialSituation: situation, currentQuestions: questions, phase: 'QUESTIONING', error: null
      }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: "Connection interrupted. Please try again." }));
    }
  };

  const handleFinishQuestionsBatch = async (batchAnswers: QuestionAnswer[]) => {
    const fullHistory = [...state.currentHistory, ...batchAnswers];
    setState(prev => ({ ...prev, loading: true, currentHistory: fullHistory }));
    try {
      // Analyze with Gemini Karma Tool
      const diagnostic = await diagnoseKarma(state.initialSituation, fullHistory, state.language);
      
      if (state.user) {
        // Create new reflection entry using standardized service method
        const newEntry = await firestoreService.reflections.create({
          content: state.initialSituation,
          userId: state.user.email,
          diagnostic: diagnostic
        });
        
        // Update local state with the newly synced record
        const updatedUser: UserProfile = { 
          ...state.user, 
          history: [...state.user.history, newEntry], 
          lastReflectionDate: newEntry.date 
        };
        
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          user: updatedUser, 
          phase: 'RESULT', 
          result: diagnostic, 
          currentHistory: fullHistory 
        }));
      }
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: "Sync failed. Your progress is saved locally." }));
    }
  };

  const handleRunFullDiagnostic = async () => {
    if (!state.user || state.user.history.length === 0) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await generateFullSoulDiagnostic(state.user.history, state.language);
      setState(prev => ({ ...prev, loading: false, phase: 'FULL_RESULT', fullResult: result }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: "Pattern analysis failed." }));
    }
  };

  const handleResetForNewReflection = () => {
    setState(prev => ({
      ...prev,
      phase: 'CHOICE',
      initialSituation: '',
      currentHistory: [],
      currentQuestions: [],
      result: null,
      fullResult: null,
      error: null
    }));
  };

  const handleGlobalBack = () => {
    const { phase } = state;
    if (phase === 'AUTH_CHOICE') setState(prev => ({ ...prev, phase: 'LANGUAGE_SELECT' }));
    else if (phase === 'CHOICE' || phase === 'RESULT' || phase === 'FULL_RESULT') setState(prev => ({ ...prev, phase: 'DASHBOARD' }));
    else if (phase === 'QUESTIONING') setState(prev => ({ ...prev, phase: 'CHOICE' }));
  };

  const renderContent = () => {
    switch (state.phase) {
      case 'LANGUAGE_SELECT': return <LanguageSelector onSelect={handleLanguageSelect} />;
      case 'AUTH_CHOICE': return <AuthChoice onSelect={handleAuthChoice} t={t} />;
      case 'DASHBOARD':
        return state.user && (
          <ProgressDashboard 
            t={t} 
            user={state.user} 
            onNewSession={() => setState(prev => ({ ...prev, phase: 'CHOICE' }))} 
            onFullDiagnostic={handleRunFullDiagnostic} 
            onViewResult={(item) => setState(prev => ({ ...prev, phase: 'RESULT', result: item.diagnostic, initialSituation: item.situation, currentHistory: [] }))} 
          />
        );
      case 'CHOICE':
        return (
          <div className="max-w-xl mx-auto space-y-4">
             <div className="text-center py-2 animate-slow-fade">
                <h2 className="text-2xl font-semibold text-[#4a453e] leading-tight mb-1"> {t.heartGreeting.replace('{name}', state.user?.name || '')} </h2>
             </div>
             <DiagnosticForm t={t} onSubmit={handleStartReflection} loading={state.loading} />
             {showChoiceDashboard && (
               <div className="text-center animate-slow-fade mt-4">
                  <button onClick={() => setState(prev => ({ ...prev, phase: 'DASHBOARD' }))} className="text-[#a8a29e] text-[8px] font-bold uppercase tracking-[0.4em]"> {t.dashboard} </button>
               </div>
             )}
          </div>
        );
      case 'QUESTIONING':
        return <div className="max-w-md mx-auto animate-slow-fade"><QuestionFlow questions={state.currentQuestions} onComplete={handleFinishQuestionsBatch} onCancel={handleGlobalBack} /></div>;
      case 'RESULT':
        return state.result && (
          <div className="max-w-3xl mx-auto animate-slow-fade">
            <DiagnosticResult 
              t={t} result={state.result} user={state.user}
              onFullDiagnostic={handleRunFullDiagnostic}
              onWriteAgain={handleResetForNewReflection}
              onRefine={(mode) => {
                setState(prev => ({ ...prev, loading: true }));
                generateQuestionsWithOptions(state.initialSituation, state.currentHistory, mode, state.language)
                  .then(next => setState(prev => ({ ...prev, loading: false, phase: 'QUESTIONING', currentQuestions: next, result: null })))
                  .catch(() => setState(prev => ({ ...prev, loading: false, error: "Failed to deepen exploration." })));
              }} 
              onRestart={() => setState(prev => ({ ...prev, phase: 'DASHBOARD' }))} 
              isRefining={state.loading} 
            />
          </div>
        );
      case 'FULL_RESULT':
        return state.fullResult && <FullSoulDiagnosticResult t={t} result={state.fullResult} onBack={() => setState(prev => ({ ...prev, phase: 'DASHBOARD' }))} />;
      default: return null;
    }
  };

  const showReturnButton = state.phase !== 'LANGUAGE_SELECT' && state.phase !== 'DASHBOARD';

  return (
    <div className="min-h-screen pb-12 px-4 md:px-12 transition-all duration-1000 overflow-y-auto relative">
      {showReturnButton && (
        <button 
          onClick={handleGlobalBack}
          className="fixed top-6 left-6 z-40 p-3 text-[#a8a29e] hover:text-[#8b7e6a] bg-white/10 hover:bg-white/50 backdrop-blur-sm rounded-full transition-all active:scale-90"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
      )}
      <div className="max-w-3xl mx-auto flex flex-col min-h-screen">
        <Header subText={t?.headerSub} />
        <main className="relative flex-grow pb-8">
          {state.error && <div className="max-w-xs mx-auto mb-4 p-4 glass-panel text-red-600 rounded-2xl text-center text-[10px] font-bold uppercase tracking-widest">{state.error}</div>}
          {renderContent()}
        </main>
      </div>
      {state.loading && (
        <div className="fixed inset-0 bg-[#fdfbf7]/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-[3px] border-[#f5f1ea] border-t-[#8b7e6a] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#8b7e6a] text-[10px] font-bold tracking-[0.2em] uppercase">{t.analyzing}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
