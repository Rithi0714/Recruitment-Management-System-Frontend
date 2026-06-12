import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Calendar, UserCheck, UserPlus, Settings,
  Briefcase, FileText, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const hrLinks = [
  { to: '/hr/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/hr/candidates', icon: Users, label: 'Applied Candidates' },
  { to: '/hr/interviews', icon: Calendar, label: 'Interviews' },
  { to: '/hr/selected', icon: UserCheck, label: 'Selected Candidates' },
  { to: '/hr/recruiters', icon: UserPlus, label: 'Recruiters' },
  { to: '/hr/settings', icon: Settings, label: 'Settings' },
];

const recruiterLinks = [
  { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/recruiter/candidates', icon: Users, label: 'My Candidates' },
  { to: '/recruiter/interviews', icon: Calendar, label: 'My Interviews' },
  { to: '/recruiter/settings', icon: Settings, label: 'Settings' },
];

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/candidates', icon: Users, label: 'All Candidates' },
  { to: '/admin/interviews', icon: Calendar, label: 'All Interviews' },
  { to: '/admin/recruiters', icon: UserPlus, label: 'All Recruiters' },
  { to: '/admin/selected', icon: UserCheck, label: 'Selected Candidates' },
];

export default function Sidebar({ role, collapsed, onToggle }) {
  const location = useLocation();
  const links = role === 'hr' ? hrLinks : role === 'recruiter' ? recruiterLinks : adminLinks;

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col z-40 transition-all duration-300",
      collapsed ? "w-[72px]" : "w-64"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <Briefcase className="w-8 h-8 text-sidebar-primary shrink-0" />
        {!collapsed && (
          <span className="ml-3 font-heading font-bold text-lg tracking-tight">RMS</span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/25"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all w-full"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}