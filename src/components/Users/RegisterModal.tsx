// ============================================================
// RegisterModal — collect displayName, email, password
// Client-only auth (MVP): no backend, no persistence
// ============================================================

import { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { useTournamentStore } from '../State/tournamentStore';
import './Auth.css';

interface RegisterModalProps {
  onClose: () => void;
}

export function RegisterModal({ onClose }: RegisterModalProps) {
  const registerUser = useTournamentStore(s => s.registerUser);
  const users = useTournamentStore(s => s.users);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    if (users.some(u => u.email === email.trim())) {
      setError('An account with this email already exists.');
      return;
    }

    registerUser(displayName.trim(), email.trim(), password);
    onClose();
  }

  return (
    <Modal title="Create Account" onClose={onClose}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-label">
          Display Name
          <input
            className="auth-input"
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            autoComplete="name"
            autoFocus
          />
        </label>

        <label className="auth-label">
          Email
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="auth-label">
          Password
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-actions">
          <Button type="submit" variant="primary">Register</Button>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}
