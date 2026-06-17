'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/ui/Logo';
import UserAvatar from '@/components/ui/UserAvatar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Events', href: '/events' },
  { name: 'Reports', href: '/reports', adminOnly: true },
  { name: 'Scanner', href: '/scanner' },
  { name: 'Profile', href: '/profile' },
  { name: 'Settings', href: '/settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { isAdmin, user } = useAuth();

  const filteredNav = navigation.filter((item) => !item.adminOnly || isAdmin);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-[2px] lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`app-sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="border-b border-white/10 px-4 py-5">
          <Link href="/dashboard" onClick={onClose} className="block">
            <Logo size="md" variant="dark" showText />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-white/5"
          >
            <UserAvatar user={user} size="sm" className="!ring-stone-700" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-stone-200">{user?.name}</p>
              <p className="truncate text-xs text-stone-500">{user?.role}</p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
