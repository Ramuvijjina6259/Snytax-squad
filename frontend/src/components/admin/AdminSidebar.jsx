import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, FolderKanban, Zap, Trophy, MessageSquare,
  Settings, LogOut, Code2, ChevronRight, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/members', icon: Users, label: 'Team Members' },
  { to: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/admin/skills', icon: Zap, label: 'Skills' },
  { to: '/admin/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar() {
  const { admin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const filteredNavItems = navItems.filter(item => {
    if (admin?.role !== 'admin') {
      return ['/admin/dashboard', '/admin/members', '/admin/achievements'].includes(item.to);
    }
    return true;
  }).map(item => {
    if (admin?.role !== 'admin' && item.to === '/admin/members') {
      return { ...item, label: 'My Profile' };
    }
    return item;
  });

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', padding: '0.5rem 0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: isDark ? '#ffffff' : '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Code2 size={18} color={isDark ? '#000000' : '#ffffff'} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Syntax Squad
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>ADMIN PANEL</div>
        </div>
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {filteredNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{label}</span>
            <ChevronRight size={13} style={{ opacity: 0.4 }} />
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Admin info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 10, background: 'var(--surface-secondary)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--background-primary)', flexShrink: 0 }}>
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{admin?.name || 'Admin'}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{admin?.role || 'admin'}</div>
          </div>
        </div>
        <button onClick={toggleTheme} className="sidebar-nav-item" style={{ border: 'none', background: 'transparent', cursor: 'pointer', justifyContent: 'flex-start' }}>
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <a href="/" target="_blank" rel="noopener noreferrer" className="sidebar-nav-item" style={{ textDecoration: 'none' }}>
          <Code2 size={17} />
          <span>View Site</span>
        </a>
        <button
          onClick={logout}
          className="sidebar-nav-item"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
