import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure?', confirmText = 'Confirm', confirmVariant = 'danger', loading = false }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={20} color="currentColor" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
              </div>
              <button onClick={onClose} className="social-btn" style={{ width: 32, height: 32 }}>
                <X size={16} />
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6 }}>{message}</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
              <button
                onClick={onConfirm}
                className={`btn btn-${confirmVariant} btn-sm`}
                disabled={loading}
              >
                {loading ? 'Processing...' : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
