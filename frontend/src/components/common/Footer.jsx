import { Link } from 'react-router-dom';
import { Code2, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import LogoIcon from './LogoIcon';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Team' },
  { to: '/team', label: 'Our Team' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/contact', label: 'Contact Us' },
];


export default function Footer() {
  const { isDark } = useTheme();
  const { settings } = useSettings();

  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: settings?.logo ? 'transparent' : (isDark ? '#ffffff' : '#000000'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {settings?.logo ? (
                  <img 
                    src={settings.logo} 
                    alt={settings.teamName || "Syntax Squad Logo"} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                ) : (
                  <div style={{ color: isDark ? '#000000' : '#ffffff' }}>
                    <LogoIcon size={22} />
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {settings?.teamName || "Syntax Squad"}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  {settings?.tagline || "SOFTWARE TEAM"}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Building Ideas. Creating Solutions. Growing Together. A passionate team of developers crafting impactful software.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a href="https://github.com/syntax-squad" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                <Github size={16} />
              </a>
              <a href="https://linkedin.com/company/syntax-squad" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="mailto:syntaxsquad.team@gmail.com" className="social-btn" aria-label="Email">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    <ArrowRight size={12} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Contact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <Mail size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                <a href="mailto:syntaxsquad.team@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>syntaxsquad.team@gmail.com</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <MapPin size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Andhra Pradesh, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © 2026 Syntax Squad. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Designed and developed by <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Syntax Squad</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
