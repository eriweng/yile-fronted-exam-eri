import { useEffect } from 'react';

export default function Toast({ message, type = 'error', onClose, autoCloseTime = 3000 }) {
  useEffect(() => {
    if (message && autoCloseTime) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [message, autoCloseTime, onClose]);

  if (!message) return null;

  return (
    <div className={`fixed top-[24px] left-1/2 transform -translate-x-1/2 z-50 px-[24px] py-[12px] rounded-[6px] shadow-lg flex items-center gap-[16px] animate-fade-in-down ${
      type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'
    }`}>
      <span className="text-body-lg font-bold">{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-300 font-bold transition-colors">
        ✕
      </button>
    </div>
  );
}
