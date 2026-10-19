import React, { useState } from 'react';
import { ScreenId, CommuterUser } from '../../types/transit';
import { ArrowLeft, HelpCircle, User, Phone, CreditCard, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface CreateProfileProps {
  onNavigate: (screen: ScreenId) => void;
  commuter: CommuterUser;
  onProfileCreated: (user: Partial<CommuterUser>) => void;
}

export const CreateProfileScreen: React.FC<CreateProfileProps> = ({
  onNavigate,
  commuter,
  onProfileCreated,
}) => {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [metroCard, setMetroCard] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [receiveAlerts, setReceiveAlerts] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleFillSample = () => {
    setFullName('Thuso Rampheng');
    setMobileNumber('82 456 7890');
    setMetroCard('9400 1209 8432 0192');
    setPin('12345');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!mobileNumber.trim()) {
      setErrorMessage('Please enter your South African mobile number');
      return;
    }
    if (pin.length < 5) {
      setErrorMessage('Please create a 5-digit security PIN');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service to proceed');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('Commuter profile created successfully! Welcome to TransFlow.');

    onProfileCreated({
      fullName,
      mobileNumber: mobileNumber.startsWith('+27') ? mobileNumber : `+27 ${mobileNumber}`,
      metroCardNumber: metroCard || '9400 1209 8432 0192',
      cardBalance: metroCard ? 150 : 50,
      isLoggedIn: true,
      loadSheddingAlerts: receiveAlerts,
    });

    setTimeout(() => {
      onNavigate('home-dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen px-5 py-6 max-w-md mx-auto flex flex-col justify-between">
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between pb-5">
          <button
            onClick={() => onNavigate('sign-in')}
            className="p-1 -ml-1 text-[#0d1747] hover:text-[#25357f] transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-1 -mr-1 text-[#0d1747] hover:text-[#25357f] transition-colors"
            title="Help"
          >
            <HelpCircle className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {showHelp && (
          <div className="mb-4 p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-[#0d1747] flex items-start justify-between animate-fadeIn">
            <div>
              <p className="font-bold">City of Joburg Transport Support</p>
              <p className="text-[#555d71] mt-0.5">Toll-free: 0860 562 874 · Metrobus Customer Care</p>
            </div>
            <button onClick={() => setShowHelp(false)} className="text-sm font-bold text-[#555d71] ml-2">✕</button>
          </div>
        )}

        {/* Title */}
        <div className="mb-5">
          <h1 className="text-[30px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-2">
            Create your commuter profile
          </h1>
          <p className="text-[13px] text-[#5b6377] leading-relaxed">
            Register your MetroCard, save daily routes, and get instant load shedding &amp; delay alerts across Johannesburg.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="bg-[#ece8df] p-1 rounded-2xl flex items-center mb-5">
          <button
            type="button"
            onClick={() => setMethod('phone')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              method === 'phone'
                ? 'bg-[#0d1747] text-white shadow-sm'
                : 'text-[#6a7287] hover:text-[#0d1747]'
            }`}
          >
            Quick (Phone)
          </button>
          <button
            type="button"
            onClick={() => setMethod('email')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              method === 'email'
                ? 'bg-[#0d1747] text-white shadow-sm'
                : 'text-[#6a7287] hover:text-[#0d1747]'
            }`}
          >
            Email &amp; PIN
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-[#e8f3d6] border border-[#84ad32] text-[#3e6815] text-xs rounded-xl font-bold">
            {successMessage}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleCreate} className="space-y-3.5">
          {/* Field 1: Full Name */}
          <div className="bg-[#ece8df] rounded-2xl p-3.5 focus-within:ring-2 focus-within:ring-[#0d1747] transition-all">
            <label className="block text-[10px] font-extrabold tracking-wider text-[#636b80] uppercase mb-1">
              Full Name
            </label>
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-[#454c60] shrink-0" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-transparent text-sm font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Field 2: Mobile Number */}
          <div className="bg-[#ece8df] rounded-2xl p-3.5 focus-within:ring-2 focus-within:ring-[#0d1747] transition-all">
            <label className="block text-[10px] font-extrabold tracking-wider text-[#636b80] uppercase mb-1">
              Mobile Number
            </label>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#454c60] shrink-0" />
              <div className="bg-white px-2.5 py-1 rounded-lg border border-[#d6d2c8] text-xs font-bold text-[#0d1747]">
                +27
              </div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full bg-transparent text-sm font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Field 3: MetroCard / Smart Tap */}
          <div className="bg-[#ece8df] rounded-2xl p-3.5 focus-within:ring-2 focus-within:ring-[#0d1747] transition-all relative">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-extrabold tracking-wider text-[#636b80] uppercase">
                MetroCard / Smart Tap Number (Optional)
              </label>
              <span className="bg-[#4a6d0c] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-sm tracking-wide">
                +10% Tap Bonus
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-[#454c60] shrink-0" />
              <input
                type="text"
                value={metroCard}
                onChange={(e) => setMetroCard(e.target.value)}
                placeholder="e.g. 9400 1209 8432 0192"
                className="w-full bg-transparent text-sm font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden font-mono tracking-wide"
              />
            </div>
          </div>

          {/* Field 4: 5-Digit PIN */}
          <div className="bg-[#ece8df] rounded-2xl p-3.5 focus-within:ring-2 focus-within:ring-[#0d1747] transition-all">
            <label className="block text-[10px] font-extrabold tracking-wider text-[#636b80] uppercase mb-1">
              Create 5-Digit PIN
            </label>
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-[#454c60] shrink-0" />
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={5}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="•••••"
                className="w-full bg-transparent text-base font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden tracking-widest font-mono"
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

          {/* Checkboxes */}
          <div className="space-y-2.5 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <div
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                  agreeTerms ? 'bg-[#0d1747] text-white' : 'border-2 border-[#b5bac7] bg-white'
                }`}
              >
                {agreeTerms && (
                  <svg className="w-3.5 h-3.5 stroke-current stroke-[3] fill-none" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-[12px] text-[#485065] leading-snug">
                Agree to Joburg Metrobus &amp; TransFlow Commuter{' '}
                <span className="underline font-semibold text-[#0d1747]">Terms of Service</span>
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <div
                onClick={() => setReceiveAlerts(!receiveAlerts)}
                className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                  receiveAlerts ? 'bg-[#0d1747] text-white' : 'border-2 border-[#b5bac7] bg-white'
                }`}
              >
                {receiveAlerts && (
                  <svg className="w-3.5 h-3.5 stroke-current stroke-[3] fill-none" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-[12px] text-[#485065] leading-snug">
                Receive WhatsApp / SMS real-time load shedding &amp; corridor alerts
              </span>
            </label>
          </div>

          {/* Create Account Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0d1747]/15 transition-all"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* OR REGISTER WITH */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e2ded5]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#7c8499]">
            <span className="bg-[#f7f6f2] px-3">Or register with</span>
          </div>
        </div>

        {/* MetroCard Tap & Google */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => {
              setMetroCard('9400 1209 8432 0192');
              alert('NFC MetroCard detected: 9400 1209 8432 0192');
            }}
            className="flex items-center justify-center gap-2 py-3 px-3 bg-white hover:bg-slate-50 border border-[#e2ded5] rounded-2xl text-xs font-bold text-[#0d1747] shadow-xs active:scale-[0.99] transition-all"
          >
            <CreditCard className="w-4 h-4 text-[#4b7a15]" />
            <span>MetroCard Tap</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFullName('Thuso Rampheng');
              setMobileNumber('082 123 4567');
              alert('Imported Google profile: Thuso Rampheng');
            }}
            className="flex items-center justify-center gap-2 py-3 px-3 bg-white hover:bg-slate-50 border border-[#e2ded5] rounded-2xl text-xs font-bold text-[#0d1747] shadow-xs active:scale-[0.99] transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google</span>
          </button>
        </div>
      </div>

      {/* Already have an account card */}
      <div className="bg-[#f2f7e8] border border-[#d6e5be] p-4 rounded-2xl flex items-center justify-between mt-3">
        <div>
          <h4 className="text-xs font-extrabold text-[#0d1747]">
            Already have a commuter account?
          </h4>
          <p className="text-[11px] text-[#556143]">
            Sign in to manage your pass &amp; rides
          </p>
        </div>
        <button
          onClick={() => onNavigate('sign-in')}
          className="text-xs font-bold text-[#456d17] hover:underline whitespace-nowrap pl-2"
        >
          Sign In →
        </button>
      </div>
    </div>
  );
};
