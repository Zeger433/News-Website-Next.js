"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";  // ← ADD THIS
import {
  subscriptionContent,
  subscriptionPlans,
  whySubscribe,
  readerReviews,
  quoteIcon,
  bannerImage
} from "@/app/data/articles";

export default function Subscription() {
  const router = useRouter();  // ← ADD THIS
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ← ADD THIS FUNCTION
  const handleSubscribeClick = () => {
    router.push('/contact');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log("Newsletter subscribed:", email);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail("");
      
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <main>
      <Header />
      
      <div className="abo">
        <div className="redcon"></div>
        <h1 className="aboutus">{subscriptionContent.title}</h1>
        <p className="hea">{subscriptionContent.subtitle}</p>
      </div>

      <section className="subscription-plans">
        <div className="plans-grid">
          {subscriptionPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`plan-card ${plan.isPopular ? "popular-plan" : ""}`}
            >
              {plan.isPopular && (
                <div className="popular-badge">Most Popular</div>
              )}
              
              <div className="plan-card-header">
                <h3 className="plan-card-title">{plan.name}</h3>
                <div className="plan-price">
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-period">{plan.period}</span>
                </div>
                <p className="plan-billing">{plan.billing}</p>
              </div>

              <div className="plan-card-body">
                <p className="plan-description">{plan.description}</p>

                <ul className="plan-features-list">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="plan-card-footer">
                {/* ← CHANGE THIS BUTTON */}
                <button 
                  className={`plan-subscribe-btn ${plan.buttonClass || ""}`}
                  onClick={handleSubscribeClick}  // ← ADD THIS
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="foot">
        <div className="rigg">
          <h1 className="heaadi">Subscribe to Our Newsletter to Stay</h1>
          <h1 className="heaadi">ahead with daily headlines.</h1>
        </div>
        <div className="leff">
          {isSubmitted && (
            <div className="success-message" style={{ marginBottom: "10px" }}>
              ✅ Thank you! You've been subscribed to our newsletter.
            </div>
          )}
          <form onSubmit={handleNewsletterSubmit} style={{ display: "flex", gap: "10px" }}>
            <input
              className="emai"
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="email" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </section>

      <section className="newsp">
        <div className="neww">
          <h1>{whySubscribe.title}</h1>
          <p className="place">{whySubscribe.description}</p>
          <p className="subscrip">{whySubscribe.subtitle}</p>
          <ul className="unlist">
            {whySubscribe.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
        <div className="neww">
          <img src={whySubscribe.imageUrl} alt="picv" />
        </div>
      </section>

      <div className="containerr">
        <div className="headeer">
          <div className="headingWrapper">
            <div className="redBox"></div>
            <h1 className="creators">What our Readers Say</h1>
          </div>
        </div>
      </div>

      <section className="gards">
        {readerReviews.map((review) => (
          <div key={review.id} className="gard">
            <img src={quoteIcon} alt="quote" />
            <p>{review.review}</p>
            <img className="readers" src={review.imageUrl} alt={review.name} />
            <h4>{review.name}</h4>
          </div>
        ))}
      </section>

      <img className="clas" src={bannerImage.imageUrl} alt="image" />
      <div className="blu">
        <h1 className="nam">Join 1M+ Readers </h1>
        <h1 className="nam">who never miss a headline. </h1>

        <p className="namm">
          Stay informed wherever you are — join our growing community
        </p>
        <p className="namm">
          of readers and followers across social platforms.
        </p>
        {/* ← CHANGE THIS BUTTON */}
        <button className="buton" onClick={handleSubscribeClick}>
          Subscribe
        </button>
      </div>

      <Footer />
    </main>
  );
}