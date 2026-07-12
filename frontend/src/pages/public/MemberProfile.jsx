import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Mail, MapPin, Download, Briefcase, Award, FolderGit, FileText, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { Github, Linkedin } from '../../components/common/Icons';
import { getMemberBySlug } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import { useTheme } from '../../context/ThemeContext';

export default function MemberProfile() {
  const { slug } = useParams();
  const { isDark } = useTheme();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const { data } = await getMemberBySlug(slug);
        if (data.success) {
          setMember(data.data);
          document.title = `${data.data.name} | Syntax Squad Profile`;
        } else {
          setError('Member profile not found.');
        }
      } catch (err) {
        setError('Error fetching member profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [slug]);

  if (loading) return <LoadingSpinner text="Fetching team member details..." />;
  if (error || !member) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{error || 'Profile not found'}</h2>
        <Link to="/team" className="btn btn-primary">
          <ChevronLeft size={16} /> Back to Team
        </Link>
      </div>
    );
  }

  // Helper to render skill level as dots
  const renderSkillLevel = (level) => {
    const totalDots = 3;
    let filled = 1;
    if (level === 'Intermediate') filled = 2;
    if (level === 'Advanced') filled = 3;

    return (
      <div className="skill-level-bar" title={`Level: ${level}`}>
        {[...Array(totalDots)].map((_, i) => (
          <div key={i} className={`skill-dot ${i < filled ? 'filled' : 'empty'}`} />
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Back Link */}
        <Link to="/team" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <ChevronLeft size={16} /> Back to Team
        </Link>

        {/* Profile Header Card */}
        <motion.div
          className="glass-card"
          style={{ padding: '2.5rem', marginBottom: '2.5rem' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'center' }}>
            {/* Avatar */}
            {member.profileImage ? (
              <img
                src={member.profileImage.startsWith('http') ? member.profileImage : `http://localhost:5000${member.profileImage}`}
                alt={member.name}
                style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--border-secondary)', boxShadow: 'var(--shadow-md)' }}
              />
            ) : (
              <div className="member-avatar-placeholder" style={{ width: 150, height: 150, fontSize: '3.5rem' }}>
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}

            {/* General Info */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{member.name}</h1>
                <span className="badge">{member.availability || 'Available'}</span>
              </div>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1rem' }}>{member.role}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} />
                  <span>{member.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} />
                  <a href={`mailto:${member.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{member.email}</a>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {member.resumeUrl && (
                  <a href={member.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    <Download size={14} /> Download Resume
                  </a>
                )}
                {member.portfolioUrl && (
                  <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    <Globe size={14} /> Visit Portfolio <ArrowUpRight size={12} />
                  </a>
                )}
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {member.githubUrl && (
                    <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                      <Github size={16} />
                    </a>
                  )}
                  {member.linkedinUrl && (
                    <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                      <Linkedin size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs / Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main content column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Bio & Career Objective */}
            <motion.div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="currentColor" />
                About Me
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                {member.fullBio || member.shortBio}
              </p>
              {member.careerObjective && (
                <div style={{ padding: '1rem', borderLeft: '3px solid var(--text-primary)', background: 'var(--surface-secondary)', borderRadius: '0 8px 8px 0' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Career Objective</h4>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{member.careerObjective}</p>
                </div>
              )}
            </motion.div>

            {/* Member Contributions */}
            <motion.div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={18} color="currentColor" />
                Project Contributions
              </h2>
              {member.contributions && member.contributions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {member.contributions.map((contr, idx) => (
                    <div key={idx} style={{ padding: '1.25rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--surface-secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{contr.projectName}</h3>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Role: {contr.role}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <span className="badge" style={{ fontSize: '0.65rem' }}>
                            {contr.contributionLevel} Contribution
                          </span>
                          <span className="badge" style={{ fontSize: '0.65rem' }}>
                            {contr.status}
                          </span>
                        </div>
                      </div>

                      {/* Tasks completed */}
                      {contr.tasks && contr.tasks.length > 0 && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Key Deliverables:</div>
                          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {contr.tasks.map((task, i) => <li key={i}>{task}</li>)}
                          </ul>
                        </div>
                      )}

                      {/* Technologies used */}
                      {contr.technologies && contr.technologies.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {contr.technologies.map((t, i) => (
                            <span key={i} className="badge badge-gray" style={{ fontSize: '0.6rem' }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No direct contribution logs recorded yet.</p>
              )}
            </motion.div>
          </div>

          {/* Right sidebar column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Responsibilities */}
            {member.responsibilities && member.responsibilities.length > 0 && (
              <motion.div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FolderGit size={16} color="currentColor" />
                  Responsibilities
                </h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {member.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </motion.div>
            )}

            {/* Skills Progress Card */}
            <motion.div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={16} color="currentColor" />
                Technical Skills
              </h3>
              {member.skills && member.skills.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {member.skills.map((skill, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {skill.name}
                        </span>
                        {skill.category && (
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{skill.category}</div>
                        )}
                      </div>
                      {renderSkillLevel(skill.level)}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills logged.</p>
              )}
            </motion.div>

            {/* Achievements */}
            {member.achievements && member.achievements.length > 0 && (
              <motion.div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={16} color="currentColor" />
                  Achievements
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {member.achievements.map((ach, idx) => (
                    <div key={idx} style={{ paddingBottom: '0.75rem', borderBottom: idx < member.achievements.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ach}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
