import React from 'react';

const InfoCard = ({ title, children, className = '' }) => {
  return (
    <div 
      className={className}
      style={{
        backgroundColor: 'black',
        border: '2px solid red',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        color: 'white'
      }}
    >
      {title && <h5 style={{ color: 'white', marginBottom: '15px' }}>{title}</h5>}
      {children}
    </div>
  );
};

export default InfoCard;