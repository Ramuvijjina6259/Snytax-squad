import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRight, Users, FolderKanban, Zap, Trophy, ChevronDown, Star, Cpu, Globe, Shield } from 'lucide-react';
import SectionTitle from '../../components/common/SectionTitle';
import MemberCard from '../../components/team/MemberCard';
import ProjectCard from '../../components/projects/ProjectCard';
import { getMembers } from '../../services/api';
import { getProjects } from '../../services/api';
import { getSettings } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import { useTheme } from '../../context/ThemeContext';

const techIcons = [
  { label: 'React', color: 'var(--text-muted)', top: '15%', left: '5%', delay: 0 },
  { label: 'Node.js', color: 'var(--text-muted)', top: '70%', left: '3%', delay: 1 },
  { label: 'Python', color: 'var(--text-muted)', top: '30%', right: '4%', delay: 0.5 },
  { label: 'MongoDB', color: 'var(--text-muted)', top: '75%', right: '3%', delay: 1.5 },
  { label: 'ML', color: 'var(--text-muted)', top: '50%', left: '2%', delay: 0.8 },
  { label: '.jsx', color: 'var(--text-muted)', top: '12%', right: '6%', delay: 1.2 },
];

const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const observed = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true;
        const start = Date.now();
        const step = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          setCount(Math.floor(progress * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
};

const whyUs = [
  { icon: Users, title: 'Team Collaboration', desc: 'We work seamlessly together combining frontend, backend, and AI expertise.', color: 'var(--text-primary)' },
  { icon: Cpu, title: 'Modern Technologies', desc: 'We use cutting-edge tools: React, Node.js, Python, and machine learning.', color: 'var(--text-primary)' },
  { icon: Globe, title: 'Practical Development', desc: 'Every project solves a real-world problem with production-level quality.', color: 'var(--text-primary)' },
  { icon: Shield, title: 'Problem-Solving Approach', desc: 'We analyze deeply, design thoughtfully, and build scalable solutions.', color: 'var(--text-primary)' },
];

export default function Home() {
  const { isDark } = useTheme();
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, pRes, sRes] = await Promise.all([
          getMembers(),
          getProjects({ featured: 'true' }),
          getSettings(),
        ]);
        setMembers(mRes.data.data || []);
        setProjects(pRes.data.data || []);
        setSettings(sRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading Syntax Squad..." />;

  return (
    <div>
      {/* =========== HERO SECTION =========== */}
      <section className={`hero-section ${isDark ? 'hero-gradient-dark' : 'hero-gradient-light'}`}>
        {/* Background particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: isDark 
                ? 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%)',
              animation: `float ${6 + i}s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}

        {/* Floating code elements */}
        {techIcons.map(({ label, color, top, left, right, delay }) => (
          <motion.div
            key={label}
            className="code-float"
            style={{ top, left, right }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span style={{ color }}>{label}</span>
          </motion.div>
        ))}

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 740 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: '1.25rem' }}
            >
              <span className="badge" style={{ fontSize: '0.75rem' }}>
                <Star size={12} style={{ marginRight: 4 }} />
                Software Development Team
              </span>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="shimmer-text">Syntax Squad</span>
              <br />
              <span style={{ fontSize: '50%', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Building Ideas. Creating Solutions.
              </span>
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {settings?.heroText || 'We build modern, scalable web applications and intelligent systems using cutting-edge technologies. From concept to deployment, we deliver excellence.'}
            </motion.p>

            <motion.div
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link to="/projects" className="btn btn-primary btn-lg">
                View Projects
                <ArrowRight size={18} />
              </Link>
              <Link to="/team" className="btn btn-secondary btn-lg">
                Meet Our Team
                <Users size={18} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.5 }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>SCROLL</span>
          <ChevronDown size={16} />
        </motion.div>
      </section>

      {/* =========== STATS SECTION =========== */}
      <section className={`section ${isDark ? 'section-gradient-dark' : ''}`}>
        <div className="container">
          <div className="stats-grid">
            {[
              { icon: Users, num: members.length || 5, suffix: '+', label: 'Team Members', color: 'var(--text-primary)' },
              { icon: FolderKanban, num: 3, suffix: '+', label: 'Projects Built', color: 'var(--text-primary)' },
              { icon: Zap, num: 15, suffix: '+', label: 'Technologies Used', color: 'var(--text-primary)' },
              { icon: Trophy, num: 6, suffix: '+', label: 'Achievements', color: 'var(--text-primary)' },
            ].map(({ icon: Icon, num, suffix, label, color }, i) => (
              <motion.div
                key={label}
                className="glass-card stat-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Icon size={24} color={color} />
                </div>
                <div className="stat-number">
                  <Counter target={num} />{suffix}
                </div>
                <div className="stat-label">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== FEATURED PROJECTS =========== */}
      <section className="section">
        <div className="container">
          <SectionTitle
            overline="Our Work"
            heading="Featured Projects"
            subheading="Explore our flagship projects that demonstrate our technical capabilities and problem-solving approach."
          />
          {projects.length > 0 ? (
            <div className="grid-3">
              {projects.slice(0, 3).map((project, i) => (
                <ProjectCard key={project._id} project={project} index={i} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Projects coming soon...</div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/projects" className="btn btn-secondary">
              View All Projects
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========== MEET THE TEAM =========== */}
      <section className={`section ${isDark ? 'section-gradient-dark' : ''}`}>
        <div className="container">
          <SectionTitle
            overline="The Team"
            heading="Meet Syntax Squad"
            subheading="A diverse group of passionate developers, each bringing unique expertise to create exceptional software."
          />
          {members.length > 0 ? (
            <div className="grid-3">
              {members.slice(0, 3).map((member, i) => (
                <MemberCard key={member._id} member={member} index={i} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Team info loading...</div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/team" className="btn btn-secondary">
              Meet All Members
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========== WHY CHOOSE US =========== */}
      <section className="section">
        <div className="container">
          <SectionTitle
            overline="Why Us"
            heading="Why Choose Syntax Squad?"
            subheading="We combine technical excellence with collaborative spirit to deliver solutions that make a difference."
          />
          <div className="grid-4">
            {whyUs.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                className="glass-card"
                style={{ padding: '1.75rem', textAlign: 'center' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--surface-secondary)', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Icon size={26} color={color} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.6rem' }}>{title}</h3>
                <p style={{ fontSize: '0.82rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== CTA SECTION =========== */}
      <section className="section">
        <div className="container">
          <motion.div
            className="glass-card"
            style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--surface-secondary)', border: '1px solid var(--border-primary)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Interested in Working Together?
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
              We're always open to new projects, collaborations, and opportunities.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary btn-lg">
                Get In Touch
                <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">
                Learn More About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
