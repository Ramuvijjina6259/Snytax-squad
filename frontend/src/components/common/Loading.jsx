export function LoadingSpinner({ size = 40, text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '1rem' }}>
      <div style={{
        width: size, height: size,
        border: '3px solid var(--border-primary)',
        borderTop: '3px solid var(--text-primary)',
        borderRadius: '50%',
        animation: 'spin-slow 0.8s linear infinite',
      }} />
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{text}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="skeleton" style={{ width: 64, height: 64, borderRadius: '50%' }} />
      <div className="skeleton" style={{ height: 20, width: '70%', borderRadius: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '50%', borderRadius: 8 }} />
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[1,2,3].map(i => (
          <div key={i} className="skeleton" style={{ height: 26, width: 60, borderRadius: 13 }} />
        ))}
      </div>
      <div className="skeleton" style={{ height: 40, borderRadius: 20 }} />
    </div>
  );
}

export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      {title && <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h3>}
      {description && <p style={{ fontSize: '0.9rem', maxWidth: 400 }}>{description}</p>}
      {action}
    </div>
  );
}
