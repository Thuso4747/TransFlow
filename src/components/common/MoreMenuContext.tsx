import React, { createContext, useContext, useRef, useState } from 'react';
import { ScreenId } from '../../types/transit';

interface MoreMenuContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  handleSelect: (screen: ScreenId) => void;
  handleBackToMenu: () => void;
  openProfile: () => void;
}

const MoreMenuContext = createContext<MoreMenuContextValue | null>(null);

export const useMoreMenu = () => {
  const ctx = useContext(MoreMenuContext);
  if (!ctx) {
    throw new Error('useMoreMenu must be used within MoreMenuProvider');
  }
  return ctx;
};

interface MoreMenuProviderProps {
  children: React.ReactNode;
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenProfile?: () => void;
}

export const MoreMenuProvider: React.FC<MoreMenuProviderProps> = ({
  children,
  currentScreen,
  onNavigate,
  onOpenProfile,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const originRef = useRef<ScreenId>(currentScreen);

  const open = () => {
    originRef.current = currentScreen;
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const handleSelect = (screen: ScreenId) => {
    setIsOpen(false);
    onNavigate(screen);
  };

  const handleBackToMenu = () => {
    onNavigate(originRef.current);
    setIsOpen(true);
  };

  const openProfile = () => {
    setIsOpen(false);
    onOpenProfile?.();
  };

  return (
    <MoreMenuContext.Provider value={{ isOpen, open, close, handleSelect, handleBackToMenu, openProfile }}>
      {children}
    </MoreMenuContext.Provider>
  );
};
