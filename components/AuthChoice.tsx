
import React, { useEffect, useState } from 'react';
import { AuthMethod } from '../types';

interface AuthChoiceProps {
  onSelect: (method: AuthMethod) => void;
  t: any;
}

const AuthChoice: React.FC<AuthChoiceProps> = ({ onSelect, t }) => {
  const [canBiometric, setCanBiometric] = useState<boolean>(false);

  useEffect(() => {
    if (window.PublicKeyCredential) {
      if (PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
          .then(result => setCanBiometric(result))
          .catch(() => setCanBiometric(false));
      }
    }
  }, []);

  return (
    <div className="max-w-md mx-auto py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-semibold text-[#4a453e] text-center mb-6 leading-snug">
        {t.authChoiceTitle}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => onSelect('BIOMETRIC')}
          disabled={!canBiometric}
          className={`group flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#e7e5e4] hover:border-[#8b7e6a] transition-all active:scale-[0.98] text-left ${!canBiometric ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
          <div className="w-10 h-10 flex-shrink-0 bg-[#f5f1ea] rounded-xl flex items-center justify-center group-hover:bg-[#8b7e6a] transition-colors">
            <svg className="w-5 h-5 text-[#8b7e6a] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3v0m0 0V3a10.003 10.003 0 0110 10v0c0 .832-.074 1.646-.214 2.437m-3.332-4.856l-.048-.022a10 10 0 01-4.212-4.212l-.022-.048m-2.04 3.44l-.09.054A10.003 10.003 0 003 12h0m0 0h0a10.003 10.003 0 0110-10V3" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#4a453e]">{t.useBiometrics}</h3>
            <p className="text-[10px] text-[#a8a29e] line-clamp-1">{canBiometric ? t.biometricSub : t.biometricNotSupported}</p>
          </div>
        </button>

        <button
          onClick={() => onSelect('PASSWORD')}
          className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#e7e5e4] hover:border-[#8b7e6a] transition-all active:scale-[0.98] text-left"
        >
          <div className="w-10 h-10 flex-shrink-0 bg-[#f5f1ea] rounded-xl flex items-center justify-center group-hover:bg-[#8b7e6a] transition-colors">
            <svg className="w-5 h-5 text-[#8b7e6a] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#4a453e]">{t.usePassword}</h3>
            <p className="text-[10px] text-[#a8a29e] line-clamp-1">{t.passwordSub}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AuthChoice;
