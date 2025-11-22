import React from 'react';


const PageHeader = ({ title, sliderAreaClass = "slider-area2", backgroundImage }) => {
  const getBackgroundImage = (image) => {
    if (typeof image === 'string' && image.startsWith('http')) {
      // It's a URL
      return `url("${image}")`;
    } else if (image) {
      // It's an imported image
      return `url(${image})`;
    }
    return 'none';
  };

  const style = backgroundImage ? {
    backgroundImage: getBackgroundImage(backgroundImage),
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  } : {};

  console.log('PageHeader props:', { title, sliderAreaClass, backgroundImage });
  console.log('Applied style:', style);

  return (
    <div className={sliderAreaClass} style={style}>
      <div className="slider-height2 d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="hero-cap hero-cap2 pt-70">
                <h2>{title}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;