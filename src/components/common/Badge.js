import React from 'react';

const Badge = ({ variant, children, size = 'sm' }) => {
  const getVariantStyles = (variant) => {
    const variants = {
      // Bootstrap Danger Red variants
      admin: {
        background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
      },
      suspended: {
        background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
      },
      rented: {
        background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
      },
      
      // Sky Blue variants
      customer: {
        background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(135, 206, 235, 0.3)'
      },
      sedan: {
        background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(135, 206, 235, 0.3)'
      },
      petrol: {
        background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(135, 206, 235, 0.3)'
      },
      automatic: {
        background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(135, 206, 235, 0.3)'
      },
      
      // Green variants
      staff: {
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(17, 153, 142, 0.3)'
      },
      active: {
        background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(135, 206, 235, 0.3)'
      },
      available: {
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(17, 153, 142, 0.3)'
      },
      diesel: {
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(17, 153, 142, 0.3)'
      },
      
      // Grey variants
      inactive: {
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(116, 185, 255, 0.3)'
      },
      maintenance: {
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(116, 185, 255, 0.3)'
      },
      // Car types - different colors
      suv: {
        background: 'linear-gradient(135deg, #e17055 0%, #d63031 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(225, 112, 85, 0.3)'
      },
      hatchback: {
        background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(162, 155, 254, 0.3)'
      },
      coupe: {
        background: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(253, 121, 168, 0.3)'
      },
      luxury: {
        background: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(253, 203, 110, 0.3)'
      },
      van: {
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(116, 185, 255, 0.3)'
      },
      
      // Fuel types - different colors
      electric: {
        background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(0, 184, 148, 0.3)'
      },
      hybrid: {
        background: 'linear-gradient(135deg, #55a3ff 0%, #003d82 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(85, 163, 255, 0.3)'
      },
      manual: {
        background: 'linear-gradient(135deg, #ff7675 0%, #d63031 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(255, 118, 117, 0.3)'
      },
      
      // Booking status colors
      cancelled: {
        background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
      },
      confirmed: {
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(17, 153, 142, 0.3)'
      },
      pending: {
        background: 'linear-gradient(135deg, #ff9500 0%, #ff6b35 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(255, 149, 0, 0.3)'
      },
      completed: {
        background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(108, 117, 125, 0.3)'
      }
    };
    
    return variants[variant] || variants.active;
  };

  const getSizeStyles = (size) => {
    const sizes = {
      xs: { padding: '2px 6px', fontSize: '0.7rem' },
      sm: { padding: '3px 8px', fontSize: '0.75rem' },
      md: { padding: '4px 10px', fontSize: '0.8rem' },
      lg: { padding: '6px 12px', fontSize: '0.85rem' }
    };
    
    return sizes[size] || sizes.sm;
  };

  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <span
      style={{
        ...variantStyles,
        ...sizeStyles,
        borderRadius: '20px',
        fontWeight: '600',
        textTransform: 'capitalize',
        display: 'inline-block',
        border: 'none',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        cursor: 'default'
      }}
    >
      {children}
    </span>
  );
};

export default Badge;