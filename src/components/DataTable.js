import React from 'react';

const DataTable = ({ title, data, columns, actions }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{
        backgroundColor: 'black',
        border: '2px solid red',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        color: 'white'
      }}>
        <h5 style={{ color: 'white', marginBottom: '15px' }}>{title}</h5>
        <p style={{ color: 'white', margin: 0 }}>No data available</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'black',
      border: '2px solid red',
      borderRadius: '15px',
      padding: '25px',
      marginBottom: '20px',
      color: 'white',
      boxShadow: '0 4px 15px rgba(255, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid rgba(255, 0, 0, 0.3)'
      }}>
        <h5 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>{title}</h5>
        <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{data.length} records</span>
      </div>
      
      <div style={{ 
        borderRadius: '12px', 
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'rgba(255, 255, 255, 0.02)'
        }}>
          <thead>
            <tr style={{
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              borderBottom: '2px solid rgba(255, 0, 0, 0.3)'
            }}>
              {columns.map((col, index) => (
                <th key={index} style={{
                  color: 'white',
                  padding: '15px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>{col.header}</th>
              ))}
              {actions && (
                <th style={{
                  color: 'white',
                  padding: '15px 20px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={{
                    color: 'white',
                    padding: '12px 20px',
                    fontSize: '0.95rem',
                    verticalAlign: 'middle',
                    lineHeight: '1.4'
                  }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td style={{
                    padding: '12px 20px',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          className={`btn ${action.className}`}
                          onClick={() => action.onClick(row)}
                          title={action.title}
                          style={{
                            width: '36px',
                            height: '36px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            border: 'none',
                            background: 'transparent',
                            padding: '0',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;