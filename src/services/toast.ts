// =============================================================================
// SubSense Toast Service
// =============================================================================

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

type ToastListener = (toasts: Toast[]) => void;

class ToastService {
  private toasts: Toast[] = [];
  private listeners = new Set<ToastListener>();
  private counter = 0;

  show(message: string, type: ToastType = 'success', duration = 3000): string {
    const id = `toast_${++this.counter}`;
    const toast: Toast = { id, message, type, duration };

    this.toasts = [...this.toasts, toast];
    this.notify();

    // Auto-dismiss
    setTimeout(() => {
      this.dismiss(id);
    }, duration);

    return id;
  }

  dismiss(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener(this.toasts); // Initial state
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  getToasts(): Toast[] {
    return [...this.toasts];
  }
}

export const toastService = new ToastService();
