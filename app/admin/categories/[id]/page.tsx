"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditCategory({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "#3498db",
  });

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            slug: data.slug || "",
            description: data.description || "",
            icon: data.icon || "",
            color: data.color || "#3498db",
          });
        } else {
          alert("Category not found");
          router.push("/admin/categories");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        alert("Failed to fetch category");
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/categories");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update category");
      }
    } catch (error) {
      alert("Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading category...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Edit Category</h1>
      <p className="admin-page-subtitle">Update category details</p>

      <form onSubmit={handleSubmit} className="admin-form-wrapper">
        <div className="admin-form-group">
          <label className="admin-form-label">Name <span className="required">*</span></label>
          <input
            type="text"
            name="name"
            className="admin-form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Slug <span className="required">*</span></label>
          <input
            type="text"
            name="slug"
            className="admin-form-control"
            value={formData.slug}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Description</label>
          <textarea
            name="description"
            className="admin-form-control"
            value={formData.description}
            onChange={handleChange}
            rows={3}
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
            style={{ width: "60px", height: "40px", padding: "2px", cursor: "pointer" }}
          />
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Update Category"}
          </button>
          <Link href="/admin/categories" className="admin-btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}