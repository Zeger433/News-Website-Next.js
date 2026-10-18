"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { privacyContent, privacySections, bannerImage } from "@/app/data/articles";

export default function Privacy() {
  return (
    <>
      <Header />
      
      <div className="abo">
        <div className="redcon"></div>
        <h1 className="aboutus">{privacyContent.title}</h1>
        <h6 className="hea">{privacyContent.lastUpdated}</h6>
        <div className="privacy-policy">
          {privacySections.map((section) => (
            <div key={section.id} className="privacy-section">
              <h2 className="section-title">{section.title}</h2>
              {section.content.map((paragraph, index) => (
                <p key={index} className="section-text">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <img
        className="clas"
        src={bannerImage.imageUrl}
        alt="image"
      />
      <div className="blu">
        <h1 className="nam">Join 1M+ Readers </h1>
        <h1 className="nam">who never miss a headline. </h1>

        <p className="namm">
          Stay informed wherever you are — join our growing community
        </p>
        <p className="namm">
          of readers and followers across social platforms.
        </p>
        <button className="buton">Subscribe</button>
      </div>

      <Footer />
    </>
  );
}