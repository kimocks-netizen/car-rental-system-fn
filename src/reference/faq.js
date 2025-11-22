import React, { useState, useEffect } from 'react';
import './styles/css/App.css'; // Assuming you have a CSS file for styling
import "./assets/css/style.css";
import PageHeader from './PageHeader';
import { WOW } from 'wowjs';
import faqBackground from './assets/img/hero/FAQ1-RESIZED.jpg';

const Faq = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAnswer = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    };
  

  const [isVisible, setIsVisible] = useState(false);
  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY >0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top coordinate to 0
  // Make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    const wow = new WOW({ live: false });
    wow.init();
  }, []);


  const faqs = [
    { question: 'What is IPTV?', answer: 'IPTV (Internet Protocol Television) is a digital television service that is delivered over the internet instead of traditional cable or satellite.' },
    { question: 'How does IPTV work?', answer: 'IPTV uses internet protocol to deliver TV channels and content to your device. It requires a stable internet connection and a compatible device such as a smart TV, set-top box, or streaming device.' },
    { question: 'What channels are included in your IPTV service?', answer: 'Our IPTV service includes a wide range of channels, including news, sports, entertainment, and more. Check our channel list on the website for details.' },
    { question: 'How do I set up IPTV on my device?', answer: 'We provide easy-to-follow setup guides on our website. Choose your device and follow the step-by-step instructions.' },
    { question: 'What guarantees do you offer regarding the quality of service?', answer: 'We offer the best performing IPTV service. Our servers are equipped with high bandwidth and antifreeze technology. We also offer a fast delivery service for orders by e-mail. If one of your subscriptions does not work, we always solve the problem or offer alternative subscriptions.' },
    { question: 'How will I receive my subscription?', answer: 'After making a payment you’ll be contacted via email in less than 1 hour with your logins credentials.' },
    { question: 'Can I request a refund?', answer: 'Sure, You will be welcomed to request for a refund within 24 Hour after subscribing to any paid plan.' },
    { question: 'Does this service work in my country?', answer: 'Streamline TV services are available in many countries. Please check our website for a full list of supported regions.' },
    { question: 'How do I contact customer support?', answer: 'You can contact our customer support team via email, phone or whatsapp. Our contact details are listed on our website.' },
  ];

  return (
    <div className="black-bg">
     {/* Slider Area */}
     <PageHeader title="FAQ" sliderAreaClass="slider-area4"  backgroundImage={faqBackground} />
      <main>
       
        {/* FAQ Section */}
        <section className="pricing-area section-padding30 fix">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="section-tittle text-center mb-55 wow fadeInUp "data-wow-duration="2s" data-wow-delay=".2s">
                  <h2>FAQ</h2>
                </div>
              </div>

              <div className="faq-container section-tittle wow fadeInUp "data-wow-duration="2s" data-wow-delay=".3s">
                <h2 style={{ fontSize: 'xxx-large', textAlign: 'center' }}>Frequently Asked Questions</h2>

                {faqs.map((faq, index) => (
                  <div className={`faq-item ${activeIndex === index ? 'active' : ''}`}  key={index}>
                    <div className="faq-question" onClick={() => toggleAnswer(index)}>
                      <h3>{faq.question}</h3>
                    </div>
                    {activeIndex === index && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Back to top */}
      {isVisible && (
        <div id="back-top" onClick={scrollToTop}>
          <button title="Go to Top">
            <i className="fas fa-level-up-alt"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Faq;
