
import React, { useState } from 'react';
import { QuestionWithOptions, QuestionAnswer } from '../types';

interface QuestionFlowProps {
  questions: QuestionWithOptions[];
  onComplete: (answers: QuestionAnswer[]) => void;
  onCancel?: () => void;
}

const QuestionFlow: React.FC<QuestionFlowProps> = ({ questions, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<QuestionAnswer[]>([]);
  
  const handleSelectOption = (option: string) => {
    const newHistory = [
      ...history,
      { question: questions[currentIndex].question, answer: option }
    ];
    
    if (currentIndex < questions.length - 1) {
      setHistory(newHistory);
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newHistory);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentIndex(currentIndex - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentQ = questions[currentIndex];

  return (
    <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBack}
              className="p-1 hover:bg-[#f5f1ea] rounded-full transition-colors"
              title="Previous Question"
            >
              <svg className="w-3 h-3 text-[#8b7e6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-[10px] font-bold text-[#8b7e6a] uppercase tracking-wider">
              Inquiry • {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <span className="text-[10px] text-[#a8a29e] font-bold uppercase">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-[#f5f1ea] h-1 rounded-full overflow-hidden">
          <div 
            className="bg-[#8b7e6a] h-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col min-h-[200px]">
        <h3 className="text-xl font-medium text-[#4a453e] mb-8 leading-snug">
          {currentQ.question}
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(option)}
              className="w-full text-left p-4 rounded-xl border border-[#e7e5e4] bg-[#faf9f6] hover:border-[#8b7e6a] hover:bg-white text-[#4a453e] text-sm transition-all active:scale-[0.99]"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionFlow;
