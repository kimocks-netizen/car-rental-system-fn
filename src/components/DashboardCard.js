import React from 'react';
import { Link } from 'react-router-dom';

class DashboardCard extends React.Component {

  render() {
    const { imageSrc, alt, title, description, link, linkText, delay } = this.props;

    return (
      <div className="col-md-4 mb-4">
        <div className="properties mb-30 wow fadeInUp" data-wow-duration="1s" data-wow-delay={delay}>
          <div className="properties__card">
            <div 
              className="about-icon" 
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                padding: '20px'
              }}
            >
              <img 
                src={imageSrc} 
                alt={alt} 
                style={{
                  width: '320px', 
                  height: '320px', 
                  borderRadius: '50%', 
                  border: '3px solid white',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}

              />
            </div>
            <div className="properties__caption" style={{textAlign: 'center'}}>
              <span className="month" style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>{title}</span>
              <p className="mb-25" style={{
                color: '#f0f0f0',
                fontSize: '16px',
                fontWeight: '500',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                marginTop: '10px'
              }}>{description}</p>
              <Link to={link} className="border-btn border-btn2 red-hover" style={{
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '12px 24px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>{linkText}</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardCard;