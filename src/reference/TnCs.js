import React from 'react';
import PageHeader from './PageHeader';
import "./assets/css/style.css";
import { WOW } from 'wowjs';
import { useEffect } from 'react';
import tncBackground from './assets/img/hero/TnCs.jpg';

const TNCS = () => {
  useEffect(() => {
    const wow = new WOW({ live: false });
    wow.init();
  }, []);


  return (
    <div className="black-bg">
  
        {/* Hero Start */}
        <PageHeader title="T&Cs" sliderAreaClass="slider-area3" backgroundImage={tncBackground}/>
        {/* Hero End */}

        {/* Courses Area Start */}
        <main>
        <section className="pricing-area section-padding30 fix">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="section-tittle text-center mb-55 wow fadeInUp "data-wow-duration="2s" data-wow-delay=".2s">
                  <h2>T&Cs</h2>
                </div>
              </div>
            </div>
            <div className="properties__card wow fadeInUp "data-wow-duration="2s" data-wow-delay=".4s">
              <div className="features-caption tnc-txt-color">
                <p>By opening an Account with StreamLine You agree to the following TnCs:</p>
                <p>StreamLive TV does not monitor your history, browsing history, what you are watching etc.</p>
                <p>
                  StreamLine TV offers account with Adult Content, before opening your account we first ask you if you
                  wish to have adult content, and we can only include this content if you said "YES"
                </p>
                <p>
                  In the event that you have decided to change your mind for example requesting adult content to be added
                  or removed. Unfortunately, we won't be able to make changes.
                </p>
                <p>
                  Our accounts only support one view at a time, you are allowed to login on max of 5 devices but you are
                  not allowed to stream on more than one device at once.
                </p>
                <p>
                  In the event that you breached the rule above and your account will be resulted in locked. Streamline
                  TV is not reliable for any loss caused by breaching out T&Cs.
                </p>
                <p>
                  Streamline TV is supported in over 100 countries around the world. In the event that our TV is
                  suspended in your country due to certain broadcasting laws in your country of living,
                </p>
                <p>
                  Streamline TV will remain unreliable for this but however as a way of compensating you the following
                  may happen:
                </p>
                <p>We will advise you on which VPN to use in order to encounter this suspension.</p>
                <p>
                  We will look for another service which works in your country of living and sell you a new package with
                  20-50% off depending on the assessment and impact of loss which may have been caused to you.
                </p>
                <p>
                  <strong>REFUND POLICY:</strong> Sure, You will be welcomed to request for a refund within 24 hours
                  after subscribing to any paid plan.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TNCS;
