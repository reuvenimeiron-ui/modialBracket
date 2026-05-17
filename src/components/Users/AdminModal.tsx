// ============================================================
// AdminModal — admin password entry (client-only MVP)
// Password: admin2026
// ============================================================

import { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { useTournamentStore } from '../State/tournamentStore';
import './Auth.css';

interface AdminModalProps {
  onClose: () => void;
}

export function AdminModal({ onClose }: AdminModalProps) {
  const setAdminMode = useTournamentStore(s => s.setAdminMode);

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    const ok = setAdminMode(password);
    if (!ok) {
      setError('Incorrect admin password.');
      return;
    }

    onClose();
  }

  return (
    <Modal title="🔐 Admin Access" onClose={onClose}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="auth-hint">
          Enter the admin password to unlock match result submission and tournament management.
        </p>

        <label className="auth-label">
          Admin Password
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            autoFocus
            placeholder="••••••••"
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-actions">
          <Button type="submit" variant="primary">Activate Admin Mode</Button>
        </div>
      </form>
    </Modal>
  );
}
