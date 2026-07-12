import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, Eye, EyeOff, Save, X, Sparkles } from 'lucide-react';
import { getAllMembersAdmin, createMember, updateMember, deleteMember, updateAdminProfile } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';

export default function Members() {
  const { admin } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState({
    name: '', role: '', shortBio: '', fullBio: '', email: '', location: '',
    careerObjective: '', portfolioUrl: '', githubUrl: '', linkedinUrl: '', resumeUrl: '',
    availability: 'Open to Opportunities', displayOrder: 0, isVisible: true,
    skills: [], responsibilities: [], areasOfInterest: [], currentLearning: [], filterCategory: []
  });
  const [photoFile, setPhotoFile] = useState(null);
  
  // Custom skills builder
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate', category: 'Frontend Development' });
  // Custom text array items builders
  const [newResp, setNewResp] = useState('');
  const [newInt, setNewInt] = useState('');
  const [newLearn, setNewLearn] = useState('');
  
  // Confirm Delete Modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data } = await getAllMembersAdmin();
      const fetchedMembers = data.data || [];
      setMembers(fetchedMembers);
      
      if (admin?.role !== 'admin') {
        const matched = fetchedMembers.find(m => m.email === admin.email);
        if (matched) {
          handleEdit(matched);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (m) => {
    setEditingMember(m);
    setFormData({
      name: m.name || '',
      role: m.role || '',
      shortBio: m.shortBio || '',
      fullBio: m.fullBio || '',
      email: m.email || '',
      location: m.location || '',
      careerObjective: m.careerObjective || '',
      portfolioUrl: m.portfolioUrl || '',
      githubUrl: m.githubUrl || '',
      linkedinUrl: m.linkedinUrl || '',
      resumeUrl: m.resumeUrl || '',
      availability: m.availability || 'Open to Opportunities',
      displayOrder: m.displayOrder || 0,
      isVisible: m.isVisible !== undefined ? m.isVisible : true,
      skills: m.skills || [],
      responsibilities: m.responsibilities || [],
      areasOfInterest: m.areasOfInterest || [],
      currentLearning: m.currentLearning || [],
      filterCategory: m.filterCategory || []
    });
    setNewPassword('');
    setConfirmPassword('');
    setPhotoFile(null);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingMember(null);
    setNewPassword('');
    setConfirmPassword('');
    setFormData({
      name: '', role: '', shortBio: '', fullBio: '', email: '', location: '',
      careerObjective: '', portfolioUrl: '', githubUrl: '', linkedinUrl: '', resumeUrl: '',
      availability: 'Open to Opportunities', displayOrder: 0, isVisible: true,
      skills: [], responsibilities: [], areasOfInterest: [], currentLearning: [], filterCategory: []
    });
    setPhotoFile(null);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
    }

    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        dataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        dataToSend.append(key, formData[key]);
      }
    });

    if (photoFile) {
      dataToSend.append('profileImage', photoFile);
    }

    try {
      setLoading(true);
      if (editingMember) {
        await updateMember(editingMember._id, dataToSend);

        if (editingMember.email === admin.email) {
          const authData = { name: formData.name, email: formData.email };
          if (newPassword) authData.password = newPassword;
          await updateAdminProfile(authData);
        }
      } else {
        await createMember(dataToSend);
      }
      setNewPassword('');
      setConfirmPassword('');
      setShowForm(false);
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert('Error updating team member information.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteMember(deleteId);
      setDeleteId(null);
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert('Error deleting member.');
    } finally {
      setDeleting(false);
    }
  };

  // Skills handlers
  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
    setNewSkill({ name: '', level: 'Intermediate', category: 'Frontend Development' });
  };
  const removeSkill = (idx) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));
  };

  // Responsibilities handlers
  const addResp = () => {
    if (!newResp.trim()) return;
    setFormData(prev => ({ ...prev, responsibilities: [...prev.responsibilities, newResp.trim()] }));
    setNewResp('');
  };
  const removeResp = (idx) => {
    setFormData(prev => ({ ...prev, responsibilities: prev.responsibilities.filter((_, i) => i !== idx) }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Team Members Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Configure squad directory, edit bios, responsibilities, and individual technical skills.</p>
        </div>
        {!showForm && (
          <button onClick={handleAddNew} className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Plus size={16} /> Add Member
          </button>
        )}
      </div>

      {loading && !showForm && <LoadingSpinner text="Retrieving records..." />}

      {!loading && !showForm && (
        <div className="glass-card table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Order</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {m.profileImage ? (
                        <img
                          src={`http://localhost:5000${m.profileImage}`}
                          alt={m.name}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="member-avatar-placeholder" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
                          {m.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge">{m.role}</span></td>
                  <td>{m.displayOrder}</td>
                  <td>
                    {m.isVisible ? (
                      <span className="badge" style={{ gap: '0.3rem' }}><Eye size={12} /> Visible</span>
                    ) : (
                      <span className="badge" style={{ gap: '0.3rem' }}><EyeOff size={12} /> Hidden</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(m)} className="social-btn" aria-label="Edit Profile">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(m._id)} className="social-btn" style={{ color: 'var(--text-primary)' }} aria-label="Remove Profile">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Profile Create/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="currentColor" />
              {editingMember ? 'Modify Squad Profile' : 'Register Squad Profile'}
            </h3>
            {admin?.role === 'admin' && (
              <button type="button" onClick={() => setShowForm(false)} className="social-btn" style={{ width: 32, height: 32 }}><X size={16} /></button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Left section: Identity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="name">Full Name</label>
                <input id="name" type="text" className="input" value={formData.name} onChange={handleFormChange} required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="role">Team Role</label>
                <input id="role" type="text" className="input" value={formData.role} onChange={handleFormChange} required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="email">Email</label>
                <input id="email" type="email" className="input" value={formData.email} onChange={handleFormChange} required />
              </div>
              {editingMember && editingMember.email === admin.email && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="newPassword">New Login Password</label>
                    <input id="newPassword" type="password" className="input" placeholder="Leave blank to keep current" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                    <input id="confirmPassword" type="password" className="input" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
              )}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="location">Location</label>
                <input id="location" type="text" className="input" value={formData.location} onChange={handleFormChange} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="profileImage">Upload Profile Photo</label>
                <input id="profileImage" type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="displayOrder">Display Order</label>
                  <input id="displayOrder" type="number" className="input" value={formData.displayOrder} onChange={handleFormChange} disabled={admin?.role !== 'admin'} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="availability">Availability</label>
                  <select id="availability" className="input" value={formData.availability} onChange={handleFormChange}>
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Open to Opportunities">Open to Opportunities</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <input id="isVisible" type="checkbox" checked={formData.isVisible} onChange={handleFormChange} disabled={admin?.role !== 'admin'} />
                <label htmlFor="isVisible" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Make Profile Publicly Visible</label>
              </div>
            </div>

            {/* Right section: Bio & Portfolios */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="shortBio">Short Bio (Preview Summary)</label>
                <input id="shortBio" type="text" className="input" value={formData.shortBio} onChange={handleFormChange} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="fullBio">Full Personal Bio</label>
                <textarea id="fullBio" className="input textarea" value={formData.fullBio} onChange={handleFormChange} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="careerObjective">Career Objective</label>
                <input id="careerObjective" type="text" className="input" value={formData.careerObjective} onChange={handleFormChange} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="portfolioUrl">Portfolio URL</label>
                  <input id="portfolioUrl" type="url" className="input" value={formData.portfolioUrl} onChange={handleFormChange} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="resumeUrl">Resume Document URL</label>
                  <input id="resumeUrl" type="url" className="input" value={formData.resumeUrl} onChange={handleFormChange} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="githubUrl">GitHub URL</label>
                  <input id="githubUrl" type="url" className="input" value={formData.githubUrl} onChange={handleFormChange} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="linkedinUrl">LinkedIn URL</label>
                  <input id="linkedinUrl" type="url" className="input" value={formData.linkedinUrl} onChange={handleFormChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Sub-lists: Skills & Responsibilities builder */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Skills Builder */}
            <div>
              <label className="form-label">Profile Skills Matrix</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Skill Name"
                  className="input"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                />
                <select
                  className="input"
                  style={{ width: '120px' }}
                  value={newSkill.level}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button type="button" onClick={addSkill} className="btn btn-secondary btn-sm">Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {formData.skills.map((s, idx) => (
                  <span key={idx} className="badge" style={{ gap: '0.4rem', paddingRight: '0.4rem' }}>
                    {s.name} ({s.level.charAt(0)})
                    <X size={10} style={{ cursor: 'pointer' }} onClick={() => removeSkill(idx)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Responsibilities Builder */}
            <div>
              <label className="form-label">Squad Responsibilities</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="e.g. Lead API Design"
                  className="input"
                  value={newResp}
                  onChange={(e) => setNewResp(e.target.value)}
                />
                <button type="button" onClick={addResp} className="btn btn-secondary btn-sm">Add</button>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', listStyle: 'none' }}>
                {formData.responsibilities.map((r, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '0.4rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)' }}>
                    <span>{r}</span>
                    <Trash2 size={12} style={{ cursor: 'pointer', color: 'var(--text-primary)' }} onClick={() => removeResp(idx)} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            {admin?.role === 'admin' && (
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            )}
            <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <Save size={16} /> Save profile
            </button>
          </div>
        </form>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to completely remove this squad profile? This action is irreversible."
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
}
