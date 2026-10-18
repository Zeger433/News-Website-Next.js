'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  FolderTree,
  MessageSquare,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import "../globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);

  // Authentication check
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        if (!data.success) {
          router.push('/login');
          return;
        }

        if (data.admin.role !== 'admin' && data.admin.role !== 'superadmin') {
          router.push('/login');
          return;
        }

        // Set admin data
        setAdmin(data.admin);
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Navigation items
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/articles", label: "Articles", icon: Newspaper },
    { href: "/admin/authors", label: "Authors", icon: Users },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  ];

  // Get page info based on path
  const getPageInfo = () => {
    if (pathname === "/admin") {
      return { title: "Dashboard", subtitle: "Overview of your website" };
    }
    if (pathname?.startsWith("/admin/articles")) {
      if (pathname?.includes("/new")) {
        return {
          title: "Create New Article",
          subtitle: "Add a new article to your website",
        };
      }
      if (pathname?.match(/\/admin\/articles\/\d+/)) {
        return { title: "Edit Article", subtitle: "Update article details" };
      }
      return { title: "Articles", subtitle: "Manage your articles" };
    }
    if (pathname?.startsWith("/admin/authors")) {
      if (pathname?.includes("/new")) {
        return {
          title: "Create New Author",
          subtitle: "Add a new author to your website",
        };
      }
      if (pathname?.match(/\/admin\/authors\/\d+/)) {
        return { title: "Edit Author", subtitle: "Update author details" };
      }
      return { title: "Authors", subtitle: "Manage your authors" };
    }
    if (pathname?.startsWith("/admin/categories")) {
      if (pathname?.includes("/new")) {
        return {
          title: "Create New Category",
          subtitle: "Add a new category to your website",
        };
      }
      if (pathname?.match(/\/admin\/categories\/\d+/)) {
        return { title: "Edit Category", subtitle: "Update category details" };
      }
      return { title: "Categories", subtitle: "Manage your categories" };
    }
    if (pathname?.startsWith("/admin/messages")) {
      return { title: "Messages", subtitle: "View contact messages" };
    }
    return { title: "Admin", subtitle: "" };
  };

  const pageInfo = getPageInfo();

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-brand-icon">📰</span>
          <span className="admin-brand-text">PressPoint</span>
          <span className="admin-brand-badge">Admin</span>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-link">
            <ArrowLeft size={20} />
            <span>Back to Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="admin-nav-link logout-btn"
            style={{ 
              width: "100%", 
              textAlign: "left",
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#666',
              transition: 'all 0.2s',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee';
              e.currentTarget.style.color = '#dc3545';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#666';
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-main-header">
          <div>
            <h1 className="admin-page-title">{pageInfo.title}</h1>
            <p className="admin-page-subtitle">{pageInfo.subtitle}</p>
          </div>
          <div className="admin-header-actions">
            <div className="admin-user-badge">
              <span className="admin-user-avatar">
                {admin?.name?.charAt(0) || 'A'}
              </span>
              <span className="admin-user-name">
                {admin?.name || 'Admin'}
              </span>
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}