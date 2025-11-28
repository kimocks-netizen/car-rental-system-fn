import React from 'react';

export const CancelButton = ({ onClick, disabled = false, children = "Cancel" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '12px 24px',
        backgroundColor: 'transparent',
        border: '2px solid #6c757d',
        borderRadius: '8px',
        color: '#6c757d',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.5 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = '#6c757d';
          e.target.style.color = 'white';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = '#6c757d';
        }
      }}
    >
      {children}
    </button>
  );
};

export const SubmitButton = ({ onClick, disabled = false, loading = false, children, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: '12px 24px',
        backgroundColor: '#28a745',
        border: '2px solid #28a745',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: (disabled || loading) ? 0.7 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.backgroundColor = '#218838';
          e.target.style.borderColor = '#218838';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.target.style.backgroundColor = '#28a745';
          e.target.style.borderColor = '#28a745';
        }
      }}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};