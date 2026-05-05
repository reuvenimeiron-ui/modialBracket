// ============================================================
// LoginModal — email + password login
// Client-only auth (MVP): no backend, no persistence
// ============================================================

import { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { useTournamentStore } from '../State/tournamentStore';
import './Auth.css';

interface LoginModalProps {
  onClose: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
  const loginUser = useTournamentStore(s => s.loginUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    const success = loginUser(email.trim(), password);
    if (!success) {
      setError('Invalid email or password.');
      return;
    }

    onClose();
  }

  return (
    <Modal title="Sign In" onClose={onClose}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-label">
          Email
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />
        </label>

        <label className="auth-label">
          Password
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-actions">
          <Button type="submit" variant="primary">Sign In</Button>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}
