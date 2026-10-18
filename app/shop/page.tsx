"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { shopProducts, bannerImage } from "@/app/data/articles";
import { useCart } from "@/app/contexts/CartContext";

export default function Shop() {
  const { addToCart } = useCart();

  const sortedProducts = [...shopProducts].sort((a, b) => {
    const priceA = parseFloat(a.price.replace("$", "").replace(" USD", ""));
    const priceB = parseFloat(b.price.replace("$", "").replace(" USD", ""));
    return priceA - priceB;
  });

  const limitedProducts = sortedProducts.slice(0, 6);

  const rows = [];
  for (let i = 0; i < limitedProducts.length; i += 3) {
    rows.push(limitedProducts.slice(i, i + 3));
  }

  const handleAddToCart = (product: (typeof shopProducts)[number]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <>
      <Header />

      <h1 className="shop">Shop With Us</h1>

      {rows.map((row, rowIndex) => (
        <section key={rowIndex} className="things">
          {row.map((product) => (
            <div key={product.id} className="thing">
              <img
                className="shirts"
                src={product.imageUrl}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <h6>{product.price}</h6>
              <button
                onClick={() => handleAddToCart(product)}
                style={{
                  marginTop: 8,
                  padding: "8px 20px",
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </section>
      ))}

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
        <Link
          href="/subscription"
          className="buton"
          style={{ textDecoration: "none", display: "inline-block" }}
        >
          Subscribe
        </Link>
      </div>

      <Footer />
    </>
  );
}
