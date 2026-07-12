import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Sparkles } from 'lucide-react';
import { getAchievements, createAchievement, updateAchievement, deleteAchievement, getMembers } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';

const types = [
  'Certification', 'Hackathon', 'Workshop', 'Award', 'Internship',
  'Project Milestone', 'College Achievement', 'Competition', 'Other'
];

export default function Achievements() {
  const { admin } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', organization: '', date: '', description: '', type: 'Certification',
    certificateUrl: '', member: '', memberName: ''
  });
  
  const [certFile, setCertFile] = useState(null);

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAchievementsAndMembers();
  }, []);

  const fetchAchievementsAndMembers = async () => {
    try {
      setLoading(true);
      const [achRes, memRes] = await Promise.all([getAchievements(), getMembers()]);
      setAchievements(achRes.data.data || []);
      setMembers(memRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (a) => {
    setEditingAchievement(a);
    setFormData({
      title: a.title || '',
      organization: a.organization || '',
      date: a.date ? new Date(a.date).toISOString().split('T')[0] : '',
      description: a.description || '',
      type: a.type || 'Certification',
      certificateUrl: a.certificateUrl || '',
      member: a.member ? (typeof a.member === 'object' ? a.member._id : a.member) : '',
      memberName: a.memberName || ''
    });
    setCertFile(null);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingAchievement(null);
    let matchedMemberId = '';
    let matchedMemberName = '';
    if (admin?.role !== 'admin') {
      const matched = members.find(m => m.email === admin.email);
      if (matched) {
        matchedMemberId = matched._id;
        matchedMemberName = matched.name;
      }
    }
    setFormData({
      title: '', organization: '', date: '', description: '', type: 'Certification',
      certificateUrl: '', member: matchedMemberId, memberName: matchedMemberName
    });
    setCertFile(null);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => {
      let updated = { ...prev, [id]: value };
      if (id === 'member') {
        const matched = members.find(m => m._id === value);
        updated.memberName = matched ? matched.name : '';
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      dataToSend.append(key, formData[key]);
    });
    if (certFile) {
      dataToSend.append('certificateImage', certFile);
    }

    try {
      setLoading(true);
      if (editingAchievement) {
        await updateAchievement(editingAchievement._id, dataToSend);
      } else {
        await createAchievement(dataToSend);
      }
      setShowForm(false);
      fetchAchievementsAndMembers();
    } catch (err) {
      console.error(err);
      alert('Error updating achievement document.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteAchievement(deleteId);
      setDeleteId(null);
      fetchAchievementsAndMembers();
    } catch (err) {
      console.error(err);
      alert('Error removing achievement.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Achievements & Honors</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Manage certifications, hackathons, academic medals, workshops, and assign earners.</p>
        </div>
        {!showForm && (
          <button onClick={handleAddNew} className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Plus size={16} /> Add Achievement
          </button>
        )}
      </div>

      {loading && !showForm && <LoadingSpinner text="Retrieving records..." />}

      {!loading && !showForm && (
        <div className="glass-card table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Issuer</th>
                <th>Earner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map(a => (
                <tr key={a._id}>
                  <td style={{ fontWeight: 600 }}>{a.title}</td>
                  <td><span className="badge">{a.type}</span></td>
                  <td>{a.organization}</td>
                  <td><span className="badge">{a.memberName || 'Team'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(a)} className="social-btn" aria-label="Edit Achievement"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteId(a._id)} className="social-btn" style={{ color: 'var(--text-primary)' }} aria-label="Remove Achievement"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Achievement Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="currentColor" />
              {editingAchievement ? 'Modify Achievement Record' : 'Record New Achievement'}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="social-btn" style={{ width: 32, height: 32 }}><X size={16} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Left side */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="title">Achievement / Honor Title</label>
                <input id="title" type="text" className="input" value={formData.title} onChange={handleFormChange} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="type">Achievement Type</label>
                  <select id="type" className="input" value={formData.type} onChange={handleFormChange}>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="date">Award Date</label>
                  <input id="date" type="date" className="input" value={formData.date} onChange={handleFormChange} required />
                </div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="organization">Issuing Organization</label>
                <input id="organization" type="text" className="input" value={formData.organization} onChange={handleFormChange} required />
              </div>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="member">Assign Earner (Squad Member)</label>
                <select id="member" className="input" value={formData.member} onChange={handleFormChange} required disabled={admin?.role !== 'admin'}>
                  <option value="">Select Team Member</option>
                  {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="certificateUrl">Verification / Credential URL</label>
                <input id="certificateUrl" type="url" className="input" value={formData.certificateUrl} onChange={handleFormChange} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="certificateImage">Upload Certificate Image File</label>
                <input id="certificateImage" type="file" accept="image/*" onChange={(e) => setCertFile(e.target.files[0])} />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <label className="form-label" htmlFor="description">Detailed Description / Context</label>
            <textarea id="description" className="input textarea" value={formData.description} onChange={handleFormChange} required />
          </div>

          <div className="divider" />

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <Save size={16} /> Save credentials
            </button>
          </div>
        </form>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Removal"
        message="Are you sure you want to delete this achievement certificate record?"
        confirmText="Remove"
        loading={deleting}
      />
    </div>
  );
}
