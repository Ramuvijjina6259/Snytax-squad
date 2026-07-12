import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMembers } from '../../services/api';
import MemberCard from '../../components/team/MemberCard';
import SectionTitle from '../../components/common/SectionTitle';
import { LoadingSpinner, SkeletonCard } from '../../components/common/Loading';
import { useTheme } from '../../context/ThemeContext';

const filters = [
  { id: 'All', label: 'All Members' },
  { id: 'Team Leadership', label: 'Leadership' },
  { id: 'Frontend', label: 'Frontend' },
  { id: 'Backend', label: 'Backend' },
  { id: 'Machine Learning', label: 'Machine Learning' }
];

export default function Team() {
  const { isDark } = useTheme();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Team Members | Syntax Squad';
    const fetchMembers = async () => {
      try {
        const { data } = await getMembers();
        if (data.success) {
          setMembers(data.data);
          setFilteredMembers(data.data);
        }
      } catch (err) {
        setError('Failed to fetch team members. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    if (filterId === 'All') {
      setFilteredMembers(members);
    } else {
      setFilteredMembers(
        members.filter(m => m.filterCategory?.includes(filterId) || m.role?.toLowerCase().includes(filterId.toLowerCase()))
      );
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        <SectionTitle
          overline="Syntax Squad"
          heading="Meet Our Team"
          subheading="Our talented, multidisciplinary team works together to transform concepts into powerful software solutions."
        />

        {/* Filters */}
        <div className="filter-tabs">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`filter-tab ${activeFilter === f.id ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid-3">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'var(--text-primary)', padding: '2rem' }}>{error}</div>
        ) : filteredMembers.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem' }}>
            <h3>No members found in this category.</h3>
          </div>
        ) : (
          <div className="grid-3">
            {filteredMembers.map((member, i) => (
              <MemberCard key={member._id} member={member} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
