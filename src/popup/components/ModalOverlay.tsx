// =============================================================================
// ModalOverlay Component
// =============================================================================

import React, { useEffect } from 'react';

interface ModalOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function ModalOverlay({ children, onClose }: ModalOverlayProps) {
  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl mx-4 max-w-sm w-full max-h-[80%] overflow-auto animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
}
