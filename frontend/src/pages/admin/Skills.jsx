import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Sparkles, CheckSquare } from 'lucide-react';
import { getSkills, createSkill, updateSkill, deleteSkill, getMembers } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import ConfirmModal from '../../components/common/ConfirmModal';

const categories = [
  'Frontend Development', 'Backend Development', 'Artificial Intelligence',
  'Machine Learning', 'Database Management', 'UI/UX Design', 'Deployment', 'Development Tools', 'Programming Languages', 'Soft Skills', 'Other'
];

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', category: 'Frontend Development', icon: '', experienceLevel: 'Intermediate', members: []
  });

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSkillsAndMembers();
  }, []);

  const fetchSkillsAndMembers = async () => {
    try {
      setLoading(true);
      const [skillsRes, memRes] = await Promise.all([getSkills(), getMembers()]);
      setSkills(skillsRes.data.data || []);
      setMembers(memRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setEditingSkill(s);
    setFormData({
      name: s.name || '',
      category: s.category || 'Frontend Development',
      icon: s.icon || '',
      experienceLevel: s.experienceLevel || 'Intermediate',
      members: s.members ? s.members.map(m => typeof m === 'object' ? m._id : m) : []
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingSkill(null);
    setFormData({
      name: '', category: 'Frontend Development', icon: '', experienceLevel: 'Intermediate', members: []
    });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleMemberCheckbox = (memberId) => {
    setFormData(prev => {
      const alreadyChecked = prev.members.includes(memberId);
      return {
        ...prev,
        members: alreadyChecked ? prev.members.filter(id => id !== memberId) : [...prev.members, memberId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingSkill) {
        await updateSkill(editingSkill._id, formData);
      } else {
        await createSkill(formData);
      }
      setShowForm(false);
      fetchSkillsAndMembers();
    } catch (err) {
      console.error(err);
      alert('Error updating skill inventory details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteSkill(deleteId);
      setDeleteId(null);
      fetchSkillsAndMembers();
    } catch (err) {
      console.error(err);
      alert('Error removing skill.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Global Skills Repository</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Configure team capabilities grid, categories, and map skills to squad members.</p>
        </div>
        {!showForm && (
          <button onClick={handleAddNew} className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Plus size={16} /> Add Skill
          </button>
        )}
      </div>

      {loading && !showForm && <LoadingSpinner text="Mapping records..." />}

      {!loading && !showForm && (
        <div className="glass-card table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Experience Level</th>
                <th>Associated Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(s => (
                <tr key={s._id}>
                  <td style={{ fontWeight: 600 }}>{s.icon ? `${s.icon} ` : ''}{s.name}</td>
                  <td><span className="badge">{s.category}</span></td>
                  <td><span className="badge">{s.experienceLevel}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {s.members?.map(m => (
                        <span key={m._id} className="badge" style={{ fontSize: '0.65rem' }}>{m.name}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(s)} className="social-btn" aria-label="Edit Skill"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteId(s._id)} className="social-btn" style={{ color: 'var(--text-primary)' }} aria-label="Remove Skill"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Skill Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="currentColor" />
              {editingSkill ? 'Modify Skill Definition' : 'Register New Skill'}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="social-btn" style={{ width: 32, height: 32 }}><X size={16} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Identity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="name">Skill Name</label>
                <input id="name" type="text" className="input" value={formData.name} onChange={handleFormChange} required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="category">Category</label>
                <select id="category" className="input" value={formData.category} onChange={handleFormChange}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="icon">Emoji / Icon Represent</label>
                  <input id="icon" type="text" placeholder="e.g. ⚛️" className="input" value={formData.icon} onChange={handleFormChange} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="experienceLevel">Experience Level</label>
                  <select id="experienceLevel" className="input" value={formData.experienceLevel} onChange={handleFormChange}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Link members */}
            <div>
              <label className="form-label">Link Squad Members possessing this Skill</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 220, overflowY: 'auto', padding: '0.5rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)' }}>
                {members.map(m => (
                  <label key={m._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.members.includes(m._id)}
                      onChange={() => handleMemberCheckbox(m._id)}
                    />
                    <span>{m.name} (<span style={{ color: 'var(--text-muted)' }}>{m.role}</span>)</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="divider" />

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <Save size={16} /> Save skill configuration
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
        message="Are you sure you want to remove this skill? Associated member badges will be updated."
        confirmText="Remove"
        loading={deleting}
      />
    </div>
  );
}
