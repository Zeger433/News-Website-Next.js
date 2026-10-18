"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "#3498db",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/categories");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create category");
      }
    } catch (error) {
      alert("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">Create New Category</h1>
      <p className="admin-page-subtitle">
        Add a new category to organize your content
      </p>

      <form onSubmit={handleSubmit} className="admin-form-wrapper">
        <div className="admin-form-group">
          <label className="admin-form-label">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            className="admin-form-control"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Technology"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">
            Slug <span className="required">*</span>
          </label>
          <input
            type="text"
            name="slug"
            className="admin-form-control"
            value={formData.slug}
            onChange={handleChange}
            required
            placeholder="e.g., technology"
          />
          <div className="admin-form-hint">
            URL-friendly version (lowercase, hyphens instead of spaces)
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Description</label>
          <textarea
            name="description"
            className="admin-form-control"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Brief description of this category"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Icon</label>
          <input
            type="text"
            name="icon"
            className="admin-form-control"
            value={formData.icon}
            onChange={handleChange}
            placeholder="e.g., fa-solid fa-code"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Color</label>
          <input
            type="color"
            name="color"
            className="admin-form-control"
            value={formData.color}
            onChange={handleChange}
            style={{
              width: "60px",
              height: "40px",
              padding: "2px",
              cursor: "pointer",
            }}
          />
        </div>

        <div className="admin-form-actions">
          <button
            type="submit"
            className="admin-btn-primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
          <Link href="/admin/categories" className="admin-btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
