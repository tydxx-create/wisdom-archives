import { createContext, useCallback, useContext, useRef, useState } from 'react';
import Toast from '../components/Toast.jsx';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [state, setState] = useState({ message: '', show: false });
  const timer = useRef(null);

  const toast = useCallback(message => {
    setState({ message, show: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState(s => ({ ...s, show: false })), 2800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toast message={state.message} show={state.show} />
    </ToastContext.Provider>
  );
}
