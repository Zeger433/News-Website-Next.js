"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminAuthors() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthors() {
      try {
        const res = await fetch("/api/authors");
        const data = await res.json();
        setAuthors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAuthors();
  }, []);

  const deleteAuthor = async (id: number) => {
    if (!confirm("Are you sure you want to delete this author?")) return;

    try {
      const res = await fetch(`/api/authors/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAuthors(authors.filter((a: any) => a.id !== id));
      } else {
        alert("Failed to delete author");
      }
    } catch (error) {
      console.error("Error deleting author:", error);
      alert("Failed to delete author");
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading authors...</p>
      </div>
    );
  }

  return (
    <div>
      {authors.length === 0 ? (
        <div className="admin-empty-state">
          <p>No authors yet. Create your first author!</p>
          <Link
            href="/admin/authors/new"
            className="admin-btn-primary"
            style={{ display: "inline-block", marginTop: "16px" }}
          >
            Create Author
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Expertise</th>
                <th>Articles</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author: any) => (
                <tr key={author.id}>
                  <td>
                    {author.avatar ? (
                      <img
                        src={author.avatar}
                        alt={author.name}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "10px",
                          verticalAlign: "middle",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          display: "inline-block",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          background: "#4f46e5",
                          color: "white",
                          textAlign: "center",
                          lineHeight: "30px",
                          fontSize: "12px",
                          fontWeight: "600",
                          marginRight: "10px",
                        }}
                      >
                        {author.name?.charAt(0) || "?"}
                      </span>
                    )}
                    <strong>{author.name}</strong>
                  </td>
                  <td>{author.expertise || "N/A"}</td>
                  <td>{author.articles?.length || 0}</td>
                  <td>{new Date(author.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        href={`/admin/authors/${author.id}`}
                        className="admin-btn-edit"
                      >
                        <Edit size={14} /> Edit
                      </Link>
                      <button
                        onClick={() => deleteAuthor(author.id)}
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
