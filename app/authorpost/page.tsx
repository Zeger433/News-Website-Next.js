"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import {
  authorProfile,
  authorArticles,
  faqData,
  bannerImage
} from "@/app/data/articles";

interface FAQ {
  question: string;
  answer: string;
}

export default function AuthorPost() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header />

      <div className="abo">
        <div className="redcon"></div>
        <h1 className="aboutus">All from {authorProfile.name}</h1>
        <p className="hea">{authorProfile.role}</p>
      </div>

    
      <section className="cinema">
        {authorArticles.map((article) => (
          <div key={article.id} className="cin">
            <img
              className="cinpic"
              src={article.imageUrl}
              alt={article.title}
            />
            <p>{article.author} | {article.date}</p>
            <p className="hit">{article.title}</p>
          </div>
        ))}
      </section>
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