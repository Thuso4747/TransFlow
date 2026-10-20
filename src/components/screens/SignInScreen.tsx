import React, { useState } from 'react';
import { ScreenId, CommuterUser } from '../../types/transit';
import { ArrowLeft, ArrowRight, AtSign, Eye, EyeOff, HelpCircle, Lock, X } from 'lucide-react';
import transflowLogo from '../../assets/transflow-logo.png';

interface SignInProps {
  onNavigate: (screen: ScreenId) => void;
  commuter: CommuterUser;
  onLoginSuccess: (user: Partial<CommuterUser>) => void;
}

export const SignInScreen: React.FC<SignInProps> = ({ onNavigate, commuter, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Enter your email or mobile number.');
      return;
    }
    if (!pin.trim() && authMode === 'password') {
      setErrorMessage('Enter your password or PIN.');
      return;
    }

    setErrorMessage('');
    const userName = identifier.includes('@') ? identifier.split('@')[0] : 'Commuter';
    setSuccessNotice('Signed in. Opening Plan…');
    onLoginSuccess({
      mobileNumber: identifier.includes('@') ? commuter.mobileNumber : identifier,
      email: identifier.includes('@') ? identifier : undefined,
      isLoggedIn: true,
      fullName: commuter.fullName && commuter.fullName !== 'Guest' ? commuter.fullName : userName,
    });

    setTimeout(() => {
      onNavigate('home-dashboard');
    }, 600);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col max-w-md mx-auto bg-[#f7f6f2]">
      <header className="grid grid-cols-3 items-center py-3 px-4">
        <button
          type="button"
          onClick={() => onNavigate('onboarding-3')}
          className="p-1 -ml-1 justify-self-start text-[#0d1747]"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <img
          src={transflowLogo}
          alt="TransFlow"
          className="h-8 w-auto object-contain justify-self-center"
        />
        <button
          type="button"
          onClick={() => setShowHelp((open) => !open)}
          className="p-1 -mr-1 justify-self-end text-[#0d1747]"
          title="Help"
        >
          <HelpCircle className="w-5 h-5 stroke-[2.2]" />
        </button>
      </header>

      <div className="px-5 pt-4 pb-8 flex-1 flex flex-col">
        {showHelp && (
          <div className="mb-5 flex items-start justify-between gap-3 border-b border-[#ece9e0] pb-4">
            <div>
              <p className="text-[15px] font-semibold text-[#0d1747]">Need help?</p>
              <p className="mt-0.5 text-sm text-[#555d71]">0860 562 874 · support@transflow.joburg</p>
            </div>
            <button type="button" onClick={() => setShowHelp(false)} className="p-1 text-[#0d1747]" aria-label="Close help">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
          Welcome back.
        </h1>
        <p className="mt-2 mb-7 text-sm text-[#555d71] leading-relaxed">
          Sign in to your saved journeys and live trip alerts.
        </p>

        {errorMessage && (
          <p className="mb-4 text-sm font-medium text-[#c62828]">{errorMessage}</p>
        )}
        {successNotice && (
          <p className="mb-4 text-sm font-medium text-[#6a8a2e]">{successNotice}</p>
        )}

        <form onSubmit={handleSignIn} className="flex-1 flex flex-col">
          <label className="flex items-center gap-3 py-2.5">
            <AtSign className="w-4 h-4 text-[#0d1747] shrink-0" />
            <span className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
              <span className="block text-[12px] text-[#687085]">Email or mobile</span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Select or type your details"
                className="w-full bg-transparent text-[15px] font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
              />
            </span>
          </label>

          {authMode === 'password' ? (
            <div className="flex items-center gap-3 py-2.5">
              <Lock className="w-4 h-4 text-[#0d1747] shrink-0" />
              <div className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12px] text-[#687085]">Password</span>
                  <button
                    type="button"
                    onClick={() => setSuccessNotice('A reset link will be sent to your registered number.')}
                    className="text-[12px] font-semibold text-[#96BD47]"
                  >
                    Forgot PIN?
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-[15px] font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="p-1 text-[#687085]"
                    aria-label={showPin ? 'Hide password' : 'Show password'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label className="flex items-center gap-3 py-2.5">
              <Lock className="w-4 h-4 text-[#0d1747] shrink-0" />
              <span className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
                <span className="block text-[12px] text-[#687085]">One-time PIN</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full bg-transparent text-[15px] font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden tracking-widest"
                />
              </span>
            </label>
          )}

          <button
            type="button"
            onClick={() => {
              setAuthMode((mode) => (mode === 'password' ? 'otp' : 'password'));
              setPin('');
              setErrorMessage('');
            }}
            className="mt-1 mb-4 self-start text-sm font-semibold text-[#0d1747]"
          >
            {authMode === 'password' ? 'Use a one-time PIN instead' : 'Use password instead'}
          </button>

          <label className="flex items-center gap-2.5 cursor-pointer select-none py-2">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={() => setRememberDevice(!rememberDevice)}
              className="peer sr-only"
            />
            <span
              className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${
                rememberDevice ? 'border-[#96BD47]' : 'border-[#c5c9d4]'
              }`}
            >
              {rememberDevice && <span className="h-2 w-2 rounded-full bg-[#96BD47]" />}
            </span>
            <span className="text-sm text-[#555d71]">Remember this device</span>
          </label>

          <button
            type="submit"
            className="mt-6 w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#0d1747]/15 transition-all"
          >
            <span>Sign in</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('create-profile')}
            className="mt-3 w-full py-3 text-sm font-semibold text-[#0d1747] hover:text-[#96BD47] transition-colors"
          >
            New to TransFlow? Create a profile
          </button>
        </form>
      </div>
    </div>
  );
};
