import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, FileText, ChevronLeft, Calendar, ShieldAlert, Award, Compass, RefreshCw } from 'lucide-react';
import { Github } from '../../components/common/Icons';
import { getProjectBySlug } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import { useTheme } from '../../context/ThemeContext';

export default function ProjectDetails() {
  const { slug } = useParams();
  const { isDark } = useTheme();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data } = await getProjectBySlug(slug);
        if (data.success) {
          setProject(data.data);
          document.title = `${data.data.title} | Syntax Squad Projects`;
        } else {
          setError('Project details not found.');
        }
      } catch (err) {
        setError('Error fetching project details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) return <LoadingSpinner text="Retrieving project specifications..." />;
  if (error || !project) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{error || 'Project not found'}</h2>
        <Link to="/projects" className="btn btn-primary">
          <ChevronLeft size={16} /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Back Link */}
        <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <ChevronLeft size={16} /> Back to Projects
        </Link>

        {/* Hero Section Banner */}
        <motion.div
          className="glass-card"
          style={{ overflow: 'hidden', marginBottom: '2.5rem' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {project.coverImage ? (
            <img
              src={project.coverImage.startsWith('http') ? project.coverImage : `http://localhost:5000${project.coverImage}`}
              alt={project.title}
              style={{ width: '100%', height: '350px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ height: '240px', background: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '4rem' }}>💻</div>
            </div>
          )}

          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{project.title}</h1>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge">{project.category}</span>
                  <span className="badge">{project.status}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    <Github size={14} /> GitHub Repository
                  </a>
                )}
                {project.liveDemoUrl && (
                  <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    <ExternalLink size={14} /> Live Platform
                  </a>
                )}
                {project.documentationUrl && (
                  <a href={project.documentationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                    <FileText size={14} /> Documentation
                  </a>
                )}
              </div>
            </div>

            {/* Progress status */}
            <div style={{ maxWidth: 300, marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Completion Progress</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{project.progressPercentage}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${project.progressPercentage}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Overview / Full description */}
            <motion.div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={18} color="currentColor" />
                Project Overview
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>
                {project.fullDescription || project.shortDescription}
              </p>
            </motion.div>

            {/* Problem & Proposed Solution */}
            {(project.problemStatement || project.proposedSolution) && (
              <motion.div className="glass-card" style={{ padding: '2rem' }}>
                {project.problemStatement && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldAlert size={16} /> Problem Statement
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{project.problemStatement}</p>
                  </div>
                )}
                {project.proposedSolution && (
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={16} /> Proposed Solution
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{project.proposedSolution}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <motion.div className="glass-card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Key Features</h2>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {project.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Challenges & Solutions */}
            {project.challenges && project.challenges.length > 0 && (
              <motion.div className="glass-card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={18} color="currentColor" />
                  Challenges & Mitigations
                </h2>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {project.challenges.map((challenge, i) => (
                    <li key={i}>{challenge}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Team Contributions / Contributors */}
            {project.contributors && project.contributors.length > 0 && (
              <motion.div className="glass-card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Team Contributions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {project.contributors.map((contrib, idx) => (
                    <div key={idx} style={{ padding: '1.25rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--surface-secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>{contrib.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{contrib.role}</span>
                        </div>
                        <span className="badge" style={{ fontSize: '0.65rem' }}>{contrib.status}</span>
                      </div>

                      {contrib.workCompleted && contrib.workCompleted.length > 0 && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {contrib.workCompleted.map((work, i) => <li key={i}>{work}</li>)}
                          </ul>
                        </div>
                      )}

                      {contrib.technologies && contrib.technologies.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {contrib.technologies.map((t, i) => (
                            <span key={i} className="badge badge-gray" style={{ fontSize: '0.65rem' }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Tech Stack List */}
            <motion.div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Technologies Used</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.technologies?.map((tech, i) => (
                  <span key={i} className="badge badge-gray">{tech}</span>
                ))}
              </div>
            </motion.div>

            {/* Objectives */}
            {project.objectives && project.objectives.length > 0 && (
              <motion.div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Project Objectives</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {project.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                </ul>
              </motion.div>
            )}

            {/* Future Improvements */}
            {project.futureImprovements && project.futureImprovements.length > 0 && (
              <motion.div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Future Roadmaps</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {project.futureImprovements.map((imp, i) => <li key={i}>{imp}</li>)}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
