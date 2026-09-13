import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Mail,
  Layers,
  Quote,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    showToast('Signed out of admin session', 'info');
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Projects & Work', path: '/admin/projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { label: 'Client Inquiries', path: '/admin/inquiries', icon: <Mail className="w-4 h-4" /> },
    { label: 'Messages', path: '/admin/messages', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Services', path: '/admin/services', icon: <Layers className="w-4 h-4" /> },
    { label: 'Testimonials', path: '/admin/testimonials', icon: <Quote className="w-4 h-4" /> },
    { label: 'Site Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F5F2] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0D0D0D] border-b border-[#242424]">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#C9A769]" />
          <span className="font-bold text-sm tracking-tight">SIAM ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#969691] hover:text-[#FFFFFF]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-40 w-64 bg-[#0A0A0A] border-r border-[#1E1E1E] flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand block */}
          <div className="p-6 border-b border-[#1A1A1A]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#141414] border border-[#2E2E2E] flex items-center justify-center text-[#C9A769]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm font-['Space_Grotesk',sans-serif] tracking-tight text-[#F5F5F2]">
                  AURELIUS CONSOLE
                </div>
                <div className="text-[10px] font-mono text-[#666662] uppercase">
                  Production Studio
                </div>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-[#C9A769] text-[#070707] font-bold shadow-sm'
                      : 'text-[#969691] hover:text-[#F5F5F2] hover:bg-[#121212]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1A1A1A] space-y-3">
          <div className="px-3 py-2 bg-[#121212] border border-[#202020] rounded-sm text-xs">
            <div className="text-[10px] font-mono text-[#666662] uppercase">Authenticated As</div>
            <div className="text-xs text-[#E2E2DE] font-semibold truncate mt-0.5">
              {user?.email || 'admin@portfolio.luxury'}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[#888882] hover:text-[#C9A769] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
