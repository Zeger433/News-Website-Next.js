"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const deleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories(categories.filter((c: any) => c.id !== id));
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div>
      {categories.length === 0 ? (
        <div className="admin-empty-state">
          <p>No categories yet. Create your first category!</p>
          <Link
            href="/admin/categories/new"
            className="admin-btn-primary"
            style={{ display: "inline-block", marginTop: "16px" }}
          >
            Create Category
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Color</th>
                <th>Articles</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category: any) => (
                <tr key={category.id}>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: category.color || "#ccc",
                        marginRight: "10px",
                      }}
                    ></span>
                    <strong>{category.name}</strong>
                  </td>
                  <td>{category.slug}</td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 10px",
                        background: category.color || "#ccc",
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {category.color || "#ccc"}
                    </span>
                  </td>
                  <td>{category.articles?.length || 0}</td>
                  <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="admin-btn-edit"
                      >
                        <Edit size={14} /> Edit
                      </Link>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="admin-btn-delete"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
