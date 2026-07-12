import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Sparkles, Star } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject, getMembers } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import ConfirmModal from '../../components/common/ConfirmModal';

const categories = [
  'Web Development', 'Full Stack', 'Artificial Intelligence',
  'Machine Learning', 'Healthcare', 'Education', 'Mobile Applications', 'Messaging Platform', 'Other'
];

const statuses = ['Planning', 'In Progress', 'Testing', 'Completed', 'Deployed', 'Maintenance'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', shortDescription: '', fullDescription: '', problemStatement: '', proposedSolution: '',
    category: 'Web Development', status: 'Planning', progressPercentage: 0,
    githubUrl: '', liveDemoUrl: '', documentationUrl: '', isFeatured: false, displayOrder: 0,
    technologies: [], objectives: [], features: [], challenges: [], futureImprovements: [], contributors: []
  });
  
  // File attachments state
  const [coverFile, setCoverFile] = useState(null);
  
  // Custom list sub-item creators
  const [newTech, setNewTech] = useState('');
  const [newFeat, setNewFeat] = useState('');
  const [newChal, setNewChal] = useState('');
  const [newImp, setNewImp] = useState('');
  
  // Contributor sub-form
  const [contribForm, setContribForm] = useState({ memberId: '', role: '', workCompleted: [] });
  const [newWorkItem, setNewWorkItem] = useState('');

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjectsAndMembers();
  }, []);

  const fetchProjectsAndMembers = async () => {
    try {
      setLoading(true);
      const [projRes, memRes] = await Promise.all([getProjects(), getMembers()]);
      setProjects(projRes.data.data || []);
      setMembers(memRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditingProject(p);
    setFormData({
      title: p.title || '',
      shortDescription: p.shortDescription || '',
      fullDescription: p.fullDescription || '',
      problemStatement: p.problemStatement || '',
      proposedSolution: p.proposedSolution || '',
      category: p.category || 'Web Development',
      status: p.status || 'Planning',
      progressPercentage: p.progressPercentage || 0,
      githubUrl: p.githubUrl || '',
      liveDemoUrl: p.liveDemoUrl || '',
      documentationUrl: p.documentationUrl || '',
      isFeatured: p.isFeatured !== undefined ? p.isFeatured : false,
      displayOrder: p.displayOrder || 0,
      technologies: p.technologies || [],
      objectives: p.objectives || [],
      features: p.features || [],
      challenges: p.challenges || [],
      futureImprovements: p.futureImprovements || [],
      contributors: p.contributors || []
    });
    setCoverFile(null);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setFormData({
      title: '', shortDescription: '', fullDescription: '', problemStatement: '', proposedSolution: '',
      category: 'Web Development', status: 'Planning', progressPercentage: 0,
      githubUrl: '', liveDemoUrl: '', documentationUrl: '', isFeatured: false, displayOrder: 0,
      technologies: [], objectives: [], features: [], challenges: [], futureImprovements: [], contributors: []
    });
    setCoverFile(null);
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
    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        dataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        dataToSend.append(key, formData[key]);
      }
    });

    if (coverFile) {
      dataToSend.append('coverImage', coverFile);
    }

    try {
      setLoading(true);
      if (editingProject) {
        await updateProject(editingProject._id, dataToSend);
      } else {
        await createProject(dataToSend);
      }
      setShowForm(false);
      fetchProjectsAndMembers();
    } catch (err) {
      console.error(err);
      alert('Error updating project file details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteProject(deleteId);
      setDeleteId(null);
      fetchProjectsAndMembers();
    } catch (err) {
      console.error(err);
      alert('Error removing project record.');
    } finally {
      setDeleting(false);
    }
  };

  // Technologies builder helper
  const addTech = () => {
    if (!newTech.trim() || formData.technologies.includes(newTech.trim())) return;
    setFormData(prev => ({ ...prev, technologies: [...prev.technologies, newTech.trim()] }));
    setNewTech('');
  };
  const removeTech = (item) => {
    setFormData(prev => ({ ...prev, technologies: prev.technologies.filter(t => t !== item) }));
  };

  // Contributors builder
  const addContributor = () => {
    if (!contribForm.memberId || !contribForm.role) return;
    const selectedMem = members.find(m => m._id === contribForm.memberId);
    if (!selectedMem) return;

    const newContrib = {
      member: selectedMem._id,
      name: selectedMem.name,
      role: contribForm.role,
      workCompleted: contribForm.workCompleted,
      status: 'In Progress'
    };

    setFormData(prev => ({ ...prev, contributors: [...prev.contributors, newContrib] }));
    setContribForm({ memberId: '', role: '', workCompleted: [] });
  };

  const addWorkCompletedItem = () => {
    if (!newWorkItem.trim()) return;
    setContribForm(prev => ({ ...prev, workCompleted: [...prev.workCompleted, newWorkItem.trim()] }));
    setNewWorkItem('');
  };

  const removeContributor = (idx) => {
    setFormData(prev => ({ ...prev, contributors: prev.contributors.filter((_, i) => i !== idx) }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Projects Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Maintain organization portfolio, assign project roles, update progress percentage.</p>
        </div>
        {!showForm && (
          <button onClick={handleAddNew} className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Plus size={16} /> Add Project
          </button>
        )}
      </div>

      {loading && !showForm && <LoadingSpinner text="Retrieving records..." />}

      {!loading && !showForm && (
        <div className="glass-card table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td><span className="badge">{p.category}</span></td>
                  <td><span className="badge">{p.status}</span></td>
                  <td>
                    {p.isFeatured ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--text-primary)' }}><Star size={14} fill="currentColor" /> Featured</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Standard</span>
                    )}
                  </td>
                  <td>{p.progressPercentage}%</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(p)} className="social-btn" aria-label="Edit project Details"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteId(p._id)} className="social-btn" style={{ color: 'var(--text-primary)' }} aria-label="Remove project Record"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* project Create/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="currentColor" />
              {editingProject ? 'Modify Project Spec' : 'Launch New Project'}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="social-btn" style={{ width: 32, height: 32 }}><X size={16} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Identity & Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="title">Project Title</label>
                <input id="title" type="text" className="input" value={formData.title} onChange={handleFormChange} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="category">Category</label>
                  <select id="category" className="input" value={formData.category} onChange={handleFormChange}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="status">Development Status</label>
                  <select id="status" className="input" value={formData.status} onChange={handleFormChange}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="progressPercentage">Progress Percentage (%)</label>
                  <input id="progressPercentage" type="number" min="0" max="100" className="input" value={formData.progressPercentage} onChange={handleFormChange} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="displayOrder">Display Order</label>
                  <input id="displayOrder" type="number" className="input" value={formData.displayOrder} onChange={handleFormChange} />
                </div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="coverImage">Cover Image</label>
                <input id="coverImage" type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <input id="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleFormChange} />
                <label htmlFor="isFeatured" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Pin to Home (Featured Project)</label>
              </div>
            </div>

            {/* Explanations & URLs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="shortDescription">Short Description (Summary Card)</label>
                <input id="shortDescription" type="text" className="input" value={formData.shortDescription} onChange={handleFormChange} required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="fullDescription">Full Project Overview</label>
                <textarea id="fullDescription" className="input textarea" value={formData.fullDescription} onChange={handleFormChange} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="githubUrl">GitHub Repository Link</label>
                  <input id="githubUrl" type="url" className="input" value={formData.githubUrl} onChange={handleFormChange} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="liveDemoUrl">Live Demo URL</label>
                  <input id="liveDemoUrl" type="url" className="input" value={formData.liveDemoUrl} onChange={handleFormChange} />
                </div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="documentationUrl">Project Documentation Link</label>
                <input id="documentationUrl" type="url" className="input" value={formData.documentationUrl} onChange={handleFormChange} />
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Sub components: Technologies & Team members builder */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Tech stack tags */}
            <div>
              <label className="form-label">Technology Stack Tags</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="e.g. React.js"
                  className="input"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                />
                <button type="button" onClick={addTech} className="btn btn-secondary btn-sm">Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {formData.technologies.map(t => (
                  <span key={t} className="badge" style={{ gap: '0.4rem', paddingRight: '0.4rem' }}>
                    {t}
                    <X size={10} style={{ cursor: 'pointer' }} onClick={() => removeTech(t)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Contributors assignment form */}
            <div>
              <label className="form-label">Assign Contributors</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <select
                  className="input"
                  value={contribForm.memberId}
                  onChange={(e) => setContribForm(prev => ({ ...prev, memberId: e.target.value }))}
                >
                  <option value="">Select Member</option>
                  {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="Role in this project"
                  className="input"
                  value={contribForm.role}
                  onChange={(e) => setContribForm(prev => ({ ...prev, role: e.target.value }))}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Task completed item"
                    className="input"
                    value={newWorkItem}
                    onChange={(e) => setNewWorkItem(e.target.value)}
                  />
                  <button type="button" onClick={addWorkCompletedItem} className="btn btn-ghost btn-sm">Push</button>
                </div>
                {contribForm.workCompleted.length > 0 && (
                  <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '1rem' }}>
                    {contribForm.workCompleted.map((w, idx) => <li key={idx}>{w}</li>)}
                  </ul>
                )}
                <button type="button" onClick={addContributor} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-end' }}>Add Contributor</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {formData.contributors.map((contrib, idx) => (
                  <div key={idx} style={{ display: 'flex', justify: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '0.4rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <strong>{contrib.name}</strong> - <span style={{ color: 'var(--text-muted)' }}>{contrib.role}</span>
                    </div>
                    <Trash2 size={12} style={{ cursor: 'pointer', color: 'var(--text-primary)' }} onClick={() => removeContributor(idx)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <Save size={16} /> Save project specifications
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
        message="Are you sure you want to delete this project? This will unlink contributor roles."
        confirmText="Remove"
        loading={deleting}
      />
    </div>
  );
}
