// ============================================================
// Modal — dimmed overlay wrapper
//
// Features:
//   - Dimmed backdrop; click outside closes
//   - ESC key closes
//   - X button closes
//   - Only one modal should be open at a time (enforced by caller)
// ============================================================

import { useEffect, useRef } from 'react';
import type { ReactNode, KeyboardEvent } from 'react';
import './Modal.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close when clicking the backdrop (outside the panel)
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  }

  // Prevent synthetic keyboard events from bubbling out of panel
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="modal-panel"
        ref={panelRef}
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
