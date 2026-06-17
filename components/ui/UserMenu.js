'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import UserAvatar from '@/components/ui/UserAvatar';

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="user-menu-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserAvatar user={user} size="md" className="!ring-0" />
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block truncate text-sm font-semibold leading-tight text-stone-800">
            {user?.name}
          </span>
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-primary-700">
            {user?.role}
          </span>
        </span>
        <svg
          className={`hidden h-4 w-4 shrink-0 text-stone-400 transition sm:block ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="user-menu-panel" role="menu">
          <div className="border-b border-stone-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-stone-900">{user?.name}</p>
            <p className="truncate text-xs text-stone-500">{user?.email}</p>
          </div>
          <Link href="/profile" className="user-menu-item" role="menuitem" onClick={() => setOpen(false)}>
            Profile
          </Link>
          <Link href="/settings" className="user-menu-item" role="menuitem" onClick={() => setOpen(false)}>
            Settings
          </Link>
          <button
            type="button"
            className="user-menu-item w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
