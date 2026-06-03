import React, { useEffect, useState } from 'react';

type ToastProps = {
  type: 'success' | 'error';
  message: string;
  duration?: number; // ms
  onClose?: () => void;
};

export default function Toast({ type, message, duration = 5000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setProgress(100);
    requestAnimationFrame(() => setVisible(true));

    const start = performance.now();
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (elapsed >= duration) {
        clearInterval(interval);
        setVisible(false);
        if (onClose) onClose();
      }
    }, 20);

    const timeout = window.setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration + 300);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onClose]);

  return (
    <div
      aria-live="polite"
      className={`fixed top-4 right-4 z-50 pointer-events-none transition-all duration-300 ease-out ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
      }`}
    >
      <div
        className={`pointer-events-auto max-w-sm w-full rounded-md shadow-lg overflow-hidden border ltr:text-left rtl:text-right flex flex-col `}
        style={{
          borderColor: type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
        }}
      >
        <div
          className={`px-4 py-3 flex items-center gap-3 w-full bg-white dark:bg-gray-800`}
        >
          <div
            className={`shrink-0 rounded-full w-8 h-8 flex items-center justify-center text-white ${
              type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {type === 'success' ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M16.704 5.29a1 1 0 010 1.415l-7.387 7.387a1 1 0 01-1.415 0L3.296 8.497a1 1 0 111.415-1.415l3.21 3.21 6.68-6.68a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3a1 1 0 11-2 0zm0 4a1 1 0 112 0 1 1 0 01-2 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{message}</p>
          </div>
        </div>
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className={`h-1 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} transform origin-left transition-transform ease-linear`}
            style={{ transform: `scaleX(${progress / 100})`, transition: 'transform 80ms linear' }}
          />
        </div>
      </div>
    </div>
  );
}
