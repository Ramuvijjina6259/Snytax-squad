import { motion } from 'framer-motion';

export default function SectionTitle({ overline, heading, subheading, align = 'center' }) {
  return (
    <motion.div
      className="section-title"
      style={{ textAlign: align }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {overline && (
        <div style={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
          <span className="section-overline">{overline}</span>
        </div>
      )}
      <h2 className="section-heading">{heading}</h2>
      {subheading && <p className="section-subheading">{subheading}</p>}
    </motion.div>
  );
}
