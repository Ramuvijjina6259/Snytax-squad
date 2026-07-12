import { useState, useEffect } from 'react';
import { Award, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import SectionTitle from '../../components/common/SectionTitle';
import { getAchievements } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import { useTheme } from '../../context/ThemeContext';

export default function Achievements() {
  const { isDark } = useTheme();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Achievements & Honors | Syntax Squad';
    const fetchAchievements = async () => {
      try {
        const { data } = await getAchievements();
        if (data.success) {
          setAchievements(data.data);
        }
      } catch (err) {
        setError('Failed to fetch achievements.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        <SectionTitle
          overline="Milestones"
          heading="Team Achievements"
          subheading="A legacy of certifications, workshop participations, hackathon medals, and academic recognition earned by Syntax Squad members."
        />

        {loading ? (
          <LoadingSpinner text="Harvesting accomplishments..." />
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'var(--text-primary)', padding: '2rem' }}>{error}</div>
        ) : achievements.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem' }}>
            <h3>No achievements posted yet.</h3>
          </div>
        ) : (
          <div className="grid-3">
            {achievements.map((ach) => (
              <div key={ach._id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={20} color="currentColor" />
                  </div>
                  <span className="badge" style={{ fontSize: '0.65rem' }}>{ach.type}</span>
                </div>

                {/* Title */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.25rem' }}>{ach.title}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Issued by {ach.organization}</div>
                </div>

                {/* Date */}
                {ach.date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={12} />
                    <span>{new Date(ach.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                )}

                {/* Description */}
                <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-secondary)', flexGrow: 1 }}>
                  {ach.description}
                </p>

                {/* Association */}
                {ach.memberName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-primary)' }}>
                    <ShieldCheck size={12} color="currentColor" />
                    <span>Earner: <strong style={{ color: 'var(--text-primary)' }}>{ach.memberName}</strong></span>
                  </div>
                )}

                {/* Certificate Link */}
                {ach.certificateUrl && (
                  <a
                    href={ach.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'center', marginTop: '0.5rem' }}
                  >
                    View Credential <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
