import React, { useEffect } from 'react';
import '../../assets/css/style.css';
import '../../styles/css/gallery.css';
import '../../assets/css/aminations.css';
import { WOW } from 'wowjs';


const Home = () => {
  useEffect(() => {
    const wow = new WOW({ live: false });
    wow.init();
  }, []);

  return (
    <main>
      <div className="slider-area position-relative" style={{backgroundImage: `url(/photos/hero1.png)`}}>
        <div className="slider-active">
          <div className="single-slider slider-height d-flex align-items-center">
            <div className="container">
              <div className="row">
                <div className="col-xl-12 col-lg-9 col-md-10">
                  <div className="hero__caption">
                    <span className="fadeInLeft" data-delay="0.1s">
                      Premium Car Rental & Vehicle Hire
                    </span>
                    <h1 className="fadeInLeft" data-delay="0.4s">
                      CAR RENTAL SYSTEM
                    </h1>
                    <p>
                      With our car rental service, you can access over 500+ premium vehicles 
                      including sedans, SUVs, luxury cars, and commercial vehicles. Available 
                      24/7 for pickup and delivery. GPS tracking and full insurance coverage.
                    </p>
                    <a href="./pricing" className="border-btn hero-btn2 red-hover slide-in-left" data-delay="0.8s">
                      VIEW PLANS
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Slider Area End */}
      

  <section className="about-area2 fix pb-padding pt-50 pb-80">
      <div className="support-wrapper align-items-center">
        <div className="right-content2">
          {/* Image */}
          <div
            className="right-img wow fadeInUp"
            data-wow-duration="1s"
            data-wow-delay=".1s"
          >
            <img
              src="/small-hero.png"
              alt="Why Choose Our Car Rental"
            />
          </div>
        </div>
        <div className="left-content2">
          {/* Section Title */}
          <div
            className="section-tittle2 mb-20 wow fadeInUp"
            data-wow-duration="1s"
            data-wow-delay=".3s"
          >
            <div className="front-text">
              <h2>Why Choose Us</h2>
              <p>
                We provide premium car rental services with the latest vehicle models:
                Sedans, SUVs, Luxury Cars, Hatchbacks, and Commercial Vehicles. Get 
                reliable transportation with GPS tracking, full insurance coverage, 
                and 24/7 roadside assistance for complete peace of mind.
              </p>
              <p className="mb-40">
                We offer competitive rates, flexible booking options, and instant 
                confirmation. Book now and pay later with our secure payment system.
              </p>
              <a href="/cars" className="border-btn hero-btn2 red-hover">
                View Our Fleet
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    </main>
  );
};

export default Home;