import React, { useState } from 'react';
import { ScreenId, CommuterUser } from '../../types/transit';
import { ArrowLeft, HelpCircle, AtSign, Lock, Eye, EyeOff, ArrowRight, CreditCard } from 'lucide-react';

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
      setErrorMessage('Please enter your email or Metrobus mobile number');
      return;
    }
    if (!pin.trim() && authMode === 'password') {
      setErrorMessage('Please enter your commuter PIN or password');
      return;
    }

    setErrorMessage('');
    const userName = identifier.includes('@')
      ? identifier.split('@')[0]
      : 'Joburg Commuter';
    setSuccessNotice('Signed in successfully! Redirecting...');
    onLoginSuccess({
      mobileNumber: identifier.includes('@') ? commuter.mobileNumber || '+27 82 123 4567' : identifier,
      email: identifier.includes('@') ? identifier : undefined,
      isLoggedIn: true,
      fullName: commuter.fullName && commuter.fullName !== 'Guest' ? commuter.fullName : userName,
    });

    setTimeout(() => {
      onNavigate('home-dashboard');
    }, 600);
  };

  const handleQuickDemoFill = () => {
    setIdentifier('thuso@transflow.joburg');
    setPin('54321');
  };

  const handleQuickMetroCardTap = () => {
    setSuccessNotice('MetroCard 9400••••0192 Authenticated via NFC!');
    onLoginSuccess({
      fullName: 'MetroCard Holder',
      metroCardNumber: '9400 1209 8432 0192',
      isLoggedIn: true,
      cardBalance: 142.5,
    });
    setTimeout(() => {
      onNavigate('home-dashboard');
    }, 800);
  };

  const handleGoogleSignIn = () => {
    setSuccessNotice('Signed in with Google Account');
    onLoginSuccess({
      fullName: 'Johannesburg Commuter',
      isLoggedIn: true,
    });
    setTimeout(() => {
      onNavigate('home-dashboard');
    }, 700);
  };

  return (
    <div className="min-h-screen px-5 py-6 max-w-md mx-auto flex flex-col justify-between">
      <div>
        {/* Top bar with back and help */}
        <div className="flex items-center justify-between pb-6">
          <button
            onClick={() => onNavigate('onboarding-3')}
            className="p-1 -ml-1 text-[#0d1747] hover:text-[#25357f] transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-1 -mr-1 text-[#0d1747] hover:text-[#25357f] transition-colors"
            title="Help & Support"
          >
            <HelpCircle className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {showHelp && (
          <div className="mb-4 p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-[#0d1747] flex items-start justify-between animate-fadeIn">
            <div>
              <p className="font-bold">Metrobus Commuter Support</p>
              <p className="text-[#555d71] mt-0.5">Toll-free: 0860 562 874 · support@transflow.joburg</p>
            </div>
            <button onClick={() => setShowHelp(false)} className="text-sm font-bold text-[#555d71] ml-2">✕</button>
          </div>
        )}

        {/* Title & Subtitle */}
        <div className="mb-6">
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-2">
            Welcome back.
          </h1>
          <p className="text-[14px] text-[#5b6377] leading-relaxed">
            Sign in to access your saved journeys, smart tap cards, and live trip notifications across Johannesburg.
          </p>
        </div>

        {/* Segmented control */}
        <div className="bg-[#ece8df] p-1 rounded-2xl flex items-center mb-6">
          <button
            type="button"
            onClick={() => setAuthMode('password')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              authMode === 'password'
                ? 'bg-white text-[#0d1747] shadow-sm'
                : 'text-[#6a7287] hover:text-[#0d1747]'
            }`}
          >
            Password / PIN
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('otp')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              authMode === 'otp'
                ? 'bg-white text-[#0d1747] shadow-sm'
                : 'text-[#6a7287] hover:text-[#0d1747]'
            }`}
          >
            One-Time PIN (OTP)
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        {successNotice && (
          <div className="mb-4 p-3 bg-[#e8f3d6] border border-[#84ad32] text-[#3e6815] text-xs rounded-xl font-bold">
            {successNotice}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Field 1: Identifier */}
          <div className="bg-[#ece8df] rounded-2xl p-3.5 focus-within:ring-2 focus-within:ring-[#0d1747] transition-all">
            <label className="block text-[10px] font-extrabold tracking-wider text-[#636b80] uppercase mb-1">
              Email or Metrobus Mobile No.
            </label>
            <div className="flex items-center gap-2.5">
              <AtSign className="w-5 h-5 text-[#454c60] shrink-0" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full bg-transparent text-sm font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Field 2: Password / PIN */}
          {authMode === 'password' ? (
            <div className="bg-[#ece8df] rounded-2xl p-3.5 focus-within:ring-2 focus-within:ring-[#0d1747] transition-all">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-extrabold tracking-wider text-[#636b80] uppercase">
                  Commuter PIN / Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Reset link or SMS PIN sent to your registered mobile number.')}
                  className="text-[11px] font-bold text-[#0d1747] hover:underline"
                >
                  Forgot PIN?
                </button>
              </div>
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-[#454c60] shrink-0" />
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="p-1 text-[#636b80] hover:text-[#0d1747]"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#ece8df] rounded-2xl p-3.5 focus-within:ring-2 focus-within:ring-[#0d1747] transition-all">
              <label className="block text-[10px] font-extrabold tracking-wider text-[#636b80] uppercase mb-1">
                One-Time SMS OTP Code
              </label>
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-[#454c60] shrink-0" />
                <input
                  type="text"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-transparent text-sm font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden tracking-widest font-mono"
                />
              </div>
            </div>
          )}

          {/* Remember this device checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-1 select-none">
            <div
              onClick={() => setRememberDevice(!rememberDevice)}
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                rememberDevice ? 'bg-[#0d1747] text-white' : 'border-2 border-[#b5bac7] bg-white'
              }`}
            >
              {rememberDevice && (
                <svg className="w-3.5 h-3.5 stroke-current stroke-[3] fill-none" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-xs font-semibold text-[#485065]">
              Remember this device
            </span>
          </label>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0d1747]/15 transition-all"
            >
              <span>Sign in to TransFlow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* OR Quick Continue With */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e2ded5]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#7c8499]">
            <span className="bg-[#f7f6f2] px-3">Or quick continue with</span>
          </div>
        </div>

        {/* Social / Tap Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={handleQuickMetroCardTap}
            className="flex items-center justify-center gap-2 py-3 px-3 bg-white hover:bg-slate-50 border border-[#e2ded5] rounded-2xl text-xs font-bold text-[#0d1747] shadow-xs active:scale-[0.99] transition-all"
          >
            <CreditCard className="w-4 h-4 text-[#4b7a15]" />
            <span>MetroCard Tap</span>
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-2 py-3 px-3 bg-white hover:bg-slate-50 border border-[#e2ded5] rounded-2xl text-xs font-bold text-[#0d1747] shadow-xs active:scale-[0.99] transition-all"
          >
            {/* Google Logo SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>
      </div>

      {/* New to Joburg Metrobus Callout Card */}
      <div className="bg-[#f2f7e8] border border-[#d6e5be] p-4 rounded-2xl flex items-start gap-3 mt-4">
        <div className="w-8 h-8 rounded-xl bg-[#6f9725] text-white flex items-center justify-center shrink-0 font-bold text-lg">
          +
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-extrabold text-[#0d1747]">
            New to Joburg Metrobus?
          </h4>
          <p className="text-[11px] text-[#556143] leading-snug mt-0.5 mb-1.5">
            Register your daily route to unlock real-time delay warnings and MetroCard digital top-ups.
          </p>
          <button
            onClick={() => onNavigate('create-profile')}
            className="text-xs font-bold text-[#456d17] hover:underline flex items-center gap-1"
          >
            <span>Create Commuter Profile</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
