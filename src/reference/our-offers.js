import '../styles/css/App.css';
import React , { useEffect, useState } from 'react';
import PageHeader from './PageHeader';
import '../styles/css/video-icon.css';
import { WOW } from 'wowjs';
//import OwlCarousel from 'react-owl-carousel';
//import '../assets/css/owl.carousel.min.css';
import '../styles/css/temp-video-icon.scss';
import bgImage from '../assets/img/hero/something3.png';
import axios from "axios";


const OfferCard = ({ image, title, description }) => (
  <div className="col-lg-4 col-md-6 col-sm-4" >
    <div className="single-cat text-center mb-30 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
      <div className="cat-icon">
        <img src={image} alt="" width="362" height="300" />
      </div>
      <div className="cat-cap">
        <h5>
          <a href="./pricing">{title}</a>
        </h5>
        <p>{description}</p>
      </div>
    </div>
  </div>
);

const OurOffers = ({ showHeader = true, showSpiderman = true, showRotateContent=true, showContent=true}) => {
  const [row1Images, setRow1Images] = useState([]);
  useEffect(() => {
    // Fetch uploaded images for Row 1
    axios.get("/api/images/row1")
      .then((response) => {
        setRow1Images(response.data);
      })
      .catch(() => {
        // Silently ignore errors - API might not be available
        setRow1Images([]);
      });
  }, []);

  const offers = [
    {
      image: "https://i.postimg.cc/fWBy9sKX/rsz-livetv-downscale.jpg",
      title: "Live 4K TV",
      description: "You'll get access to over 22 000 live TV Channels across the World. From Europe, South Africa, Asia & America etc."
    },
    {
      image: "https://i.postimg.cc/bw2wWtjH/rsz-1money-edt.png",
      title: "Series",
      description: "You'll get access to over 80 000 Latest and Trending Series from Netflix, Amazon Prime, Apple TV & Disney etc."
    },
    {
      image: "https://i.postimg.cc/mrfgsgLx/rsz-movies-edt.jpg",
      title: "Movies",
      description: "You'll get access to over 98 000 Latest and Trending Movies from Netflix, Amazon Prime, Apple TV & Disney etc."
    }
  ];
  useEffect(() => {
    const wow = new WOW({ live: false });
    wow.init();
  }, []);


  const Content = () => (
    <section className="team-area fix">
    <div className="container">
      <div className="row">
        <div className="col-xl-12">
          <div className="section-tittle text-center mb-55 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".1s">
            <h2>What We Offer</h2>
          </div>
        </div>
      </div>
      <div className="row">
        {offers.map((offer, index) => (
          <OfferCard key={index} {...offer} />
        ))}
      </div>
    </div>
  </section>
  );
  const RotateContent = () => (
    <div className="carousel-container section-tittle text-center mb-55 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".1s">
    <h2 style={{ fontSize: "xxx-large" }}>Top Trends</h2>
    <div className="carousel-row row-right-to-left ">
          {row1Images.map((image, index) => (
          <img
            key={index}
            src={image.filename.startsWith('http') 
              ? image.filename 
              : `http://localhost:5001/uploads/${image.filename}`
            }
            alt={`Uploaded ${index}`}
            className="highlighted"
          />
        ))}    
   
    </div>
  </div>
  );

const Spiderman = () => (
  <div 
  className="video-area section-bg2 d-flex align-items-center" 
  style={{ backgroundImage: `url("https://i.postimg.cc/vBG842x3/services-bg.png")` }}
>
  <div className="container">
    <div className="video-wrap position-relative">
      <div className=" video-icon ">
        <a 
        
          href="whatsapp://send?phone=+27671473686&text=Hello, Hello, Stream Line TV I would like to watch Spiderman for free."
        >
          <i className="fas fa-play"></i>
        </a>
      </div>
    </div>
  </div>
</div>

);
  return (
    <>

      {showHeader && <PageHeader title="OUR OFFERS"  backgroundImage={bgImage}/>}
      {showContent && <Content/>}{showRotateContent && <RotateContent/>} {showSpiderman && <Spiderman />}
     

    </>
  );
};


export default  OurOffers;