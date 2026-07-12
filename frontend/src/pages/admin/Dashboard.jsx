import { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Users, FolderKanban, Award, MessageSquare, CheckCircle, TrendingUp } from 'lucide-react';
import { getDashboardStats, getProjects, getMembers, getAchievements, getMessages } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import { useTheme } from '../../context/ThemeContext';

export default function Dashboard() {
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard | Syntax Squad Admin';
    const fetchStats = async () => {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          getDashboardStats(),
          getProjects()
        ]);
        setStats(statsRes.data.data);
        setProjects(projectsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="Compiling dashboard analytics..." />;

  // Prepare chart data for categories
  const categories = projects.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});
  const categoryChartData = Object.keys(categories).map(k => ({ name: k, value: categories[k] }));

  // Prepare chart data for statuses
  const statuses = projects.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});
  const statusChartData = Object.keys(statuses).map(k => ({ name: k, value: statuses[k] }));

  const COLORS = ['#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999'];

  const summaryCards = [
    { label: 'Team Members', val: stats?.teamMembers || 0, icon: Users, color: '#333333' },
    { label: 'Total Projects', val: stats?.totalProjects || 0, icon: FolderKanban, color: '#555555' },
    { label: 'Completed Projects', val: stats?.completedProjects || 0, icon: CheckCircle, color: '#777777' },
    { label: 'In Progress Projects', val: stats?.inProgress || 0, icon: TrendingUp, color: '#999999' },
    { label: 'Achievements', val: stats?.achievements || 0, icon: Award, color: '#bbbbbb' },
    { label: 'Unread Messages', val: stats?.unreadMessages || 0, icon: MessageSquare, color: '#dddddd' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Dashboard Overview</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>A real-time overview of database assets, content metrics, and contact responses.</p>
      </div>

      {/* Grid of stats */}
      <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="glass-card dashboard-card"
              style={{
                display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem'
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={24} color="currentColor" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>{card.label}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.2, marginTop: '0.1rem' }}>{card.val}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Layout */}
      <div className="grid-2" style={{ gap: '2rem' }}>
        {/* Category distribution */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.5rem' }}>Projects by Category</h3>
          {categoryChartData.length > 0 ? (
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <XAxis dataKey="name" stroke="currentColor" fontSize={11} tickLine={false} />
                  <YAxis stroke="currentColor" fontSize={11} allowDecimals={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} />
                  <Bar dataKey="value" fill="#333333" radius={[4, 4, 0, 0]}>
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0' }}>No category data available</div>
          )}
        </div>

        {/* Status distribution */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.5rem' }}>Projects by Status</h3>
          {statusChartData.length > 0 ? (
            <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1rem' }}>
                {statusChartData.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[idx % COLORS.length] }} />
                    <span>{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0' }}>No status data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
