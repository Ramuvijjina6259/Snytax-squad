import { useState, useEffect } from 'react';
import { Mail, CheckCircle, Trash2, Eye, EyeOff, Search, Calendar, MessageCircle } from 'lucide-react';
import { getMessages, updateMessageStatus, deleteMessage } from '../../services/api';
import { LoadingSpinner } from '../../components/common/Loading';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, unread, read
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeTab !== 'all') params.status = activeTab;
      const { data } = await getMessages(params);
      setMessages(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (msg) => {
    const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
    try {
      await updateMessageStatus(msg._id, nextStatus);
      fetchMessages();
      if (selectedMessage && selectedMessage._id === msg._id) {
        setSelectedMessage(prev => ({ ...prev, status: nextStatus }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteMessage(deleteId);
      setDeleteId(null);
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert('Error removing contact message.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      try {
        await updateMessageStatus(msg._id, 'read');
        fetchMessages();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredMessages = messages.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Contact Messages</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Review customer inquiries, proposal submissions, and contact form entries.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
        {/* Messages List Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Search */}
            <div className="search-wrapper" style={{ margin: 0, maxWidth: '100%' }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search messages..."
                className="input search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {['all', 'unread', 'read'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ textTransform: 'capitalize', flex: 1, justifyContent: 'center' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Retrieving messages inbox..." />
          ) : filteredMessages.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <MessageCircle size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.875rem' }}>No messages found in this category</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto' }}>
              {filteredMessages.map(msg => (
                <div
                  key={msg._id}
                  onClick={() => handleSelectMessage(msg)}
                  className="glass-card"
                  style={{
                    padding: '1rem', cursor: 'pointer',
                    borderLeft: msg.status === 'unread' ? '4px solid var(--text-primary)' : '1px solid var(--border-primary)',
                    background: selectedMessage?._id === msg._id ? 'var(--surface-active)' : 'var(--surface-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{msg.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.subject}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Details Pane */}
        <div>
          {selectedMessage ? (
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>{selectedMessage.subject}</h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    From: <strong>{selectedMessage.name}</strong> ({selectedMessage.email})
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="social-btn"
                    title={selectedMessage.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                  >
                    {selectedMessage.status === 'unread' ? <CheckCircle size={15} /> : <Mail size={15} />}
                  </button>
                  <button
                    onClick={() => setDeleteId(selectedMessage._id)}
                    className="social-btn"
                    style={{ color: 'var(--text-primary)' }}
                    title="Delete Message"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <Calendar size={12} />
                  <span>Received on {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', background: 'var(--surface-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                  {selectedMessage.message}
                </p>
              </div>

              {/* Quick Reply CTA */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <Mail size={14} /> Reply via Client Mailer
                </a>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Mail size={44} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h3>No Message Selected</h3>
              <p style={{ fontSize: '0.85rem' }}>Select a conversation from the left inbox stream to view details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Message"
        message="Are you sure you want to permanently delete this contact inquiry message?"
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
}
