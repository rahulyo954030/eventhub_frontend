export default function EmptyState({ title, description, action }) {
  return (
    <div className="px-6 py-14 text-center">
      <h3 className="font-medium text-stone-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
