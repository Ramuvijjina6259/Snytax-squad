import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import SectionTitle from '../../components/common/SectionTitle';
import ProjectCard from '../../components/projects/ProjectCard';
import { getProjects } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import { useTheme } from '../../context/ThemeContext';

const filters = [
  { id: 'All', label: 'All Projects' },
  { id: 'Full Stack', label: 'Full Stack' },
  { id: 'Web Development', label: 'Web Dev' },
  { id: 'Machine Learning', label: 'ML' },
  { id: 'Healthcare', label: 'Healthcare' },
  { id: 'Education', label: 'Education' },
  { id: 'Completed', label: 'Completed' },
  { id: 'In Progress', label: 'In Progress' }
];

export default function Projects() {
  const { isDark } = useTheme();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Projects | Syntax Squad';
    const fetchProjects = async () => {
      try {
        const { data } = await getProjects();
        if (data.success) {
          setProjects(data.data);
          setFilteredProjects(data.data);
        }
      } catch (err) {
        setError('Failed to fetch projects.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    let result = projects;

    // Apply Filter Tab
    if (activeFilter !== 'All') {
      if (activeFilter === 'Completed' || activeFilter === 'In Progress') {
        result = result.filter(p => p.status === activeFilter);
      } else {
        result = result.filter(p => p.category === activeFilter);
      }
    }

    // Apply Search
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.technologies?.some(t => t.toLowerCase().includes(term)) ||
        p.shortDescription.toLowerCase().includes(term)
      );
    }

    setFilteredProjects(result);
  }, [activeFilter, searchTerm, projects]);

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        <SectionTitle
          overline="Portfolio"
          heading="Our Projects"
          subheading="Discover the innovative platforms and smart applications crafted by the Syntax Squad."
        />

        {/* Search & Filters Group */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search projects by name, description or technologies..."
              className="input search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`filter-tab ${activeFilter === f.id ? 'active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading projects gallery..." />
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'var(--text-primary)', padding: '2rem' }}>{error}</div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem' }}>
            <h3>No projects found matching the criteria.</h3>
          </div>
        ) : (
          <div className="grid-3">
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project._id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
