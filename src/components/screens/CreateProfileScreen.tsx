import React, { useState } from 'react';
import { ScreenId, CommuterUser } from '../../types/transit';
import { ArrowLeft, ArrowRight, CreditCard, Eye, EyeOff, HelpCircle, Lock, Phone, User, X } from 'lucide-react';
import transflowLogo from '../../assets/transflow-logo.png';

interface CreateProfileProps {
  onNavigate: (screen: ScreenId) => void;
  commuter: CommuterUser;
  onProfileCreated: (user: Partial<CommuterUser>) => void;
}

export const CreateProfileScreen: React.FC<CreateProfileProps> = ({
  onNavigate,
  onProfileCreated,
}) => {
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Enter your full name.');
      return;
    }
    if (!mobileNumber.trim()) {
      setErrorMessage('Enter your mobile number.');
      return;
    }
    if (pin.length < 5) {
      setErrorMessage('Create a 5-digit PIN.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Agree to the terms to continue.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('Profile created. Opening Plan…');

    onProfileCreated({
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.startsWith('+27') ? mobileNumber : `+27 ${mobileNumber.trim()}`,
      metroCardNumber: metroCard.trim(),
      isLoggedIn: true,
      loadSheddingAlerts: receiveAlerts,
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
          onClick={() => onNavigate('sign-in')}
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
          Create your profile.
        </h1>
        <p className="mt-2 mb-7 text-sm text-[#555d71] leading-relaxed">
          Save journeys and get delay alerts on the routes you use.
        </p>

        {errorMessage && (
          <p className="mb-4 text-sm font-medium text-[#c62828]">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mb-4 text-sm font-medium text-[#6a8a2e]">{successMessage}</p>
        )}

        <form onSubmit={handleCreate} className="flex-1 flex flex-col">
          <label className="flex items-center gap-3 py-2.5">
            <User className="w-4 h-4 text-[#0d1747] shrink-0" />
            <span className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
              <span className="block text-[12px] text-[#687085]">Full name</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-transparent text-[15px] font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
              />
            </span>
          </label>

          <label className="flex items-center gap-3 py-2.5">
            <Phone className="w-4 h-4 text-[#0d1747] shrink-0" />
            <span className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
              <span className="block text-[12px] text-[#687085]">Mobile number</span>
              <span className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-[#0d1747]">+27</span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="82 000 0000"
                  className="w-full bg-transparent text-[15px] font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
                />
              </span>
            </span>
          </label>

          <label className="flex items-center gap-3 py-2.5">
            <CreditCard className="w-4 h-4 text-[#0d1747] shrink-0" />
            <span className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
              <span className="block text-[12px] text-[#687085]">MetroCard number (optional)</span>
              <input
                type="text"
                value={metroCard}
                onChange={(e) => setMetroCard(e.target.value)}
                placeholder="If you have one"
                className="w-full bg-transparent text-[15px] font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
              />
            </span>
          </label>

          <div className="flex items-center gap-3 py-2.5">
            <Lock className="w-4 h-4 text-[#0d1747] shrink-0" />
            <div className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
              <span className="block text-[12px] text-[#687085]">5-digit PIN</span>
              <div className="flex items-center gap-2">
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={5}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="•••••"
                  className="w-full bg-transparent text-[15px] font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="p-1 text-[#687085]"
                  aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAgreeTerms(!agreeTerms)}
            className="flex items-start gap-2.5 cursor-pointer select-none pt-4 text-left"
          >
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                agreeTerms ? 'border-[#96BD47]' : 'border-[#c5c9d4]'
              }`}
            >
              {agreeTerms && <span className="h-2 w-2 rounded-full bg-[#96BD47]" />}
            </span>
            <span className="text-sm text-[#555d71]">I agree to the TransFlow Commuter Terms of Service</span>
          </button>

          <button
            type="button"
            onClick={() => setReceiveAlerts(!receiveAlerts)}
            className="flex items-start gap-2.5 cursor-pointer select-none pt-3 text-left"
          >
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                receiveAlerts ? 'border-[#96BD47]' : 'border-[#c5c9d4]'
              }`}
            >
              {receiveAlerts && <span className="h-2 w-2 rounded-full bg-[#96BD47]" />}
            </span>
            <span className="text-sm text-[#555d71]">Send delay and load shedding alerts</span>
          </button>

          <button
            type="submit"
            className="mt-6 w-full bg-[#0d1747] hover:bg-[#142161] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#0d1747]/15 transition-all"
          >
            <span>Create profile</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('sign-in')}
            className="mt-3 w-full py-3 text-sm font-semibold text-[#0d1747] hover:text-[#96BD47] transition-colors"
          >
            Already have an account? Sign in
          </button>
        </form>
      </div>
    </div>
  );
};
