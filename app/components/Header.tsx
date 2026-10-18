"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/contexts/CartContext";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="header">
      <div className="top-bar">
        <span className="date">July 16, 2026</span>
        <span className="volume">Vol. 127, No. 43,891 $3.50</span>
      </div>

      <div className="header-main">
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1 className="company-name">PressPoint</h1>
        </Link>

        <nav className="nav-menu">
          <div
            className="dropdown-container"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <span className="dropdown-link">
              All Pages <span className="dropdown-arrow">▾</span>
            </span>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link href="/" className="dropdown-item">
                  Home
                </Link>
                <Link href="/about" className="dropdown-item">
                  About
                </Link>
                <Link href="/subscription" className="dropdown-item">
                  Subscription
                </Link>
                <Link href="/authors" className="dropdown-item">
                  Authors
                </Link>
                <Link href="/contact" className="dropdown-item">
                  Contact
                </Link>
                <Link href="/authorpost" className="dropdown-item">
                  Author Post
                </Link>
                <Link href="/shop" className="dropdown-item">
                  Shop with US
                </Link>
                <Link href="/privacy" className="dropdown-item">
                  Privacy Policy
                </Link>
              </div>
            )}
          </div>

          <Link href="/about">About</Link>
          <Link href="/subscription">Subscription</Link>
          <Link href="/authors">Authors</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="header-actions">
          <Link href="/cart" className="cart-icon" style={{ textDecoration: "none", position: "relative" }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.1 15.9 4.5 17 5.4 17H17M17 17C15.9 17 15 17.9 15 19C15 20.1 15.9 21 17 21C18.1 21 19 20.1 19 19C19 17.9 18.1 17 17 17ZM9 19C9 20.1 8.1 21 7 21C5.9 21 5 20.1 5 19C5 17.9 5.9 17 7 17C8.1 17 9 17.9 9 19Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          <Link href="/contact" className="subscribe-btn">
            Subscribe
          </Link>
        </div>
      </div>
    </header>
  );
}
