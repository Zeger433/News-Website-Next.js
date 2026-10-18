"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { useCart } from "@/app/contexts/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();

  const parsePrice = (priceStr: string): number => {
    const match = priceStr.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );

  return (
    <>
      <Header />

      <main style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>Shopping Cart</h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 18, color: "#666", marginBottom: 24 }}>
              Your cart is empty.
            </p>
            <Link
              href="/shop"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                background: "#000",
                color: "#fff",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <>
            <div>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, margin: 0 }}>{item.name}</h3>
                    <p style={{ fontSize: 14, color: "#666", margin: "4px 0 0" }}>
                      {item.price}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: 28,
                        height: 28,
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: 16,
                      }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: 24, textAlign: "center" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: 28,
                        height: 28,
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: 16,
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#c00",
                      cursor: "pointer",
                      fontSize: 14,
                      padding: "4px 8px",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 24,
                paddingTop: 16,
                borderTop: "2px solid #000",
              }}
            >
              <div>
                <p style={{ fontSize: 14, margin: 0 }}>
                  {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
                </p>
                <p style={{ fontSize: 22, fontWeight: 700, margin: "4px 0 0" }}>
                  Total: ${totalPrice.toFixed(2)}
                </p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={clearCart}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
