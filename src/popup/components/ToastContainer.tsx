// =============================================================================
// ToastContainer Component
// =============================================================================

import React, { useState, useEffect } from 'react';
import { toastService, type Toast } from '../../services/toast';

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return toastService.subscribe(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 flex flex-col gap-2 pointer-events-none z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-sm font-medium
            animate-in slide-in-from-bottom duration-200
            ${toast.type === 'success' ? 'bg-emerald-600 text-white' : ''}
            ${toast.type === 'error' ? 'bg-rose-600 text-white' : ''}
            ${toast.type === 'info' ? 'bg-slate-700 text-white' : ''}
          `}
          onClick={() => toastService.dismiss(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
