"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);

  const [article, setArticle] = useState<any>(null);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    authorId: "",
    categoryId: "",
    status: "draft",
    isFeatured: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [articleRes, authorsRes, categoriesRes] = await Promise.all([
          fetch(`/api/articles/${id}`),
          fetch("/api/authors"),
          fetch("/api/categories"),
        ]);

        const articleData = await articleRes.json();
        const authorsData = await authorsRes.json();
        const categoriesData = await categoriesRes.json();

        setArticle(articleData);
        setAuthors(authorsData);
        setCategories(categoriesData);
        setFormData({
          title: articleData.title || "",
          slug: articleData.slug || "",
          content: articleData.content || "",
          excerpt: articleData.excerpt || "",
          imageUrl: articleData.imageUrl || "",
          authorId: articleData.authorId || "",
          categoryId: articleData.categoryId || "",
          status: articleData.status || "draft",
          isFeatured: articleData.isFeatured || false,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch article data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          authorId: parseInt(formData.authorId),
          categoryId: parseInt(formData.categoryId),
        }),
      });

      if (res.ok) {
        router.push("/admin/articles");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update article");
      }
    } catch (error) {
      alert("Failed to update article");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="admin-empty-state">
        <p>Article not found</p>
        <Link
          href="/admin/articles"
          className="admin-btn-secondary"
          style={{ marginTop: "16px" }}
        >
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Edit Article</h1>
      <p className="admin-page-subtitle">Update your article details</p>

      <form onSubmit={handleSubmit} className="admin-form-wrapper">
        <div className="admin-form-group">
          <label className="admin-form-label">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            name="title"
            className="admin-form-control"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter article title"
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
            placeholder="e.g., my-article-title"
          />
          <div className="admin-form-hint">
            URL-friendly version of the title
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">
              Author <span className="required">*</span>
            </label>
            <select
              name="authorId"
              className="admin-form-control admin-select"
              value={formData.authorId}
              onChange={handleChange}
              required
            >
              <option value="">Select Author</option>
              {authors.map((author: any) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              Category <span className="required">*</span>
            </label>
            <select
              name="categoryId"
              className="admin-form-control admin-select"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Content</label>
          <textarea
            name="content"
            className="admin-form-control"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            placeholder="Write your article content here..."
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Excerpt</label>
          <textarea
            name="excerpt"
            className="admin-form-control"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            placeholder="Short summary of the article"
          />
          <div className="admin-form-hint">
            Appears on homepage and search results
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            className="admin-form-control"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Status</label>
            <select
              name="status"
              className="admin-form-control admin-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div
            className="admin-form-group"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingTop: "28px",
            }}
          >
            <label className="admin-form-label" style={{ marginBottom: 0 }}>
              <input
                type="checkbox"
                name="isFeatured"
                className="admin-checkbox"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              Featured Article
            </label>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Update Article"}
          </button>
          <Link href="/admin/articles" className="admin-btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
