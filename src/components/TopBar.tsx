import React, { useState, useEffect } from 'react';
import { Phone, Mail } from 'lucide-react';

const ZONES = [
  { label: 'IST', tz: 'Asia/Kolkata' },
  { label: 'EST', tz: 'America/New_York' },
  { label: 'CST', tz: 'America/Chicago' },
  { label: 'PST', tz: 'America/Los_Angeles' },
  { label: 'GMT', tz: 'Europe/London' }
];

export const TopBar: React.FC = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const format = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now);
    } catch {
      return now.toLocaleTimeString();
    }
  };

  return (
    <div className="w-full border-b border-line bg-surface text-muted text-[12px]">
      <div className="logo-stripe h-[3px]" />
      <div className="container-x flex h-10 items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <a href="tel:+16506956923" className="flex items-center gap-2 transition-colors hover:text-brand">
            <Phone className="h-3.5 w-3.5 text-accent-dark" strokeWidth={1.75} />
            <span>+1 650 695 6923</span>
          </a>
          <a href="mailto:info@3axialsteeldetail.com" className="hidden items-center gap-2 transition-colors hover:text-brand sm:flex">
            <Mail className="h-3.5 w-3.5 text-green-dark" strokeWidth={1.75} />
            <span>info@3axialsteeldetail.com</span>
          </a>
        </div>

        <div className="hidden items-center gap-5 font-mono text-[11px] tracking-[0.04em] lg:flex">
          {ZONES.map((z) => (
            <span key={z.label} className="flex items-center gap-1.5">
              <span className="text-muted/70">{z.label}</span>
              <span className="text-ink">{format(z.tz)}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
