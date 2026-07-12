import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Code2, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/team', label: 'Team' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const logoClickCount = useRef(0);
  const logoTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Hidden admin access: double-click logo
  const handleLogoClick = () => {
    logoClickCount.current += 1;
    if (logoTimer.current) clearTimeout(logoTimer.current);
    if (logoClickCount.current >= 2) {
      window.location.href = '/admin';
      logoClickCount.current = 0;
    } else {
      logoTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 500);
    }
  };

  // Ctrl+Shift+A for admin
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        window.location.href = '/admin';
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', textDecoration: 'none' }}
            onClick={handleLogoClick}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: isDark ? '#ffffff' : '#000000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              <Code2 size={18} color={isDark ? '#000000' : '#ffffff'} />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}>Syntax Squad</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: 1, letterSpacing: '0.05em' }}>
                Building Solutions
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={toggleTheme}
              className="social-btn"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile hamburger */}
            <button
              className="social-btn show-mobile-only"
              style={{ display: 'flex' }}
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                overflow: 'hidden',
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}
                >
                  {label}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
