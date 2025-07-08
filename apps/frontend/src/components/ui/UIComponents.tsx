import React from 'react';

// Button Component with all variants
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md',
    secondary: 'bg-white text-dark-navy border border-muted-gray hover:bg-light-gray focus:ring-primary-500',
    ghost: 'text-dark-navy hover:bg-light-gray focus:ring-primary-500',
    danger: 'bg-danger text-white hover:bg-red-600 focus:ring-red-500',
    success: 'bg-success text-white hover:bg-green-600 focus:ring-green-500',
    ai: 'bg-gradient-purple text-white hover:opacity-90 focus:ring-accent-purple shadow-lg hover:shadow-xl'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  shadow = 'md'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadowClasses = {
    sm: 'shadow-card',
    md: 'shadow-soft',
    lg: 'shadow-lift'
  };
  
  return (
    <div className={`
      bg-white rounded-xl ${shadowClasses[shadow]} ${paddingClasses[padding]}
      ${hover ? 'hover:shadow-lift hover:-translate-y-1 transition-all duration-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-dark-navy">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-muted-gray">{icon}</span>
          </div>
        )}
        <input
          className={`
            block w-full rounded-lg border-muted-gray bg-white px-3 py-2
            focus:border-primary focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-muted-gray">{icon}</span>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </div>
  );
};

// Toast Component
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose, visible }) => {
  const typeClasses = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    warning: 'bg-warning text-white',
    info: 'bg-info text-white'
  };
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  if (!visible) return null;
  
  return (
    <div className={`
      fixed top-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-floating
      ${typeClasses[type]} animate-toast-in
    `}>
      <span className="text-lg">{icons[type]}</span>
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-3 text-white hover:text-gray-200"
      >
        ✕
      </button>
    </div>
  );
};

// Badge Component  
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'ai';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm'
}) => {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    ai: 'bg-gradient-purple text-white'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${variantClasses[variant]} ${sizeClasses[size]}
    `}>
      {children}
    </span>
  );
};

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={onClose}
        />
        <div className={`
          relative bg-white rounded-xl shadow-floating p-6 w-full ${sizeClasses[size]}
          animate-scale-in
        `}>
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-navy">{title}</h3>
              <button
                onClick={onClose}
                className="text-muted-gray hover:text-dark-navy"
              >
                ✕
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

// Loading Spinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-2 border-muted-gray border-t-primary ${sizeClasses[size]}`} />
    </div>
  );
};

// AI Assistant Button
export const AIAssistantButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 bg-gradient-purple text-white p-4 rounded-full shadow-floating hover:shadow-lift transition-all duration-200 hover:scale-105"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <div className="absolute inset-0 rounded-full animate-pulse-ring bg-gradient-purple"></div>
    </button>
  );
};
