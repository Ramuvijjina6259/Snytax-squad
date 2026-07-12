import { useState, useEffect } from 'react';
import { Save, Sparkles, Globe, Mail, MapPin } from 'lucide-react';
import { getSettings, updateSettings } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import { useSettings } from '../../context/SettingsContext';
import LogoIcon from '../../components/common/LogoIcon';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const { settings, refreshSettings } = useSettings();
  
  const [formData, setFormData] = useState({
    teamName: '', tagline: '', description: '', mission: '', vision: '',
    email: '', location: '', heroText: '', footerText: '',
    socialLinks: { github: '', linkedin: '', twitter: '', instagram: '' }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await getSettings();
      if (data.success && data.data) {
        const d = data.data;
        setFormData({
          teamName: d.teamName || '',
          tagline: d.tagline || '',
          description: d.description || '',
          mission: d.mission || '',
          vision: d.vision || '',
          email: d.email || '',
          location: d.location || '',
          heroText: d.heroText || '',
          footerText: d.footerText || '',
          socialLinks: d.socialLinks || { github: '', linkedin: '', twitter: '', instagram: '' }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSocialChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [id]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'socialLinks') {
        dataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        dataToSend.append(key, formData[key]);
      }
    });

    if (logoFile) {
      dataToSend.append('logo', logoFile);
    }

    try {
      setSaving(true);
      await updateSettings(dataToSend);
      alert('Global configurations updated successfully.');
      await refreshSettings();
      fetchSettings();
    } catch (err) {
      console.error(err);
      alert('Error updating system configurations.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Retrieving configuration attributes..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Global Website Settings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Configure website properties, core objectives, mission/vision statements, and organization anchors.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.75rem' }}>
          <Sparkles size={18} color="currentColor" /> Brand Identity & Hero Configuration
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="teamName">Team / Brand Name</label>
              <input id="teamName" type="text" className="input" value={formData.teamName} onChange={handleFormChange} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="tagline">Official Tagline</label>
              <input id="tagline" type="text" className="input" value={formData.tagline} onChange={handleFormChange} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="logo">Upload Logo File</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 10,
                  background: (settings?.logo || logoFile) ? 'transparent' : 'var(--background-secondary)',
                  border: '1px dashed var(--border-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {logoFile ? (
                    <img src={URL.createObjectURL(logoFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : settings?.logo ? (
                    <img src={settings.logo} alt="Current Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ color: 'var(--text-muted)' }}>
                      <LogoIcon size={24} />
                    </div>
                  )}
                </div>
                <input id="logo" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} style={{ flex: 1 }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="heroText">Hero Section Description</label>
              <textarea id="heroText" className="input textarea" value={formData.heroText} onChange={handleFormChange} required />
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.75rem' }}>
          <Globe size={18} color="currentColor" /> Core Mission & Organization Statements
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="mission">Mission Statement</label>
            <textarea id="mission" className="input textarea" value={formData.mission} onChange={handleFormChange} required />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="vision">Vision Statement</label>
            <textarea id="vision" className="input textarea" value={formData.vision} onChange={handleFormChange} required />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="form-label" htmlFor="description">About description (Team Detail Summary)</label>
          <textarea id="description" className="input textarea" style={{ minHeight: '80px' }} value={formData.description} onChange={handleFormChange} required />
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.75rem' }}>
          <Mail size={18} color="currentColor" /> Contact Anchor Coordinates
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="email">Public Contact Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="email" type="email" className="input" style={{ paddingLeft: '2.75rem' }} value={formData.email} onChange={handleFormChange} required />
            </div>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="location">Physical / Primary HQ Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="location" type="text" className="input" style={{ paddingLeft: '2.75rem' }} value={formData.location} onChange={handleFormChange} required />
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.75rem' }}>
          Social Networking URLs
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="github">GitHub Organization Link</label>
              <input id="github" type="url" className="input" value={formData.socialLinks.github} onChange={handleSocialChange} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="linkedin">LinkedIn Page URL</label>
              <input id="linkedin" type="url" className="input" value={formData.socialLinks.linkedin} onChange={handleSocialChange} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="twitter">Twitter / X URL</label>
              <input id="twitter" type="url" className="input" value={formData.socialLinks.twitter} onChange={handleSocialChange} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="instagram">Instagram Account Link</label>
              <input id="instagram" type="url" className="input" value={formData.socialLinks.instagram} onChange={handleSocialChange} />
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="form-label" htmlFor="footerText">Copyright / Footer Text</label>
          <input id="footerText" type="text" className="input" value={formData.footerText} onChange={handleFormChange} required />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-primary)', paddingTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }} disabled={saving}>
            <Save size={16} /> {saving ? 'Applying...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
