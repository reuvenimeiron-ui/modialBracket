// ============================================================
// Button — reusable button with variant support
// ============================================================

import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
