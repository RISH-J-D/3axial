// Rotating logo colours (blue, orange, green) used to balance accents across the site.
// Full class strings are listed so Tailwind can detect them.
export const TONES = [
  { text: 'text-brand', solid: 'bg-logo', soft: 'bg-tint', border: 'border-logo', hoverBg: 'hover:bg-tint' },
  { text: 'text-accent-dark', solid: 'bg-accent', soft: 'bg-accent-tint', border: 'border-accent', hoverBg: 'hover:bg-accent-tint' },
  { text: 'text-green-dark', solid: 'bg-green', soft: 'bg-green-tint', border: 'border-green', hoverBg: 'hover:bg-green-tint' }
] as const;

export const tone = (i: number) => TONES[i % TONES.length];
