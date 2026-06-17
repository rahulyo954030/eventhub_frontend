import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const steps = [
  {
    num: '01',
    title: 'Set up the event',
    body: 'Name, date, venue, organizer — the basics your team and guests need.',
  },
  {
    num: '02',
    title: 'Add people',
    body: 'Type names in, or drop a CSV. Each guest gets their own invite and QR.',
  },
  {
    num: '03',
    title: 'They confirm online',
    body: 'Guests open the link from email, fill details, and you see who is coming.',
  },
  {
    num: '04',
    title: 'Scan at the door',
    body: 'Staff use the scanner on a phone. Checked in, already in, or invalid — right away.',
  },
];

export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (accessToken) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-surface bg-hero-glow">
      <nav className="home-nav">
        <div className="site-container flex h-14 items-center justify-between gap-2 sm:h-16">
          <Logo href="/" size="sm" showText />
          <div className="flex shrink-0 items-center gap-1 sm:gap-4">
            <a href="#how" className="btn-ghost hidden md:inline-flex">
              How it works
            </a>
            <Link href="/login" className="btn-ghost !px-2 text-xs sm:!px-3 sm:text-sm">
              Sign in
            </Link>
            <Link href="/signup" className="btn-primary !px-3 !py-2 text-xs sm:!px-4 sm:text-sm">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <section className="site-container pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pt-20">
        <div className="max-w-3xl">
          <p className="eyebrow">
            For organizers & event staff
          </p>
          <h1 className="hero-heading mt-4">
            Stop guessing who actually walked in.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:mt-5 sm:text-lg">
            One place to invite people, collect confirmations, scan QR codes at entry,
            and pull attendance reports when the event is over.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link href="/login" className="btn-primary w-full sm:w-auto">
              Open your dashboard
            </Link>
            <Link href="/signup" className="text-sm font-medium text-stone-600 underline-offset-4 hover:text-stone-900 hover:underline">
              New here? Create an account
            </Link>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card sm:mt-14">
          <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
            <span className="ml-2 text-xs text-stone-400">Dashboard preview</span>
          </div>
          <div className="grid grid-cols-2 gap-px bg-stone-100 sm:grid-cols-4">
            {[
              { label: 'Invited', value: '248' },
              { label: 'Registered', value: '186' },
              { label: 'Checked in', value: '142' },
              { label: 'Attendance', value: '76%' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white px-4 py-5">
                <p className="text-xs text-stone-500">{stat.label}</p>
                <p className="mt-1 font-display text-2xl font-semibold tracking-display text-stone-900">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-100 px-4 py-3">
            <div className="flex items-center justify-between border-b border-stone-100 py-2.5 text-xs text-stone-500">
              <span>Guest</span>
              <span>Status</span>
            </div>
            {[
              ['Rahul Singh', 'Checked in'],
              ['Priya Mehta', 'Registered'],
              ['Amit Kumar', 'Invited'],
            ].map(([name, status]) => (
              <div key={name} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-stone-800">{name}</span>
                <span className="text-stone-500">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-stone-200/80 bg-white py-12 sm:py-16">
        <div className="site-container">
          <p className="eyebrow">Workflow</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-display text-ink sm:text-3xl">How your team uses it</h2>
          <p className="mt-2 max-w-lg text-stone-600">
            No training deck needed. Most teams are live within an afternoon.
          </p>
          <ol className="mt-10 space-y-0 divide-y divide-stone-100 border-y border-stone-100">
            {steps.map((step) => (
              <li key={step.num} className="grid gap-3 py-6 sm:grid-cols-[4rem_1fr] sm:gap-4 sm:py-8">
                <span className="font-display text-3xl text-stone-300">{step.num}</span>
                <div>
                  <h3 className="text-lg font-medium text-stone-900">{step.title}</h3>
                  <p className="mt-1 text-stone-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16">
        <div className="site-container">
          <div className="home-cta">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-primary-300">Get started</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-display sm:text-3xl">Ready when your next event is.</h2>
            <p className="mt-3 max-w-md text-stone-300/90">
              Sign up, verify your email, create an event, and send your first invite today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup" className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-soft hover:bg-stone-100">
                Create free account
              </Link>
              <Link href="/login" className="rounded-lg border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/10">
                I already have one
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 py-8">
        <div className="site-container flex flex-col gap-2 text-sm text-stone-500 sm:flex-row sm:justify-between">
          <Logo href="/" size="sm" showText />
          <span>Registration, QR check-in, reports</span>
        </div>
      </footer>
    </main>
  );
}
