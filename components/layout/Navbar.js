'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import UserMenu from '@/components/ui/UserMenu';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/reports': 'Reports',
  '/scanner': 'QR Scanner',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/attendees': 'Attendees',
};

const pageDescriptions = {
  '/dashboard': 'Overview of your events and attendance',
  '/events': 'Create and manage events',
  '/reports': 'Export registration and check-in data',
  '/scanner': 'Scan guest QR codes at the door',
  '/profile': 'Your account details',
  '/settings': 'Password and workspace access',
  '/attendees': 'Guest lists across events',
};

function getPageMeta(pathname) {
  if (pageTitles[pathname]) {
    return { title: pageTitles[pathname], description: pageDescriptions[pathname] };
  }
  if (pathname.startsWith('/events/')) {
    return { title: 'Event details', description: 'Guests, invites, and attendance' };
  }
  if (pathname.startsWith('/attendees/')) {
    return { title: 'Attendees', description: 'Add or import guests' };
  }
  return { title: 'EventHub', description: null };
}

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { title, description } = getPageMeta(pathname);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out');
      router.push('/login');
    } catch {
      toast.error('Could not sign out');
    }
  };

  return (
    <header className="app-navbar">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 lg:hidden"
          aria-label="Open menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          <p className="app-nav-title">{title}</p>
          {description && (
            <p className="hidden truncate text-xs text-stone-500 sm:block">{description}</p>
          )}
        </div>
      </div>

      <UserMenu user={user} onLogout={handleLogout} />
    </header>
  );
}
