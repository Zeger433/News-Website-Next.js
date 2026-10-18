"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const deleteArticle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles(articles.filter((a: any) => a.id !== id));
      } else {
        alert("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article");
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading articles...</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/articles/new" className="admin-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
  <Plus size={18} />
  New Article
</Link>

      {articles.length === 0 ? (
        <div className="admin-empty-state">
          <p>No articles yet. Create your first article!</p>
          <Link href="/admin/articles/new" className="admin-btn-primary" style={{ display: "inline-block", marginTop: "16px" }}>
            Create Article
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article: any) => (
                <tr key={article.id}>
                  <td>
                    <strong>{article.title}</strong>
                  </td>
                  <td>{article.author?.name || "Unknown"}</td>
                  <td>{article.category?.name || "Uncategorized"}</td>
                  <td>
                    <span className={`admin-status-badge ${article.status}`}>
                      {article.status}
                    </span>
                  </td>
                  <td>{new Date(article.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/articles/${article.id}`} className="admin-btn-edit">
                        <Edit size={14} /> Edit
                      </Link>
                      <button onClick={() => deleteArticle(article.id)} className="admin-btn-delete">
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