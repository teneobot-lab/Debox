import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();

  const show = useCallback((message, isError = false) => {
    setToast({ message, isError });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div className={'toast' + (toast.isError ? ' err' : '')} role="status">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
