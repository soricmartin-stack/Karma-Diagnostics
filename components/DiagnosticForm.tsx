
import React, { useState, useMemo, useEffect, useRef } from 'react';

interface DiagnosticFormProps {
  onSubmit: (situation: string) => void;
  loading: boolean;
  t: any;
}

const DiagnosticForm: React.FC<DiagnosticFormProps> = ({ onSubmit, loading, t }) => {
  const [situation, setSituation] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const promptsCount = t.prompts.length;
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setCurrentPromptIndex(dayOfYear % promptsCount);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setSituation(prev => prev + event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, [t.prompts]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const selectedPrompt = useMemo(() => t.prompts[currentPromptIndex], [t.prompts, currentPromptIndex]);
  const visibleExamples = useMemo(() => [...t.examples].sort(() => 0.5 - Math.random()).slice(0, 3), [t.examples]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) recognitionRef.current?.stop();
    if (situation.trim()) onSubmit(situation);
  };

  return (
    <div className="relative glass-panel rounded-3xl overflow-hidden shadow-xl animate-slow-fade max-w-lg mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-[#8b7e6a]/5 to-transparent animate-breathe pointer-events-none"></div>
      
      <form onSubmit={handleSubmit} className="relative p-6 md:p-10">
        <div className="mb-4 text-center md:text-left">
          <h3 className="text-[8px] font-bold text-[#8b7e6a] uppercase tracking-widest mb-1 opacity-70">{t.dailyReflection}</h3>
          <label className="block text-lg md:text-2xl font-semibold text-[#4a453e] leading-tight">
            {selectedPrompt}
          </label>
        </div>
        
        <div className="relative group/field">
          <textarea
            className="w-full h-32 md:h-48 p-4 pr-10 text-sm md:text-lg text-[#4a453e] bg-[#faf9f6]/80 rounded-2xl border border-[#e7e5e4] focus:border-[#8b7e6a] outline-none transition-all resize-none shadow-inner placeholder:text-[#a8a29e]/50"
            placeholder={t.reflectPlaceholder}
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            disabled={loading}
          />
          
          {recognitionRef.current && (
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition-all active:scale-90 ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-[#a8a29e] hover:text-[#8b7e6a]'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2 opacity-0 animate-slow-fade stagger-1">
          {visibleExamples.map((example: string, idx: number) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSituation(example.replace(/\.\.\.$/, ''))}
              className="text-[10px] px-3 py-1 bg-[#f5f1ea]/50 border border-[#e7e5e4] rounded-full text-[#7c7267] hover:border-[#8b7e6a] transition-all"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 opacity-0 animate-slow-fade stagger-2">
          <div className="flex items-center gap-1.5 text-[8px] text-[#a8a29e] font-bold uppercase tracking-wider opacity-60">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>{t.encryptedSpace}</span>
          </div>

          <button
            type="submit"
            disabled={loading || !situation.trim()}
            className={`w-full md:w-auto px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all shadow-lg active:scale-[0.98] ${
              loading || !situation.trim() ? 'bg-[#d6d3d1] cursor-not-allowed' : 'bg-[#8b7e6a] hover:bg-[#7a6d59]'
            }`}
          >
            {loading ? t.sensing : t.beginBtn}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiagnosticForm;
