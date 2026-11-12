import { createContext, useCallback, useContext, useState } from 'react';
import Button from '../components/ui/Button';

const ConfirmContext = createContext(null);

/** Dialog konfirmasi berbasis promise: `if (!(await confirm('Hapus?'))) return;` */
export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);

  const confirm = useCallback(
    (message, okText = 'Ya, lanjut') => new Promise((resolve) => setState({ message, okText, resolve })),
    []
  );

  const close = (value) => {
    state.resolve(value);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="ov ov-top" onMouseDown={(e) => e.target === e.currentTarget && close(false)}>
          <div className="panel" role="alertdialog" aria-modal="true">
            <h3>Konfirmasi</h3>
            <p className="muted">{state.message}</p>
            <div className="g2">
              <Button variant="sec" onClick={() => close(false)}>Batal</Button>
              <Button onClick={() => close(true)}>{state.okText}</Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
