import React from 'react';
import './assets/css/style.css';
import PageHeader from './PageHeader';
//import './video-icon.css';
import { WOW } from 'wowjs';
import { useEffect } from 'react';
import './assets/css/flaticon.css';
import bgImage from './assets/img/hero/something3.png';


const Setup = ({ showHeader = true , showSetupBanner = true}) => {

  const content=(
    <section className="choseus-section spad">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="section1-title">
            <span>SETUP STEPS:</span>
            <h2>HOW DOES IT WORK?</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 col-sm-6">
          <div className="cs-item">
            <span className="letter-icon">1</span>  
            <h4>1. Place your order</h4>
            <p style={{ color: 'whitesmoke' }}>
              Place your order in the pricing table by choosing your preferred subscription period.
            </p>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="cs-item">
          <span className="letter-icon">2</span>  
            <h4>2. Get your account</h4>
            <p style={{ color: 'whitesmoke' }}>
              This process can take 5 to 15 minutes. Check your inbox and spam folder. For faster service, contact us via WhatsApp.
            </p>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="cs-item">
          <span className="letter-icon">3</span>  
            <h4>3. Login on APP</h4>
            <p style={{ color: 'whitesmoke' }}>
              Use the credentials you received to login. We encourage using IBO Player for efficiency.
            </p>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="cs-item">
          <span className="letter-icon">4</span>  
            <h4>4. Enjoy watching TV</h4>
            <p style={{ color: 'whitesmoke' }}>
              Enjoy all channels, films, and series. Immerse yourself in endless entertainment with StreamLine TV.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
    useEffect(() => {
    const wow = new WOW({ live: false });
    wow.init();
  }, []);
  const setup_content =(
  <section className="home-blog-area pt-10 pb-50">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9 col-sm-10">
          <div className="section-tittle text-center mb-100 wow fadeInUp "data-wow-duration="2s" data-wow-delay=".2s">
            <h2>SETUP</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-6 col-lg-6 col-md-6">
          <div className="home-blog-single mb-30 wow fadeInUp" data-wow-duration="2s" data-wow-delay=".6s">
            <div className="blog-img-cap">
              <div className="blog-img">
                <img src="https://i.postimg.cc/hvyGW8jM/IBO-RESIZE.jpg" alt="IBO Setup" />
              </div>
              <div className="blog-cap">
                <span>Setup for IBO PLAYER</span>
                <h3><a href="https://tinyurl.com/yvtzdba7" target="_blank" rel="noopener noreferrer">Looking for Speed & Efficiency?</a></h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6">
          <div className="home-blog-single mb-30 wow fadeInUp" data-wow-duration="2s" data-wow-delay=".6s">
            <div className="blog-img-cap">
              <div className="blog-img">
                <img src="https://i.postimg.cc/8CRPPgc7/SMARTER2-EDITED.jpg" alt="Smarters Setup" />
              </div>
              <div className="blog-cap">
                <span>Setup for SMARTERS PRO PLAYER</span>
                <h3><a href="https://www.iptvsmarters.com/" target="_blank" rel="noopener noreferrer">Looking for Usability on All Devices?</a></h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  );
  const SetupBanner = () => (
    <div className="video-area section-bg2 d-flex align-items-center"     style={{ backgroundImage: `url("https://i.postimg.cc/tJCgMvXY/editme.png")` }} >
    <div className="container">
        <div className="video-wrap position-relative">
            <div className="video-icon" >
                <a className=" " href="whatsapp://send?phone=+27671473686&text=Hello, Hello, Stream Line TV I would like to watch Sports for free"><i className="fa fa-play"></i></a>
            </div>
        </div>
    </div>
</div>
  );
  return (
    <>
      {showHeader && <PageHeader title="SETUP"  backgroundImage={bgImage}/>}
      {content}{setup_content}{showSetupBanner && <SetupBanner />}
    </>
  );
};
export default Setup;