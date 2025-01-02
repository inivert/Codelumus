"use client";

import { createContext, useContext, useState } from "react";
import { SignInModal } from "@/components/auth/sign-in-modal";

interface ModalContextType {
  showSignInModal: boolean;
  setShowSignInModal: (show: boolean) => void;
}

export const ModalContext = createContext<ModalContextType>({
  showSignInModal: false,
  setShowSignInModal: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <ModalContext.Provider value={{ showSignInModal, setShowSignInModal }}>
      {children}
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    </ModalContext.Provider>
  );
} 