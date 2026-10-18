"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import {
  aboutContent,
  coverageItems,
  missionContent,
  visionContent,
  impactStats,
  teamMembers,
  faqData,
  bannerImage,
  newspaperImage
} from "@/app/data/articles";

interface FAQ {
  question: string;
  answer: string;
}

export default function About() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main>
      <Header />
      
    
      <div className="abo">
        <div className="redcon"></div>
        <h1 className="aboutus">{aboutContent.title}</h1>
        <p className="hea">{aboutContent.subtitle}</p>
      </div>

      
      <section className="source">
        <div className="lefft">
          <h1 className="trus">{aboutContent.heading}</h1>
          <p className="daily">{aboutContent.description}</p>
        </div>

        <div className="rigght">
          <img
            className="beard"
            src={aboutContent.imageUrl}
            alt="paper"
          />
        </div>
      </section>

      
      <div className="containerr">
        <div className="headeer">
          <div className="headingWrapper">
            <div className="redBox"></div>
            <h1 className="creators">Our Coverage</h1>
          </div>
          <a href="#" className="seeAll">
            
          </a>
        </div>
      </div>

      <section className="covera">
        {coverageItems.map((item) => (
          <div key={item.id} className="breakin">
            <h2 className="hee">{item.title}</h2>
            <p className="heee">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="mission">
        <div className="le">
          <div className="containerr">
            <div className="headeer">
              <div className="headingWrapper">
                <div className="redBox"></div>
                <h1 className="creators">{missionContent.title}</h1>
              </div>
            </div>
          </div>
          <p className="ot">{missionContent.description}</p>
        </div>

        <div className="ri">
          <div className="containerr">
            <div className="headeer">
              <div className="headingWrapper">
                <div className="redBox"></div>
                <h1 className="creators">{visionContent.title}</h1>
              </div>
            </div>
          </div>
          <p className="ot">{visionContent.description}</p>
        </div>
      </section>

      <img
        className="newsp"
        src={newspaperImage.imageUrl}
        alt="newsp"
      />

      <div className="containerr">
        <div className="headeer">
          <div className="headingWrapper">
            <div className="redBox"></div>
            <h1 className="creators">Our Impact</h1>
          </div>
        </div>
      </div>

      <section className="ufg">
        {impactStats.map((stat) => (
          <div key={stat.id} className="breakiin">
            <h1 className="heeh">{stat.number}</h1>
            <h4 className="heel">{stat.label}</h4>
            <p className="eww">{stat.description}</p>
          </div>
        ))}
      </section>

      <div className="containerr">
        <div className="headeer">
          <div className="headingWrapper">
            <div className="redBox"></div>
            <h1 className="creators">Our Team</h1>
          </div>
        </div>
      </div>

      <section className="teamm">
        {teamMembers.map((member) => (
          <div key={member.id} className="teaam">
            <img
              className="nigga"
              src={member.imageUrl}
              alt={member.name}
            />
            <h2 className="hein">{member.name}</h2>
            <p className="hei">{member.role}</p>
          </div>
        ))}
      </section>
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

      <div className="faq-section">
        <div className="containerr">
          <div className="headeer">
            <div className="headingWrapper">
              <div className="redBox"></div>
              <h1 className="creators">Frequently Asked Questions</h1>
            </div>
          </div>
        </div>

        <div className="faq-container">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                <span className="faq-icon">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}