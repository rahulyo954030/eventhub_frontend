export default function FormSection({ title, description, children, className = '' }) {
  return (
    <section className={`form-section ${className}`}>
      {(title || description) && (
        <div className="form-section-header">
          {title && <h2 className="form-section-title">{title}</h2>}
          {description && <p className="form-section-desc">{description}</p>}
        </div>
      )}
      <div className="form-section-body space-y-4">{children}</div>
    </section>
  );
}
