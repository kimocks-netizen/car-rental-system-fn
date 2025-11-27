import React, { useState, useRef, useEffect } from 'react';

const ActionsDropdown = ({ actions, row }) => {
  // Add styles for hover effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .actions-dropdown-item:not(:disabled):hover {
        background-color: rgba(255, 0, 0, 0.05) !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        className="btn btn-link p-0"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.7)',
          border: 'none',
          background: 'transparent',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
        }}
      >
        <i className="fas fa-cog" style={{ fontSize: '16px' }}></i>
      </button>

      {isOpen && (
        <div
          className="position-absolute"
          style={{
            top: '50%',
            right: '100%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            backgroundColor: 'black',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            minWidth: '160px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            marginRight: '8px'
          }}
        >
          {actions.map((action, index) => {
            const isDisabled = action.disabled ? action.disabled(row) : false;
            return (
              <button
                key={index}
                className="btn btn-link w-100 text-start actions-dropdown-item"
                onClick={() => {
                  if (!isDisabled) {
                    action.onClick(row);
                    setIsOpen(false);
                  }
                }}
                disabled={isDisabled}
                style={{
                  color: isDisabled ? 'rgba(255, 255, 255, 0.4)' : 'white',
                  padding: '10px 15px',
                  border: 'none',
                  borderRadius: index === 0 ? '8px 8px 0 0' : index === actions.length - 1 ? '0 0 8px 8px' : '0',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  fontWeight: 'normal',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  borderBottom: index < actions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',

                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'transparent'
                }}

              >
                <i className={`${action.icon}`} style={{ width: '16px', marginRight: '10px' }}></i>
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;