import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LoginBackground3D from '@/components/admin/LoginBackground3D';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Admin Login | Syntax Squad';
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: '#050505',
      overflow: 'hidden'
    }}>
      <LoginBackground3D />
      <div className="glass-card" style={{ position: 'relative', zIndex: 10, maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'var(--surface-secondary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem', boxShadow: 'var(--shadow-md)'
          }}>
            <KeyRound size={22} color="currentColor" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Admin Control Panel</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter credentials to access administrative dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
              background: 'var(--surface-secondary)', border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)', fontSize: '0.825rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="email">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="email"
                type="email"
                placeholder="admin@syntaxsquad.dev"
                className="input"
                style={{ paddingLeft: '2.75rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="password">Security Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input"
                style={{ paddingRight: '2.75rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '1rem', top: '50%',
                  transform: 'translateY(-50%)', border: 'none',
                  background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Remember Me
            </label>
            <button
              type="button"
              onClick={() => alert('Please contact database administrator to reset administrative password.')}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 500 }}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
