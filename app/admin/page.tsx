"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Newspaper,
  Users,
  FolderTree,
  MessageSquare,
  TrendingUp,
  Eye,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalAuthors: 0,
    totalCategories: 0,
    totalMessages: 0,
  });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [statsRes, articlesRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/articles"),
        ]);

        const statsData = await statsRes.json();
        const articlesData = await articlesRes.json();

        setStats(statsData.stats || {
          totalArticles: 0,
          totalAuthors: 0,
          totalCategories: 0,
          totalMessages: 0,
        });
        setRecentArticles(Array.isArray(articlesData) ? articlesData.slice(0, 5) : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Articles",
      value: stats.totalArticles,
      icon: Newspaper,
      color: "#4f46e5",
      bg: "#eef2ff",
      href: "/admin/articles",
    },
    {
      title: "Total Authors",
      value: stats.totalAuthors,
      icon: Users,
      color: "#059669",
      bg: "#ecfdf5",
      href: "/admin/authors",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: FolderTree,
      color: "#d97706",
      bg: "#fffbeb",
      href: "/admin/categories",
    },
    {
      title: "Messages",
      value: stats.totalMessages,
      icon: MessageSquare,
      color: "#dc2626",
      bg: "#fef2f2",
      href: "/admin/messages",
    },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="admin-stat-card">
              <div className="admin-stat-icon" style={{ background: card.bg, color: card.color }}>
                <Icon size={24} />
              </div>
              <div className="admin-stat-content">
                <p className="admin-stat-value">{card.value}</p>
                <p className="admin-stat-label">{card.title}</p>
              </div>
              <ArrowUpRight size={16} className="admin-stat-arrow" />
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Recent Articles</h2>
          <Link href="/admin/articles" className="admin-section-link">
            View all →
          </Link>
        </div>
        <div className="admin-recent-list">
          {recentArticles.length === 0 ? (
            <p className="admin-empty-state">No articles yet. Create your first article!</p>
          ) : (
            recentArticles.map((article: any) => (
              <div key={article.id} className="admin-recent-item">
                <div className="admin-recent-info">
                  <h4>{article.title}</h4>
                  <p>
                    By {article.author?.name || "Unknown"} •{" "}
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className={`admin-status-badge ${article.status}`}>
                  {article.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}