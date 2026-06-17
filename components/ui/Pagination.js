'use client';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total } = pagination;

  return (
    <div className="flex flex-col gap-3 border-t border-stone-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="text-center text-sm text-stone-600 sm:text-left">
        Page <span className="font-medium text-stone-800">{page}</span> of{' '}
        <span className="font-medium text-stone-800">{totalPages}</span>
        <span className="hidden sm:inline"> · {total} total</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn-secondary !min-h-[44px] !px-3 text-xs sm:!min-h-0"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="btn-secondary !min-h-[44px] !px-3 text-xs sm:!min-h-0"
        >
          Next
        </button>
      </div>
    </div>
  );
}
