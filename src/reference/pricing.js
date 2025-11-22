import React from 'react';
import '../assets/css/style.css';
import checkIcon from '../assets/img/icon/check.svg';
import PageHeader from './PageHeader';
import { WOW } from 'wowjs';
import { useEffect } from 'react';
import bgImage from '../assets/img/hero/something3.png';

const PricingCard = ({ duration, price, isPopular = false }) => {
  const features = [
    "+ 20K Live TV Channels",
    "+ 120K Movies & Series",
    "Updated Movies & Series",
    "SD / HD / FULL HD / 4K",
    "Netflix / Disney+ / Apple TV",
    "NBA, LA LIGA, EPL, ESPN+",
    "24/7 Live Chat Support",
  ];

  return (
    <div className={`col-lg-3 col-md-6 col-sm-6 ${isPopular ? 'plan most-popular' : ''}`}>
      <div className="properties mb-30 wow fadeInUp "data-wow-duration="2s" data-wow-delay=".2s">
        <div className={`properties__card${isPopular ? '_most' : ''}`}>
          <div className="about-icon">
          <div className="letter-icon">$</div>
          </div>
          <div className="properties__caption">
            <span className="month">{duration}</span>
            <p className="mb-25">{price} <span>(One Device)</span></p>
            {features.map((feature, index) => (
              <div className="single-features" key={index}>
                <div className="features-icon">
                  <img src={checkIcon} alt="check icon" />
                </div>
                <div className="features-caption">
                  <p>{feature}</p>
                </div>
              </div>
            ))}
            {isPopular && <div className="ribbon">MOST POPULAR</div>}
            <a
              href={`whatsapp://send?phone=+27671473686&text=Hello, Stream Line TV I would like to purchase a package for ${duration}`}
              className="border-btn border-btn2"
            >
              Buy Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pricing = ({ showHeader = true }) => {
  const pricingPlans = [
    { duration: "1 month", price: "R200" },
    { duration: "3 months", price: "R400" },
    { duration: "1 Year", price: "R1000", isPopular: true },
    { duration: "6 months", price: "R600" },
  ];
  useEffect(() => {
    const wow = new WOW({ live: false });
    wow.init();
  }, []);
  const content = (         
  <section className="pricing-area section-padding30 fix">
    <div className="container">
      <div className="row">
        <div className="col-xl-12">
          <div className="section-tittle text-center mb-55 wow fadeInUp "data-wow-duration="2s" data-wow-delay=".2s">
            <h2>Pricing</h2>
          </div>
        </div>
      </div>
      <div className="row">
        {pricingPlans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>
    </div>
  </section>
  );
  return (
    <>
      {showHeader && <PageHeader title="PRICING"  backgroundImage={bgImage}/>}
      {content}
    </>
  );
};
export default Pricing;
