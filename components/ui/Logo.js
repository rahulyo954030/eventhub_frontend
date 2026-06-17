import Image from 'next/image';
import Link from 'next/link';

const heights = {
  sm: 28,
  md: 34,
  lg: 40,
};

export default function Logo({
  href,
  size = 'md',
  variant = 'light',
  className = '',
  showText = false,
}) {
  const height = heights[size] || heights.md;

  const image = (
    <Image
      src="/eventhub.png"
      alt="EventHub"
      width={height}
      height={height}
      className={`w-auto object-contain ${variant === 'dark' ? 'brightness-0 invert' : ''}`}
      style={{ height }}
      priority={size === 'lg'}
    />
  );

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {image}
      {showText && (
        <span className={`hidden sm:inline ${variant === 'dark' ? 'font-display text-[18px] font-semibold tracking-display text-white' : 'brand-mark'}`}>
          EventHub
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {content}
      </Link>
    );
  }

  return content;
}
