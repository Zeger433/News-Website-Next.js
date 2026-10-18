"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaNewspaper,
} from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            router.push("/admin");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();

    // Auto-fill remembered email
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save remember me
      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Redirect to admin panel
      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      setServerError(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.header}>
          <div style={styles.logoIcon}>
            <FaNewspaper size={32} color="white" />
          </div>
          <h1 style={styles.title}>Presspoint News</h1>
          <p style={styles.subtitle}>Admin Panel Login</p>
        </div>

        {/* Error Message */}
        {serverError && <div style={styles.errorMessage}>{serverError}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaEnvelope style={styles.inputIcon} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
              }}
              disabled={loading}
            />
            {errors.email && (
              <span style={styles.fieldError}>{errors.email}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaLock style={styles.inputIcon} />
              Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.password ? styles.inputError : {}),
                }}
                disabled={loading}
              />
              <button
                type="button"
                style={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span style={styles.fieldError}>{errors.password}</span>
            )}
          </div>

          <div style={styles.formOptions}>
            <label style={styles.rememberMe}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            <a href="#" style={styles.forgotLink}></a>
          </div>

          <button
            type="submit"
            style={{
              ...styles.loginButton,
              ...(loading ? styles.loginButtonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>Secure Admin Access</p>
          <div style={styles.badges}>
            <span style={styles.badge}>🔒 SSL Secure</span>
            <span style={styles.badge}>🛡️ Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "45px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    animation: "slideUp 0.5s ease",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "35px",
  },
  logoIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "70px",
    height: "70px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    borderRadius: "50%",
    marginBottom: "15px",
  },
  title: {
    fontSize: "26px",
    color: "#333",
    margin: "0 0 5px 0",
    fontWeight: 700,
  },
  subtitle: {
    color: "#888",
    fontSize: "15px",
    margin: 0,
  },
  errorMessage: {
    background: "#fee",
    color: "#c0392b",
    padding: "12px 15px",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "20px",
    borderLeft: "4px solid #c0392b",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#555",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  inputIcon: {
    color: "#667eea",
    fontSize: "14px",
  },
  input: {
    padding: "12px 15px",
    border: "2px solid #e1e5f0",
    borderRadius: "10px",
    fontSize: "14px",
    transition: "all 0.3s ease",
    background: "#f8f9fc",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  fieldError: {
    color: "#e74c3c",
    fontSize: "12px",
    marginTop: "4px",
  },
  passwordWrapper: {
    position: "relative" as const,
  },
  togglePassword: {
    position: "absolute" as const,
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#999",
    cursor: "pointer",
    padding: "5px",
    fontSize: "16px",
  },
  formOptions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "5px",
  },
  rememberMe: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#666",
    cursor: "pointer",
  },
  forgotLink: {
    color: "#667eea",
    textDecoration: "none",
    fontSize: "14px",
  },
  loginButton: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "5px",
  },
  loginButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  spinner: {
    display: "inline-block",
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTopColor: "white",
    animation: "spin 0.8s ease infinite",
  },
  footer: {
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #e1e5f0",
    textAlign: "center" as const,
  },
  footerText: {
    color: "#888",
    fontSize: "13px",
    margin: "0 0 10px 0",
  },
  badges: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap" as const,
  },
  badge: {
    background: "#f8f9fc",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#666",
    border: "1px solid #e1e5f0",
  },
};

// Add keyframes for animations
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);
}
