import React from 'react';

const SuccessModal = ({ 
  isOpen, 
  onClose, 
  title = "Success", 
  message,
  closeText = "Close"
}) => {
  if (!isOpen) return null;

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
      alignItems: 'flex-start',
      paddingTop: '100px',
      zIndex: 1000,
      overflow: 'auto'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid #28a745',
        borderRadius: '15px',
        padding: '30px',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#28a745',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <i className="fas fa-check" style={{ fontSize: '1.5rem', color: 'white' }}></i>
        </div>
        
        <h4 style={{ color: 'white', marginBottom: '15px' }}>{title}</h4>
        <div 
          style={{ color: '#ccc', marginBottom: '25px', lineHeight: '1.4' }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
        
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#28a745',
            border: 'none',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '25px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#1e7e34';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#28a745';
            e.target.style.transform = 'scale(1)';
          }}
        >
          {closeText}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;