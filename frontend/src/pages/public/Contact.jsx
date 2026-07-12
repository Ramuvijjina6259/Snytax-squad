import { useState, useEffect } from 'react';
import { Mail, MapPin, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Github, Linkedin } from '../../components/common/Icons';
import SectionTitle from '../../components/common/SectionTitle';
import { submitContact } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export default function Contact() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    document.title = 'Get in Touch | Syntax Squad';
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ type: 'error', msg: 'Please fill in all contact form fields.' });
      return;
    }
    try {
      setLoading(true);
      setStatus({ type: '', msg: '' });
      const { data } = await submitContact(formData);
      if (data.success) {
        setStatus({ type: 'success', msg: data.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', msg: data.message || 'Something went wrong.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Error submitting message. Please check server connection.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        <SectionTitle
          overline="Contact"
          heading="Get In Touch"
          subheading="Have questions, ideas or potential opportunities? Write to the Syntax Squad."
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', marginTop: '1.5rem' }}>
          {/* Info Card */}
          <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Contact Information</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Fill out the form or reach out directly via email or our organizational handles.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={18} color="currentColor" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Us</div>
                  <a href="mailto:syntaxsquad.team@gmail.com" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
                    syntaxsquad.team@gmail.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} color="currentColor" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Andhra Pradesh, India</div>
                </div>
              </div>
            </div>

            <div className="divider" style={{ margin: 0 }} />

            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.08em' }}>
                Connect With Us
              </h4>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a href="https://github.com/syntax-squad" target="_blank" rel="noopener noreferrer" className="social-btn" style={{ width: 44, height: 44 }} aria-label="GitHub Organization">
                  <Github size={18} />
                </a>
                <a href="https://linkedin.com/company/syntax-squad" target="_blank" rel="noopener noreferrer" className="social-btn" style={{ width: 44, height: 44 }} aria-label="LinkedIn Page">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    className="input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="What is this regarding?"
                  className="input"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  placeholder="Write your message here..."
                  className="input textarea"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Status Display */}
              {status.msg && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '1rem', borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-secondary)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}>
                  {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  <span>{status.msg}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ alignSelf: 'flex-start', gap: '0.6rem' }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
