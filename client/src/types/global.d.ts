declare global {
  interface Window {
    showToast?: (toast: { message: string; type: 'info' | 'success' | 'warning' | 'error'; duration?: number }) => void;
  }
}

export {};