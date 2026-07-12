import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Eye, Tag } from 'lucide-react';
import { Github } from '../common/Icons';

const statusConfig = {
  'Planning': { cls: 'status-planning', label: 'Planning' },
  'In Progress': { cls: 'status-in-progress', label: 'In Progress' },
  'Testing': { cls: 'status-testing', label: 'Testing' },
  'Completed': { cls: 'status-completed', label: 'Completed' },
  'Deployed': { cls: 'status-deployed', label: 'Deployed' },
  'Maintenance': { cls: 'status-maintenance', label: 'Maintenance' },
};

const categoryColors = {
  'Healthcare': 'badge-green',
  'Education': 'badge-blue',
  'Full Stack': 'badge-purple',
  'Web Development': 'badge-cyan',
  'Artificial Intelligence': 'badge-orange',
  'Machine Learning': 'badge-green',
  'Mobile Applications': 'badge-blue',
  'Messaging Platform': 'badge-purple',
};

export default function ProjectCard({ project, index = 0 }) {
  const { title, slug, shortDescription, technologies = [], category, status, coverImage, githubUrl, liveDemoUrl, progressPercentage } = project;
  const statusCfg = statusConfig[status] || statusConfig['Planning'];
  const catColor = categoryColors[category] || 'badge-blue';

  return (
    <motion.div
      className="glass-card project-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
    >
      {/* Cover image */}
      <div className="project-image-wrapper" style={{ height: 180, background: coverImage ? 'none' : 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {coverImage ? (
          <img
            src={coverImage.startsWith('http') ? coverImage : `http://localhost:5000${coverImage}`}
            alt={title}
            className="project-image"
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {category === 'Healthcare' ? '🏥' : category === 'Education' ? '📚' : category === 'Machine Learning' ? '🤖' : '💻'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{category}</div>
          </div>
        )}
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {/* Tags row */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className={`badge ${catColor}`} style={{ fontSize: '0.7rem' }}>
            <Tag size={10} style={{ marginRight: 3 }} />
            {category}
          </span>
          <span className={`badge ${statusCfg.cls}`} style={{ fontSize: '0.7rem' }}>{statusCfg.label}</span>
        </div>

        {/* Title */}
        <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{title}</h3>

        {/* Description */}
        <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {shortDescription}
        </p>

        {/* Progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Progress</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-primary)', fontWeight: 600 }}>{progressPercentage}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              whileInView={{ width: `${progressPercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {technologies.slice(0, 5).map((tech, i) => (
              <span key={i} className="badge badge-gray" style={{ fontSize: '0.65rem' }}>{tech}</span>
            ))}
            {technologies.length > 5 && <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>+{technologies.length - 5}</span>}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-primary)' }}>
          <Link to={`/projects/${slug}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
            <Eye size={13} />
            Details
          </Link>
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="social-btn">
              <Github size={14} />
            </a>
          )}
          {liveDemoUrl && (
            <a href={liveDemoUrl} target="_blank" rel="noopener noreferrer" className="social-btn">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
