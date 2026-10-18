"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address");
      return;
    }

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
    <footer>
      <section className="foot">
        <div className="rigg">
          <h1 className="heaadi">Subscribe to Our Newsletter to Stay</h1>
          <h1 className="heaadi"> ahead with daily headlines.</h1>
        </div>
        <div className="leff" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {isSubmitted && (
            <div style={{ 
              color: "green", 
              fontSize: "14px",
              fontWeight: "500"
            }}>
              ✅ Thank you! You've been subscribed.
            </div>
          )}
          {error && (
            <div style={{ 
              color: "red", 
              fontSize: "14px"
            }}>
              ❌ {error}
            </div>
          )}
          <form 
            onSubmit={handleNewsletterSubmit} 
            style={{ 
              display: "flex", 
              alignItems: "center",
              gap: "10px",
              width: "100%"
            }}
          >
            <input
              className="emai"
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              style={{ 
                flex: 1,
                height: "48px",
                padding: "0 15px",
                border: "2px solid #e1e5f0",
                borderRadius: "8px",
                fontSize: "14px",
                background: "#f8f9fc",
                outline: "none"
              }}
            />
            <button 
              className="email" 
              type="submit"
              disabled={isSubmitting}
              style={{ 
                height: "48px",
                padding: "0 30px",
                background: "white",  // Full white background
                color: "black",       // Black text
                border: "2px solid white",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
                opacity: isSubmitting ? 0.7 : 1,
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = "#f0f0f0";
                  e.currentTarget.style.borderColor = "#f0f0f0";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.borderColor = "white";
                }
              }}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </section>

      {/* Rest of your footer sections remain the same */}
      <section className="bfot">
        <div className="bfo">
          <h1 className="pres">PressPoint</h1>
          <p className="leade">
            World leaders gathered in Geneva to discuss urgent
          </p>
          <p className="leade">
            actions for global warming, pledging new commitments.
          </p>
        </div>
        <div className="links">
          <p className="page">Pages</p>
          <Link className="hre" href="/">
            Home
          </Link>
          <Link className="hre" href="/about">
            About Us
          </Link>
          <Link className="hre" href="/authors">
            Authors
          </Link>
          <Link className="hre" href="/subscription">
            Subscription
          </Link>
        </div>
        <div className="links">
          <p className="page">Pages</p>
          <Link className="hre" href="/contact">
            Contact Us
          </Link>
          <a className="hre" href="#">
            Change Log
          </a>
          <a className="hre" href="#">
            License
          </a>
          <a className="hre" href="#">
            404 Error
          </a>
        </div>
        <div className="links">
          <p className="page">Contact Us</p>
          <p className="office">Head Office: 123 PressPoint, New York, USA.</p>
          <p className="office">Phone: +1 (000) 123-4567</p>
          <p className="office">Email: contact@presspoint.com</p>
        </div>
      </section>

      <section className="icon">
        <p className="foll">Follow us on :</p>
        <div className="socials">
          <a className="soci" href="#">
            <img
              src="https://cdn.prod.website-files.com/692401e8be8549a781fdbb92/692401e8be8549a781fdbcbb_Social%20icons%20(3).svg"
              alt="twitter"
            />
          </a>
          <a className="soci" href="#">
            <img
              src="https://cdn.prod.website-files.com/692401e8be8549a781fdbb92/692401e8be8549a781fdbcbd_Social%20icons%20(4).svg"
              alt="facebook"
            />
          </a>
          <a className="soci" href="#">
            <img
              src="https://cdn.prod.website-files.com/692401e8be8549a781fdbb92/692401e8be8549a781fdbcbc_instagram%201%20(1).svg"
              alt="insta"
            />
          </a>
          <a className="soci" href="#">
            <img
              src="https://cdn.prod.website-files.com/692401e8be8549a781fdbb92/692401e8be8549a781fdbcba_Social%20icons%20(5).svg"
              alt="linkedin"
            />
          </a>
        </div>
      </section>

      <div className="lastt">
        <p className="point">
          © 2025 PressPoint. All Rights Reserved. Powered by Webflow
        </p>
      </div>
    </footer>
  );
}