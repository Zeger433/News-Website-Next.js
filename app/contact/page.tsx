"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import {
  contactInfo,
  contactDetails,
  contactForm,
  faqData,
  bannerImage
} from "@/app/data/articles";

export default function Contact() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setFormData({ name: "", email: "", phone: "", message: "" });
      
      
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <main>
      <Header />

    
      <div className="abo">
        <div className="redcon"></div>
        <h1 className="aboutus">{contactInfo.title}</h1>
        <p className="hea">{contactInfo.subtitle}</p>
      </div>

    
      <div className="contact-info-section">
        {contactDetails.map((item) => (
          <div key={item.id} className="contact-info-item">
            <div className="icon-wrapper">
              <img
                src={item.iconUrl}
                alt={item.alt}
                className="contact-icon"
              />
            </div>
            <div className="contact-details">
              <h4 className="contact-label">{item.label}</h4>
              <p className="contact-value">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

    
      <section className="cont">
        <div className="contact-wrapper">
          
          <div className="contact-image-wrapper">
            <img
              className="contact-image"
              src={contactForm.imageUrl}
              alt="Contact us"
            />
            <div className="image-overlay-text">
              <h2>{contactForm.imageOverlayTitle}</h2>
              <p>{contactForm.imageOverlaySubtitle}</p>
            </div>
          </div>

          
          <div className="contact-form-wrapper">
            <h1 className="form-title">{contactForm.title}</h1>
            <p className="form-subtitle">{contactForm.subtitle}</p>

          
            {isSubmitted && (
              <div className="success-message">
                ✅ Thank you! Your message has been sent. We'll get back to you soon.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="field-label">Name*</label>
                <input
                  type="text"
                  name="name"
                  className="field-input"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="field-label">Email*</label>
                <input
                  type="email"
                  name="email"
                  className="field-input"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="field-label">Phone*</label>
                <input
                  type="tel"
                  name="phone"
                  className="field-input"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="field-label">Message*</label>
                <textarea
                  name="message"
                  className="field-textarea"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-agreement">
                <p>
                  By reaching out to us, you agree to our <a href="/privacy" className="privacy-link">Privacy Policy</a>.
                </p>
              </div>

              <button 
                type="submit" 
                className="send-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>
        </div>
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
    </main>
  );
}