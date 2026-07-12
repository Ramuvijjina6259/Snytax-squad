import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Star, CheckCircle, GitBranch, Search, Lightbulb, Code2, TestTube, Rocket, Wrench } from 'lucide-react';
import SectionTitle from '../../components/common/SectionTitle';
import { getSettings } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const workflow = [
  { step: 1, icon: Search, title: 'Problem Identification', desc: 'Understanding the real-world problem that needs to be solved.', color: 'var(--text-primary)' },
  { step: 2, icon: Lightbulb, title: 'Requirement Analysis', desc: 'Gathering requirements and defining project scope clearly.', color: 'var(--text-primary)' },
  { step: 3, icon: Star, title: 'UI/UX Planning', desc: 'Designing wireframes, user flows, and visual prototypes.', color: 'var(--text-primary)' },
  { step: 4, icon: Code2, title: 'Development', desc: 'Building frontend, backend, and ML components collaboratively.', color: 'var(--text-primary)' },
  { step: 5, icon: TestTube, title: 'Testing', desc: 'Rigorous testing to ensure quality, performance, and security.', color: 'var(--text-primary)' },
  { step: 6, icon: Rocket, title: 'Deployment', desc: 'Deploying to production with proper CI/CD pipelines.', color: 'var(--text-primary)' },
  { step: 7, icon: Wrench, title: 'Maintenance', desc: 'Ongoing updates, improvements, and user feedback integration.', color: 'var(--text-primary)' },
];

const milestones = [
  { year: '2024', title: 'Team Formation', desc: 'Syntax Squad was formed by 5 passionate software engineering students.', color: 'var(--text-primary)' },
  { year: '2024', title: 'First Project: MediGuide', desc: 'Started development of MediGuide — a healthcare AI prediction platform.', color: 'var(--text-primary)' },
  { year: '2024', title: 'Hackathon Success', desc: 'Won 2nd place in college hackathon with the MediGuide prototype.', color: 'var(--text-primary)' },
  { year: '2025', title: 'ConnectHub & BookMotion', desc: 'Expanded our portfolio with two new innovative projects.', color: 'var(--text-primary)' },
  { year: '2025', title: 'Multiple Certifications', desc: 'Team members earned certifications in React, Node.js, and Machine Learning.', color: 'var(--text-primary)' },
  { year: '2026', title: 'Portfolio Launch', desc: 'Launched this professional team portfolio to showcase our work.', color: 'var(--text-primary)' },
];

const roles = [
  { role: 'Team Lead', name: 'V. Rama Krishna', desc: 'Coordinates team, manages tasks, leads frontend development and UI/UX planning.', color: 'var(--text-primary)' },
  { role: 'Backend Developer', name: 'G. Kumar Pavan Manikantha', desc: 'Builds REST APIs, manages database, implements authentication and server logic.', color: 'var(--text-primary)' },
  { role: 'ML Developer & Co-Lead', name: 'K. Srinivas Bhaskar', desc: 'Develops ML models, preprocesses datasets, integrates AI into applications.', color: 'var(--text-primary)' },
  { role: 'Developer & Tester', name: 'K. Lokesh', desc: 'Implements features, conducts software testing, identifies and reports bugs.', color: 'var(--text-primary)' },
  { role: 'Developer & Documentation', name: 'K. Manikanta', desc: 'Builds features, maintains comprehensive documentation and research content.', color: 'var(--text-primary)' },
];

export default function About() {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(r => setSettings(r.data.data)).catch(console.error);
    document.title = 'About | Syntax Squad';
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className={`section ${isDark ? 'hero-gradient-dark' : 'hero-gradient-light'}`} style={{ paddingTop: '5rem' }}>
        <div className="container">
          <motion.div
            style={{ maxWidth: 700 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-overline">About Us</span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1.25rem', lineHeight: 1.1 }}>
              We Are <span className="gradient-text">Syntax Squad</span>
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {settings?.description || 'Syntax Squad is a passionate team of software developers dedicated to building innovative solutions using modern technologies. We combine creativity, technical expertise, and collaborative spirit to deliver exceptional projects.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Goals */}
      <section className="section">
        <div className="container">
          <div className="grid-3" style={{ alignItems: 'stretch' }}>
            {[
              { icon: Target, label: 'Mission', title: 'Our Mission', content: settings?.mission || 'To develop innovative and impactful software solutions that solve real-world problems through collaboration, modern technologies, and continuous learning.', color: 'var(--text-primary)' },
              { icon: Eye, label: 'Vision', title: 'Our Vision', content: settings?.vision || 'To become a leading software development team known for quality, innovation, collaboration, and producing graduates who are industry-ready.', color: 'var(--text-primary)' },
              { icon: Star, label: 'Goals', title: 'Our Goals', content: 'Build production-ready applications, contribute to open source, earn industry certifications, and grow into full-stack and AI/ML engineers.', color: 'var(--text-primary)' },
            ].map(({ icon: Icon, label, title, content, color }, i) => (
              <motion.div
                key={label}
                className="glass-card"
                style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)` }} />
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Icon size={22} color={color} />
                </div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: color, fontWeight: 700, marginBottom: '0.5rem' }}>{label}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className={`section ${isDark ? 'section-gradient-dark' : ''}`}>
        <div className="container">
          <SectionTitle
            overline="Our Process"
            heading="Team Workflow"
            subheading="A structured development approach that ensures quality, consistency, and successful project delivery."
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {workflow.map(({ step, icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={step}
                className="glass-card"
                style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--surface-secondary)', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                  <Icon size={22} color={color} />
                  <div style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, borderRadius: '50%', background: color, fontSize: '0.65rem', fontWeight: 800, color: 'var(--background-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {step}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <SectionTitle overline="Journey" heading="Team Timeline" subheading="Key milestones in our journey as a software development team." />
          <div className="timeline" style={{ maxWidth: 700, margin: '0 auto' }}>
            {milestones.map(({ year, title, desc, color }, i) => (
              <motion.div
                key={i}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="timeline-dot" style={{ background: color }} />
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: color, background: 'var(--surface-secondary)', padding: '0.25rem 0.6rem', borderRadius: 999, border: '1px solid var(--border-primary)' }}>{year}</span>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{title}</h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className={`section ${isDark ? 'section-gradient-dark' : ''}`}>
        <div className="container">
          <SectionTitle overline="Structure" heading="Roles & Responsibilities" subheading="Each team member brings specialized expertise that complements the others." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {roles.map(({ role, name, desc, color }, i) => (
              <motion.div
                key={i}
                className="glass-card"
                style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 6 }} />
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{name}</span>
                    <span style={{ fontSize: '0.75rem', color: color, background: 'var(--surface-secondary)', border: '1px solid var(--border-primary)', padding: '0.2rem 0.6rem', borderRadius: 999, fontWeight: 600 }}>{role}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
