import React, { useState, useEffect } from "react";
import "../styles/css/ScrollToTopButton.css"; // Include styles for your button

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    isVisible && (
      <button className="scroll-to-top" onClick={scrollToTop}>
        ↑ Top
      </button>
    )
  );
};

export default ScrollToTopButton;
