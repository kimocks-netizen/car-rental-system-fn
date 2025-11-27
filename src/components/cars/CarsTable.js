import React from 'react';
import DataTable from '../DataTable';
import Badge from '../common/Badge';

const CarsTable = ({ cars, userRole = 'admin', onPreview, onEdit, onDelete, showBookings = false, isPreviewOpen = false, totalCount }) => {
  
  const carColumns = [
    { 
      key: 'image_url', 
      header: 'Image',
      render: (imageUrl) => (
        <img 
          src={imageUrl || '/photos/car1.jpg'} 
          alt="Car" 
          style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
        />
      )
    },
    { key: 'brand', header: 'Brand' },
    { key: 'model', header: 'Model' },
    { 
      key: 'type', 
      header: 'Type',
      render: (type) => <Badge variant={type}>{type}</Badge>
    },
    { key: 'year', header: 'Year' },
    ...(!isPreviewOpen ? [{ 
      key: 'daily_rate', 
      header: 'Daily Rate',
      render: (rate) => `£${rate}`
    }] : []),
    ...(!isPreviewOpen ? [{ 
      key: 'availability_status', 
      header: 'Status',
      render: (status, car) => {
        const isAvailable = (car.available_quantity || 1) > 0;
        return (
          <span style={{
            backgroundColor: isAvailable ? '#28a745' : '#dc3545',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: '500',
            textTransform: 'capitalize'
          }}>
            {isAvailable ? 'Available' : 'Not Available'}
          </span>
        );
      }
    }] : []),
    ...(!isPreviewOpen ? [{ 
      key: 'available_quantity', 
      header: 'Available',
      render: (available, car) => `${available || 1}/${car.total_quantity || 1}`
    }] : []),
    ...(showBookings && !isPreviewOpen ? [{
      key: 'activeBookings',
      header: 'Booked',
      render: (count) => (
        <span style={{
          backgroundColor: count > 0 ? '#ff8c00' : '#6c757d',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}>
          {count || 0}
        </span>
      )
    }] : [])
  ];

  const getCarActions = () => {
    const actions = [];
    
    // Preview action (available to all roles)
    if (onPreview) {
      actions.push({
        label: <i className="fas fa-eye" style={{color: '#17a2b8'}}></i>,
        className: 'btn-link',
        onClick: onPreview,
        title: 'Preview Car'
      });
    }
    
    // Edit action (available to admin and staff)
    if (onEdit && (userRole === 'admin' || userRole === 'staff')) {
      actions.push({
        label: <i className="fas fa-edit" style={{color: 'white'}}></i>,
        className: 'btn-link',
        onClick: onEdit,
        title: 'Edit Car'
      });
    }
    
    // Delete action (only available to admin)
    if (onDelete && userRole === 'admin') {
      actions.push({
        label: <i className="fas fa-trash" style={{color: '#dc3545'}}></i>,
        className: 'btn-link',
        onClick: onDelete,
        title: 'Delete Car'
      });
    }
    
    return actions;
  };

  return (
    <DataTable 
      title={`All Cars (${totalCount || cars.length})`}
      data={cars}
      columns={carColumns}
      actions={getCarActions()}
    />
  );
};

export default CarsTable;