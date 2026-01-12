
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
    
    // Attempt to render the official Google button if GIS is loaded
    const google = (window as any).google;
    if (google && google.accounts && google.accounts.id) {
      google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "filled_blue", size: "large", width: 350, shape: "pill", logo_alignment: "left" }
      );
    }
  }, []);

  return (
    <div className="max-w-md mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10 px-6">
        <h2 className="text-3xl font-semibold text-[#4a453e] mb-3 leading-tight">
          {t.authChoiceTitle}
        </h2>
        <p className="text-sm text-[#a8a29e] font-light italic">
          Your journey is private and universally synced.
        </p>
      </div>

      <div className="flex flex-col gap-6 px-6">
        {/* Most Prominent Google Option */}
        <div className="flex flex-col items-center gap-4">
          <div id="googleSignInButton" className="w-full flex justify-center min-h-[50px]"></div>
          
          {/* Custom Stylized Google Button (Fallback/Bypass) */}
          <button 
            onClick={() => onSelect('GOOGLE')}
            className="w-full flex items-center justify-center gap-3 p-4 bg-white border-2 border-[#4285F4] text-[#4285F4] rounded-full font-semibold text-sm hover:bg-[#4285F4]/5 transition-all shadow-md active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t.useGoogle}
          </button>
        </div>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-[#e7e5e4]"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-[#a8a29e] uppercase tracking-[0.3em]">
            Other Ways
          </span>
          <div className="flex-grow border-t border-[#e7e5e4]"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onSelect('BIOMETRIC')}
            disabled={!canBiometric}
            className={`flex flex-col items-center gap-2 p-5 bg-white rounded-2xl border border-[#e7e5e4] hover:border-[#8b7e6a] transition-all active:scale-[0.98] ${!canBiometric ? 'opacity-40 grayscale cursor-not-allowed' : 'shadow-sm'}`}
          >
            <div className="w-10 h-10 flex items-center justify-center text-[#8b7e6a]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3v0m0 0V3a10.003 10.003 0 0110 10v0c0 .832-.074 1.646-.214 2.437m-3.332-4.856l-.048-.022a10 10 0 01-4.212-4.212l-.022-.048m-2.04 3.44l-.09.054A10.003 10.003 0 003 12h0m0 0h0a10.003 10.003 0 0110-10V3" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4a453e]">
              {t.useBiometrics}
            </span>
          </button>

          <button 
            onClick={() => onSelect('PASSWORD')}
            className="flex flex-col items-center gap-2 p-5 bg-white rounded-2xl border border-[#e7e5e4] hover:border-[#8b7e6a] transition-all active:scale-[0.98] shadow-sm"
          >
            <div className="w-10 h-10 flex items-center justify-center text-[#8b7e6a]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4a453e]">
              {t.usePassword}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;
