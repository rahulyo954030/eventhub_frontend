export default function FormAlert({ variant = 'error', title, children }) {
  const styles = {
    success: 'border-primary-200 bg-primary-50 text-primary-900',
    error: 'border-red-200 bg-red-50 text-red-900',
    info: 'border-stone-200 bg-stone-50 text-stone-800',
  };

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${styles[variant] || styles.error}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      {children ? (
        <div className={title ? 'mt-1' : ''}>{children}</div>
      ) : null}
    </div>
  );
}
