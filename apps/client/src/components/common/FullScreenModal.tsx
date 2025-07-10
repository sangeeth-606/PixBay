import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="relative min-h-screen min-w-full flex items-center justify-center border border-[#23272f] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          className="absolute top-6 right-8 text-gray-400 hover:text-gray-700 text-3xl font-bold z-20"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
};

export default FullScreenModal;
