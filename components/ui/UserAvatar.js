'use client';

import { useState } from 'react';
import Link from 'next/link';

const sizes = {
  sm: 32,
  md: 36,
  lg: 44,
  xl: 80,
};

function getAvatarSrc(user) {
  if (user?.avatar?.trim()) {
    return user.avatar.trim();
  }
  const name = user?.name || user?.email || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=ffffff&size=128&bold=true&format=png`;
}

export default function UserAvatar({ user, size = 'md', className = '', href }) {
  const [failed, setFailed] = useState(false);
  const px = sizes[size] || sizes.md;
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  const fallback = (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-800 ring-2 ring-stone-100 ${className}`}
      style={{ width: px, height: px }}
    >
      {initial}
    </div>
  );

  const image = failed ? (
    fallback
  ) : (
    <img
      src={getAvatarSrc(user)}
      alt={user?.name ? `${user.name}'s profile` : 'Profile'}
      width={px}
      height={px}
      className={`shrink-0 rounded-full object-cover ring-2 ring-stone-100 ${className}`}
      style={{ width: px, height: px }}
      onError={() => setFailed(true)}
      referrerPolicy="no-referrer"
    />
  );

  if (href) {
    return (
      <Link href={href} className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2">
        {image}
      </Link>
    );
  }

  return image;
}
