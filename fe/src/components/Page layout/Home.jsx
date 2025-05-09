import React from "react";
import "./css/Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-quote">"תן לי בני אדם, והנה אני נותן לך נפש"</h1>
      </header>

      <section className="home-banner">
        <div className="banner-placeholder">
          {/* Future image will go here */}
        </div>
      </section>

      <section className="home-cta">
        <p className="cta-text">
          הצטרפו למעגל התרומות שלנו - ביחד נחזק את החברה הישראלית!
        </p>

        <div className="cta-buttons">
          <button className="cta-button">אני רוצה לתרום</button>
          <button className="cta-button secondary">אני זקוק לתרומה</button>
        </div>
      </section>

      <footer className="home-stats">
        <div className="stat">
          <h3>362</h3>
          <p>מבקשי תרומות</p>
        </div>
        <div className="stat">
          <h3>245</h3>
          <p>תורמים פעילים</p>
        </div>
        <div className="stat">
          <h3>587</h3>
          <p>מוצרים נתרמו</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
