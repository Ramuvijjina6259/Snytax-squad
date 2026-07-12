import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, ExternalLink, Folder } from 'lucide-react';
import { Github, Linkedin } from '../common/Icons';

const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
const roleColors = {
  'Team Lead': 'badge-blue',
  'Frontend': 'badge-cyan',
  'Backend': 'badge-purple',
  'Machine Learning': 'badge-green',
  'Testing': 'badge-orange',
  'Documentation': 'badge-gray',
};

const getRoleBadge = (role) => {
  const key = Object.keys(roleColors).find(k => role.includes(k));
  return roleColors[key] || 'badge-blue';
};

export default function MemberCard({ member, index = 0 }) {
  const { name, role, shortBio, profileImage, skills = [], githubUrl, linkedinUrl, portfolioUrl, slug, projectCount = 0 } = member;

  return (
    <motion.div
      className="glass-card member-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
    >
      {/* Gradient accent top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--text-primary)', borderRadius: '16px 16px 0 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {profileImage ? (
            <img
              src={profileImage.startsWith('http') ? profileImage : `http://localhost:5000${profileImage}`}
              alt={name}
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-secondary)', flexShrink: 0 }}
            />
          ) : (
            <div className="member-avatar-placeholder" style={{ width: 64, height: 64, fontSize: '1.4rem', flexShrink: 0 }}>
              {getInitials(name)}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem', lineHeight: 1.2 }}>{name}</h3>
            <span className={`badge ${getRoleBadge(role)}`} style={{ fontSize: '0.7rem' }}>{role}</span>
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {shortBio}
        </p>

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {skills.slice(0, 4).map((skill, i) => (
              <span key={i} className="badge badge-gray" style={{ fontSize: '0.65rem' }}>
                {typeof skill === 'string' ? skill : skill.name}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>+{skills.length - 4}</span>
            )}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-primary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Folder size={12} />
            {projectCount} Projects
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link to={`/team/${slug}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
            View Profile
          </Link>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                <Github size={14} />
              </a>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                <Linkedin size={14} />
              </a>
            )}
            {portfolioUrl && (
              <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Portfolio">
                <Globe size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
