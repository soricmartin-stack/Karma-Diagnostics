
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

  const [loginData, setLoginData] = useState({ name: '', email: '', password: '' });
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

  const saveUser = (user: UserProfile, key: string) => {
    localStorage.setItem(`karma_user_${user.email.toLowerCase()}`, JSON.stringify({ user, key }));
  };

  const loadUserByEmail = (email: string): { user: UserProfile, key: string } | null => {
    const data = localStorage.getItem(`karma_user_${email.toLowerCase()}`);
    if (data) return JSON.parse(data);
    return null;
  };

  const handleLanguageSelect = (lang: LanguageCode) => {
    setState(prev => ({ ...prev, language: lang, phase: 'AUTH_CHOICE' }));
  };

  const handleAuthChoice = (method: AuthMethod) => {
    setAuthType(method);
    if (method === 'BIOMETRIC') setState(prev => ({ ...prev, phase: 'BIOMETRIC_SETUP' }));
    else setState(prev => ({ ...prev, phase: 'AUTH_INPUT' }));
  };

  const handleBiometricRegister = async (name: string, email: string) => {
    if (!name || !email) {
      setState(prev => ({ ...prev, error: "Please provide both name and email." }));
      return;
    }
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      const biometricKey = `bio_${email.toLowerCase()}`;
      const savedData = loadUserByEmail(email);
      let currentUser: UserProfile;
      if (savedData && savedData.key === biometricKey) currentUser = savedData.user;
      else {
        currentUser = { name, email, language: state.language, authMethod: 'BIOMETRIC', history: [] };
        saveUser(currentUser, biometricKey);
      }
      setState(prev => ({ ...prev, user: currentUser, phase: 'DASHBOARD', loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: "Authentication failed." }));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedData = loadUserByEmail(loginData.email);
    if (savedData && savedData.key === loginData.password) {
      setState(prev => ({ ...prev, user: savedData.user, phase: 'DASHBOARD', language: savedData.user.language as LanguageCode }));
    } else setState(prev => ({ ...prev, error: t.profileNotFound }));
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.name || !loginData.email || !loginData.password) {
      setState(prev => ({ ...prev, error: t.authError }));
      return;
    }
    const existing = loadUserByEmail(loginData.email);
    if (existing) {
      setState(prev => ({ ...prev, error: "Account exists." }));
      return;
    }
    const newUser: UserProfile = {
      name: loginData.name, email: loginData.email, language: state.language, authMethod: 'PASSWORD', history: []
    };
    saveUser(newUser, loginData.password);
    setState(prev => ({ ...prev, user: newUser, phase: 'DASHBOARD' }));
  };

  const handleStartReflection = async (situation: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const questions = await generateQuestionsWithOptions(situation, [], 'specific', state.language);
      setState(prev => ({
        ...prev, loading: false, initialSituation: situation, currentQuestions: questions, phase: 'QUESTIONING', error: null
      }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: "Try again." }));
    }
  };

  const handleFinishQuestionsBatch = async (batchAnswers: QuestionAnswer[]) => {
    const fullHistory = [...state.currentHistory, ...batchAnswers];
    setState(prev => ({ ...prev, loading: true, currentHistory: fullHistory }));
    try {
      const diagnostic = await diagnoseKarma(state.initialSituation, fullHistory, state.language);
      const now = new Date().toISOString();
      const newResult: StoredResult = { id: Date.now().toString(), date: now, situation: state.initialSituation, diagnostic };
      const updatedUser: UserProfile = { ...state.user!, history: [...state.user!.history, newResult], lastReflectionDate: now };
      const key = authType === 'BIOMETRIC' ? `bio_${state.user!.email.toLowerCase()}` : loginData.password;
      saveUser(updatedUser, key);
      setState(prev => ({ ...prev, loading: false, user: updatedUser, phase: 'RESULT', result: diagnostic, currentHistory: fullHistory }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: "Analysis failed." }));
    }
  };

  const handleRunFullDiagnostic = async () => {
    if (!state.user || state.user.history.length === 0) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await generateFullSoulDiagnostic(state.user.history, state.language);
      setState(prev => ({ ...prev, loading: false, phase: 'FULL_RESULT', fullResult: result }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: "Failed to analyze transformation." }));
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
    const { phase, user } = state;
    if (phase === 'AUTH_CHOICE') setState(prev => ({ ...prev, phase: 'LANGUAGE_SELECT' }));
    else if (phase === 'BIOMETRIC_SETUP' || phase === 'AUTH_INPUT') setState(prev => ({ ...prev, phase: 'AUTH_CHOICE' }));
    else if (phase === 'SIGN_UP') setState(prev => ({ ...prev, phase: 'AUTH_INPUT' }));
    else if (phase === 'CHOICE' || phase === 'RESULT' || phase === 'FULL_RESULT') setState(prev => ({ ...prev, phase: 'DASHBOARD' }));
    else if (phase === 'QUESTIONING') setState(prev => ({ ...prev, phase: 'CHOICE' }));
  };

  const renderContent = () => {
    switch (state.phase) {
      case 'LANGUAGE_SELECT': return <LanguageSelector onSelect={handleLanguageSelect} />;
      case 'AUTH_CHOICE': return <AuthChoice onSelect={handleAuthChoice} t={t} />;
      case 'BIOMETRIC_SETUP':
        return (
          <div className="max-w-xs mx-auto glass-panel p-6 rounded-3xl border border-[#e7e5e4] text-center shadow-xl animate-slow-fade">
            <h2 className="text-lg font-semibold text-[#4a453e] mb-1">{t.useBiometrics}</h2>
            <p className="text-[10px] text-[#a8a29e] mb-6 leading-tight">{t.biometricSub}</p>
            <div className="space-y-3 mb-6">
              <input type="text" className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] outline-none text-sm focus:border-[#8b7e6a] shadow-inner" placeholder={t.nameLabel} value={loginData.name} onChange={(e) => setLoginData({...loginData, name: e.target.value})} />
              <input type="email" className="w-full px-4 py-3 rounded-xl bg-[#faf9f6] border border-[#e7e5e4] outline-none text-sm focus:border-[#8b7e6a] shadow-inner" placeholder={t.emailLabel} value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} />
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleBiometricRegister(loginData.name, loginData.email)} className="w-full py-4 bg-[#8b7e6a] text-white font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#7a6d59] transition-all active:scale-[0.98] shadow-lg"> {t.registerBiometric} </button>
              <button onClick={handleGlobalBack} className="w-full py-3 text-[#a8a29e] font-bold uppercase text-[9px] tracking-widest hover:text-[#8b7e6a] transition-all"> Back </button>
            </div>
          </div>
        );
      case 'AUTH_INPUT':
        return (
          <div className="max-w-xs mx-auto glass-panel p-6 rounded-3xl shadow-xl animate-slow-fade">
            <h2 className="text-xl font-semibold text-[#4a453e] mb-6 text-center tracking-tight">{t.setupPasswordTitle}</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" className="w-full px-4 py-3 rounded-xl bg-[#faf9f6]/50 border border-[#e7e5e4] outline-none text-sm focus:border-[#8b7e6a] transition-all shadow-inner" value={loginData.email} placeholder={t.emailLabel} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
              <input type="password" className="w-full px-4 py-3 rounded-xl bg-[#faf9f6]/50 border border-[#e7e5e4] outline-none text-sm focus:border-[#8b7e6a] transition-all shadow-inner" value={loginData.password} placeholder={t.passwordLabel} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
              <button type="submit" className="w-full py-4 bg-[#8b7e6a] text-white font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#7a6d59] transition-all active:scale-[0.98] shadow-lg"> {t.enterBtn} </button>
            </form>
            <div className="mt-4 flex flex-col items-center gap-2"> 
              <button onClick={() => setState(prev => ({ ...prev, phase: 'SIGN_UP' }))} className="text-[#a8a29e] text-[9px] font-bold uppercase tracking-widest hover:text-[#8b7e6a]"> {t.signUpToggle} </button> 
              <button onClick={handleGlobalBack} className="text-[#a8a29e] text-[9px] font-bold uppercase tracking-widest hover:text-[#8b7e6a]"> Back </button>
            </div>
          </div>
        );
      case 'SIGN_UP':
        return (
          <div className="max-w-xs mx-auto glass-panel p-6 rounded-3xl shadow-xl animate-slow-fade">
            <h2 className="text-xl font-semibold text-[#4a453e] mb-6 text-center tracking-tight">{t.setupSignUpTitle}</h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <input type="text" className="w-full px-4 py-3 rounded-xl bg-[#faf9f6]/50 border border-[#e7e5e4] outline-none text-sm focus:border-[#8b7e6a] transition-all shadow-inner" value={loginData.name} placeholder={t.nameLabel} onChange={(e) => setLoginData({...loginData, name: e.target.value})} required />
              <input type="email" className="w-full px-4 py-3 rounded-xl bg-[#faf9f6]/50 border border-[#e7e5e4] outline-none text-sm focus:border-[#8b7e6a] transition-all shadow-inner" value={loginData.email} placeholder={t.emailLabel} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
              <input type="password" className="w-full px-4 py-3 rounded-xl bg-[#faf9f6]/50 border border-[#e7e5e4] outline-none text-sm focus:border-[#8b7e6a] transition-all shadow-inner" value={loginData.password} placeholder={t.passwordLabel} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
              <button type="submit" className="w-full py-4 bg-[#4a453e] text-white font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#3d3933] transition-all active:scale-[0.98] shadow-lg"> {t.signUpBtn} </button>
            </form>
            <div className="mt-4 flex flex-col items-center gap-2"> 
              <button onClick={() => setState(prev => ({ ...prev, phase: 'AUTH_INPUT' }))} className="text-[#a8a29e] text-[9px] font-bold uppercase tracking-widest hover:text-[#8b7e6a]"> {t.loginToggle} </button> 
              <button onClick={handleGlobalBack} className="text-[#a8a29e] text-[9px] font-bold uppercase tracking-widest hover:text-[#8b7e6a]"> Back </button>
            </div>
          </div>
        );
      case 'DASHBOARD':
        return state.user && (
          <ProgressDashboard t={t} user={state.user} onNewSession={() => setState(prev => ({ ...prev, phase: 'CHOICE' }))} onFullDiagnostic={handleRunFullDiagnostic} onViewResult={(item) => setState(prev => ({ ...prev, phase: 'RESULT', result: item.diagnostic, initialSituation: item.situation, currentHistory: [] }))} />
        );
      case 'CHOICE':
        return (
          <div className="max-w-xl mx-auto space-y-4">
             <div className="text-center py-2 animate-slow-fade">
                <h2 className="text-2xl font-semibold text-[#4a453e] leading-tight mb-1">
                  {t.heartGreeting.replace('{name}', state.user?.name || '')}
                </h2>
                <div className="w-12 h-px bg-[#8b7e6a]/20 mx-auto"></div>
             </div>
             <DiagnosticForm t={t} onSubmit={handleStartReflection} loading={state.loading} />
             {showChoiceDashboard && (
               <div className="text-center animate-slow-fade mt-4">
                  <button onClick={() => setState(prev => ({ ...prev, phase: 'DASHBOARD' }))} className="text-[#a8a29e] text-[8px] font-bold uppercase tracking-[0.4em] hover:text-[#8b7e6a]">
                    {t.dashboard}
                  </button>
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
              t={t} 
              result={state.result} 
              user={state.user}
              onFullDiagnostic={handleRunFullDiagnostic}
              onWriteAgain={handleResetForNewReflection}
              onRefine={(mode) => {
                setState(prev => ({ ...prev, loading: true, error: null }));
                generateQuestionsWithOptions(state.initialSituation, state.currentHistory, mode, state.language)
                  .then(nextBatch => setState(prev => ({ ...prev, loading: false, phase: 'QUESTIONING', currentQuestions: nextBatch, result: null })))
                  .catch(() => setState(prev => ({ ...prev, loading: false, error: "Failed." })));
              }} 
              onRestart={() => setState(prev => ({ ...prev, phase: 'DASHBOARD', initialSituation: '', currentHistory: [], currentQuestions: [], result: null, fullResult: null, error: null }))} 
              isRefining={state.loading} 
            />
          </div>
        );
      case 'FULL_RESULT':
        return state.fullResult && <FullSoulDiagnosticResult t={t} result={state.fullResult} onBack={() => setState(prev => ({ ...prev, phase: 'DASHBOARD', fullResult: null }))} />;
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
          title="Return"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
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
