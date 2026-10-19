import React, { useState, useEffect } from 'react';
import { ScreenId, FamilySharingState } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import {
  Users,
  ShieldCheck,
  Key,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  AlertCircle,
  Pause,
  Play,
  Share2,
} from 'lucide-react';

interface FamilySharingProps {
  onNavigate: (screen: ScreenId) => void;
  sharingState: FamilySharingState;
  onUpdateSharingState: (params: Partial<FamilySharingState>) => void;
  savedCount?: number;
}

export const FamilySharingSuite: React.FC<FamilySharingProps> = ({
  onNavigate,
  sharingState,
  onUpdateSharingState,
  savedCount = 0,
}) => {
  const [subView, setSubView] = useState<'overview' | 'pair' | 'consent' | 'active' | 'viewer'>(
    sharingState.isSharingActive ? 'active' : 'overview'
  );

  // Pair Viewer Form
  const [pairingCode, setPairingCode] = useState('');
  const [parentConsent, setParentConsent] = useState(false);
  const [pairSuccess, setPairSuccess] = useState(false);

  // Sharing Consent Form
  const [selectedViewer, setSelectedViewer] = useState('Sam · Demo viewer');
  const [sharingDuration, setSharingDuration] = useState('15 minutes');
  const [locationMode, setLocationMode] = useState('Simulated demo');
  const [consentAgreed, setConsentAgreed] = useState(false);

  // Countdown simulation
  const [secondsRemaining, setSecondsRemaining] = useState(sharingState.secondsRemaining || 839);

  useEffect(() => {
    let timer: any;
    if (subView === 'active' && sharingState.isSharingActive) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [subView, sharingState.isSharingActive]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStartSharing = () => {
    if (!consentAgreed) {
      alert('Please check the consent box to start sharing.');
      return;
    }
    onUpdateSharingState({
      isSharingActive: true,
      activeViewer: selectedViewer,
      secondsRemaining: 840,
      locationStatus: 'Connected',
    });
    setSubView('active');
  };

  const handleStopSharing = () => {
    onUpdateSharingState({
      isSharingActive: false,
      locationStatus: 'Off',
    });
    setSubView('overview');
  };

  const handlePairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pairingCode.length !== 6) {
      alert('Please enter a valid 6-digit invitation code.');
      return;
    }
    if (!parentConsent) {
      alert('Please check the consent confirmation.');
      return;
    }
    setPairSuccess(true);
    setTimeout(() => {
      setPairSuccess(false);
      setSubView('overview');
    }, 1200);
  };

  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

        {/* SUBVIEW 1: OVERVIEW (Screen 25) */}
        {subView === 'overview' && (
          <div className="px-5 pt-5 pb-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
              FAMILY CONNECTION
            </p>
            <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
              A little peace of mind, with permission.
            </h1>
            <p className="text-[13px] text-[#555d71] leading-relaxed mb-5">
              Signed in as Alex · Demo traveller. Your role: <span className="font-bold text-[#0d1747]">traveller</span>.
            </p>

            {/* Approved relationships Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs mb-4">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f0eee6]">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0d1747]">
                  Approved relationships
                </h3>
                <button
                  onClick={() => setSubView('pair')}
                  className="text-[11px] font-bold text-[#0d1747] bg-[#f7f6f2] border border-[#dedad0] hover:bg-[#edeae2] px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Key className="w-3 h-3 text-[#84ad32]" />
                  <span>Set up pairing</span>
                </button>
              </div>

              {/* Sam Demo Viewer */}
              <div className="p-3.5 bg-[#f7f6f2] rounded-2xl border border-[#dedad0] mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-[#0d1747]">
                    Sam · Demo viewer
                  </h4>
                  <p className="text-[10px] text-[#555d71]">
                    Approved · visible to both accounts
                  </p>
                </div>
                <button
                  onClick={() => alert('Relationship removed.')}
                  className="text-[10px] text-red-600 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>

              <button
                onClick={() => setSubView('consent')}
                className="w-full bg-[#0d1747] hover:bg-[#15236b] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Choose a journey &amp; start sharing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pairing requests Card */}
            <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs mb-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#798090] mb-1">
                Pairing requests
              </h4>
              <p className="text-xs text-[#555d71]">No pending requests.</p>
            </div>

            {/* Current sessions */}
            <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs mb-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#798090] mb-1">
                Current sessions
              </h4>
              <p className="text-xs text-[#555d71] leading-relaxed">
                No active sharing. Pairing alone never transmits location until you explicitly start a session for a chosen journey.
              </p>
            </div>
          </div>
        )}

        {/* SUBVIEW 2: PAIR VIEWER (Screen 26) */}
        {subView === 'pair' && (
          <div className="px-5 pt-5 pb-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
              SET UP TOGETHER
            </p>
            <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
              Pair a trusted viewer.
            </h1>
            <p className="text-[13px] text-[#555d71] leading-relaxed mb-5">
              Invitations expire in 10 minutes and can be used once. Both people approve the relationship.
            </p>

            {pairSuccess ? (
              <div className="p-4 bg-[#f0f6e6] border border-[#84ad32] rounded-2xl text-xs font-bold text-[#456d17] flex items-center gap-2 mb-4">
                <Check className="w-4 h-4 text-[#84ad32]" />
                <span>Viewer paired successfully! Returning to sharing overview...</span>
              </div>
            ) : null}

            <form onSubmit={handlePairSubmit} className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs space-y-4 mb-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1.5">
                  Enter your viewer&apos;s code *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={pairingCode}
                  onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                  placeholder="Six-digit invitation code"
                  className="w-full bg-[#f7f6f2] rounded-2xl border border-[#dedad0] p-3 text-center text-lg font-mono font-black text-[#0d1747] tracking-widest focus:outline-hidden"
                />
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <div
                  onClick={() => setParentConsent(!parentConsent)}
                  className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    parentConsent ? 'bg-[#0d1747] text-white' : 'border-2 border-[#b5bac7] bg-white'
                  }`}
                >
                  {parentConsent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-xs text-[#555d71] leading-snug">
                  I am setting this up with my chosen parent, guardian or trusted viewer.
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-[#0d1747] hover:bg-[#15236b] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Check invitation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-[#798090] text-center pt-1">
                The named viewer will appear before you proceed. No location is shared by pairing.
              </p>
            </form>

            <div className="text-center">
              <button
                onClick={() => setSubView('overview')}
                className="text-xs font-bold text-[#0d1747] hover:underline"
              >
                ← Return to family sharing
              </button>
            </div>
          </div>
        )}

        {/* SUBVIEW 3: SHARING CONSENT (Screen 27) */}
        {subView === 'consent' && (
          <div className="px-5 pt-5 pb-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
              YOU CONTROL THIS
            </p>
            <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
              Start journey sharing?
            </h1>
            <p className="text-[13px] text-[#555d71] leading-relaxed mb-4">
              Check who can view, what is sent and when access ends.
            </p>

            <div className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs space-y-4 mb-4">
              {/* Approved viewer dropdown */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1">
                  Approved viewer
                </label>
                <div className="bg-[#f7f6f2] p-3 rounded-2xl border border-[#dedad0] text-xs font-bold text-[#0d1747]">
                  {selectedViewer}
                </div>
              </div>

              {/* Chosen journey */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1">
                  This journey
                </label>
                <div className="bg-[#edeae2] p-3 rounded-2xl border border-[#dedad0] text-xs font-bold text-[#0d1747] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#0d1747]" />
                  <span>Central interchange – Northside campus</span>
                </div>
              </div>

              {/* Duration & Mode grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1">
                    Sharing duration
                  </label>
                  <select
                    value={sharingDuration}
                    onChange={(e) => setSharingDuration(e.target.value)}
                    className="w-full bg-[#f7f6f2] rounded-2xl border border-[#dedad0] p-2.5 text-xs font-bold text-[#0d1747] focus:outline-hidden"
                  >
                    <option value="15 minutes">15 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="60 minutes">60 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1">
                    Location mode
                  </label>
                  <select
                    value={locationMode}
                    onChange={(e) => setLocationMode(e.target.value)}
                    className="w-full bg-[#f7f6f2] rounded-2xl border border-[#dedad0] p-2.5 text-xs font-bold text-[#0d1747] focus:outline-hidden"
                  >
                    <option value="Simulated demo">Simulated demo</option>
                    <option value="Live GPS (Device)">Live GPS (Device)</option>
                  </select>
                </div>
              </div>

              <p className="text-[10px] text-[#798090]">
                Estimated expiry: 16 Oct 2026, 23:34 SAST
              </p>

              {/* Consent checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-[#f0eee6]">
                <div
                  onClick={() => setConsentAgreed(!consentAgreed)}
                  className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    consentAgreed ? 'bg-[#0d1747] text-white' : 'border-2 border-[#b5bac7] bg-white'
                  }`}
                >
                  {consentAgreed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-xs text-[#555d71] leading-snug">
                  I agree to share this journey, update status and location point with the named viewer for this session.
                </span>
              </label>

              {/* Action buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleStartSharing}
                  className="flex-2 py-3.5 bg-[#0d1747] hover:bg-[#15236b] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Start sharing</span>
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSubView('overview')}
                  className="flex-1 py-3.5 border border-[#dedad0] rounded-2xl font-bold text-xs text-[#555d71] hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBVIEW 4: ACTIVE SHARING (Screen 28) */}
        {subView === 'active' && (
          <div className="px-5 pt-4 pb-2">
            {/* Green countdown banner */}
            <div className="bg-[#f0f6e6] border border-[#d6e5be] p-3 rounded-2xl flex items-center justify-between mb-4 text-xs font-bold text-[#3d6717]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#84ad32] animate-pulse" />
                <span>Simulated sharing on · Sam · Demo viewer</span>
              </div>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-[#d2e2b9]">
                {formatTimer(secondsRemaining)} remaining
              </span>
            </div>

            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1">
              YOUR CURRENT SESSION
            </p>
            <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-4">
              Sharing stays in your control.
            </h1>

            {/* Session stats card */}
            <div className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs mb-4 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#f0eee6]">
                <span className="font-extrabold text-[#0d1747]">Updates received</span>
                <span className="font-mono text-[#798090]">{formatTimer(secondsRemaining)} remaining</span>
              </div>
              <p className="text-[11px] text-[#555d71]">
                Viewer: <span className="font-bold text-[#0d1747]">Sam · Demo viewer</span>
              </p>

              <div className="space-y-2 pt-1 border-t border-[#f0eee6] text-[11px] text-[#555d71]">
                <div className="flex justify-between">
                  <span className="text-[#798090]">Network:</span>
                  <span className="font-bold text-[#456d17]">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#798090]">Location mode:</span>
                  <span>Fixed simulated point</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#798090]">Captured:</span>
                  <span>16 Oct 2026, 23:19 SAST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#798090]">Accuracy:</span>
                  <span>About 15 metres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#798090]">Access ends:</span>
                  <span>16 Oct 2026, 23:33 SAST</span>
                </div>
              </div>

              {/* Stop button */}
              <div className="pt-2">
                <button
                  onClick={handleStopSharing}
                  className="w-full bg-[#c53030] hover:bg-[#a82525] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Stop sharing</span>
                </button>
              </div>
            </div>

            {/* Schematic live map preview */}
            <div className="bg-[#eef3e8] rounded-3xl p-4 border border-[#dedad0] mb-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0d1747] mb-2">
                <Compass className="w-3.5 h-3.5 text-[#84ad32]" />
                <span>Simulated device point on a schematic</span>
              </div>
              <svg viewBox="0 0 300 90" className="w-full h-20">
                <path d="M 30 60 Q 120 20, 180 50 T 270 30" stroke="#84ad32" strokeWidth="5" fill="none" />
                <circle cx="30" cy="60" r="5" fill="#ffffff" stroke="#0d1747" strokeWidth="2.5" />
                <circle cx="270" cy="30" r="5" fill="#84ad32" stroke="#0d1747" strokeWidth="2.5" />
                {/* Active blinking device point */}
                <circle cx="180" cy="50" r="9" fill="#0d1747" stroke="#ffffff" strokeWidth="3" className="animate-pulse" />
              </svg>
              <p className="text-[10px] text-[#798090] text-center pt-1">
                Recent point received by the local server.
              </p>
            </div>

            {/* Quick toggle to view Screen 29 (Approved Viewer Mode) */}
            <div className="text-center pb-2">
              <button
                onClick={() => setSubView('viewer')}
                className="text-xs font-bold text-[#0d1747] hover:underline"
              >
                Switch to Approved Viewer perspective (Screen 29) →
              </button>
            </div>
          </div>
        )}

        {/* SUBVIEW 5: APPROVED VIEWER (Screen 29 & 30) */}
        {subView === 'viewer' && (
          <div className="px-5 pt-5 pb-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
              APPROVED VIEWER
            </p>
            <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
              A view of their journey.
            </h1>
            <p className="text-[13px] text-[#555d71] leading-relaxed mb-4">
              One easy connection.
            </p>

            <div className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs space-y-3 text-xs mb-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#f0eee6]">
                <span className="font-extrabold text-[#0d1747]">Updates received</span>
                <span className="font-mono text-[#798090]">{formatTimer(secondsRemaining)} remaining</span>
              </div>
              <p className="text-xs font-bold text-[#0d1747]">
                Traveller: Alex · Demo traveller
              </p>

              <div className="space-y-1.5 text-[11px] text-[#555d71] pt-1">
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span className="text-[#456d17] font-bold">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>Location mode:</span>
                  <span>Fixed simulated point</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span>About 15 metres</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSubView('overview')}
                  className="w-full bg-[#f7f6f2] hover:bg-[#edeae2] border border-[#dedad0] text-[#0d1747] py-3 rounded-2xl font-bold text-xs"
                >
                  Leave shared view
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav currentScreen="family-sharing" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
