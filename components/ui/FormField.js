export default function FormField({
  label,
  hint,
  error,
  required,
  optional,
  children,
  className = '',
  labelExtra,
}) {
  return (
    <div className={`form-field ${className}`}>
      {(label || labelExtra) && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          {label && (
            <label className="label !mb-0">
              {label}
              {required && <span className="text-primary-700"> *</span>}
              {optional && (
                <span className="font-normal text-stone-400"> (optional)</span>
              )}
            </label>
          )}
          {labelExtra}
        </div>
      )}
      {children}
      {error ? (
        <p className="field-error">{error}</p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}
