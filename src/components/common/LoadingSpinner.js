import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const loaderSize = size === 'sm' ? '32px' : '48px';
  
  return (
    <div className="d-flex justify-content-center">
      <span 
        className="loader" 
        style={{
          width: loaderSize,
          height: loaderSize,
          border: '5px solid #FFF',
          borderBottomColor: '#FF3D00',
          borderRadius: '50%',
          display: 'inline-block',
          boxSizing: 'border-box',
          animation: 'rotation 1s linear infinite'
        }}
      ></span>
      <style jsx>{`
        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;