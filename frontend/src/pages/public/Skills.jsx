import { useState, useEffect } from 'react';
import SectionTitle from '../../components/common/SectionTitle';
import { getSkills } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import { useTheme } from '../../context/ThemeContext';

export default function Skills() {
  const { isDark } = useTheme();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Skills Matrix | Syntax Squad';
    const fetchSkills = async () => {
      try {
        const { data } = await getSkills();
        if (data.success) {
          setSkills(data.data);
        }
      } catch (err) {
        setError('Failed to fetch team skills.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Group skills by category
  const categories = [
    'Frontend Development',
    'Backend Development',
    'Artificial Intelligence',
    'Machine Learning',
    'Database Management',
    'UI/UX Design',
    'Deployment',
    'Development Tools',
    'Programming Languages',
    'Soft Skills'
  ];

  const getSkillsByCategory = (cat) => {
    return skills.filter(s => s.category === cat);
  };

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        <SectionTitle
          overline="Expertise"
          heading="Our Technical Skills"
          subheading="A comprehensive map of technical knowledge, tooling, and development capabilities shared across the Syntax Squad team."
        />

        {loading ? (
          <LoadingSpinner text="Mapping skill inventory..." />
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'var(--text-primary)', padding: '2rem' }}>{error}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {categories.map(cat => {
              const catSkills = getSkillsByCategory(cat);
              if (catSkills.length === 0) return null;

              return (
                <div key={cat} className="glass-card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.5rem' }}>
                    {cat}
                  </h3>
                  <div className="grid-3" style={{ gap: '1.5rem' }}>
                    {catSkills.map(skill => (
                      <div key={skill._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--surface-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                            {skill.icon ? `${skill.icon} ` : ''}{skill.name}
                          </span>
                          <span className="badge" style={{ fontSize: '0.65rem' }}>{skill.experienceLevel}</span>
                        </div>

                        {/* Associated Team Members */}
                        {skill.members && skill.members.length > 0 && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', fontWeight: 600 }}>Squad Members:</div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {skill.members.map(member => (
                                <span key={member._id} className="badge" style={{ fontSize: '0.65rem' }}>
                                  {member.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
