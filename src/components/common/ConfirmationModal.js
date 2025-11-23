import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  loading = false,
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const getTypeColor = () => {
    switch (type) {
      case 'danger': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#dc3545';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        border: `2px solid ${getTypeColor()}`,
        borderRadius: '15px',
        padding: '30px',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: getTypeColor(),
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <i className={`fas ${type === 'danger' ? 'fa-exclamation-triangle' : type === 'warning' ? 'fa-question-circle' : 'fa-info-circle'}`} 
             style={{ fontSize: '1.5rem', color: 'white' }}></i>
        </div>
        
        <h4 style={{ color: 'white', marginBottom: '15px' }}>{title}</h4>
        <p style={{ color: '#ccc', marginBottom: '25px', lineHeight: '1.4' }}>{message}</p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              backgroundColor: '#28a745',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '25px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#1e7e34';
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#28a745';
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              backgroundColor: getTypeColor(),
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '25px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = type === 'danger' ? '#a71e2a' : getTypeColor();
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = getTypeColor();
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;