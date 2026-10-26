import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BlogBlock, BlogPost } from '../types';

interface ArticleReaderProps {
  post: BlogPost;
  onClose: () => void;
}

// Page chrome, in px. Body area of a page = height - BODY_TOP - BODY_BOTTOM.
const PAD_X = 56;
const BODY_TOP = 84;
const BODY_BOTTOM = 68;
// Scroll distance per page turn, as a fraction of the viewport height
const TURN_VH = 90;

const renderBlock = (block: BlogBlock, i: number) => {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={i} className="mt-9 font-display text-[23px] font-semibold leading-[1.22] tracking-[-0.02em] text-ink">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={i} className="mt-6 font-display text-[17px] font-semibold tracking-[-0.01em] text-brand">
          {block.text}
        </h3>
      );
    case 'p':
      return (
        <p key={i} className="mt-4 text-[15.5px] leading-[1.75] text-ink/80">
          {block.text}
        </p>
      );
    case 'ul':
      return (
        <ul key={i} className="mt-4 space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px] leading-[1.6] text-ink/80">
              <span className="mt-[10px] block h-[2px] w-3 flex-shrink-0 bg-green" />
              {item}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={i} className="mt-5 grid grid-cols-1 gap-px border border-line bg-line">
          {block.items.map((item, n) => (
            <li key={item} className="flex items-baseline gap-3 bg-white/70 px-4 py-3 text-[14px] text-ink">
              <span className="text-[11px] text-accent">{String(n + 1).padStart(2, '0')}</span>
              {item}
            </li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote key={i} className="mt-7 border-l-[3px] border-accent px-5 py-1">
          <p className="font-display text-[19px] font-medium italic leading-[1.45] tracking-[-0.01em] text-ink">“{block.text}”</p>
          {block.cite && <footer className="mt-2 text-[13px] text-muted">— {block.cite}</footer>}
        </blockquote>
      );
  }
};

interface PageProps {
  side: 'left' | 'right';
  num?: number;
  header?: string;
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ side, num, header, children }) => (
  <div className="relative h-full w-full overflow-hidden bg-[#FBFAF6]">
    {/* Gutter shading towards the spine */}
    <div
      className={`pointer-events-none absolute inset-y-0 w-16 ${
        side === 'left' ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'
      } from-ink/[0.12] via-ink/[0.03] to-transparent`}
    />
    {header && (
      <div
        className={`absolute top-10 truncate text-[10px] uppercase tracking-[0.18em] text-muted/80 ${
          side === 'left' ? 'left-14 right-14 text-left' : 'left-14 right-14 text-right'
        }`}
      >
        {header}
      </div>
    )}
    <div className="absolute [&>*:first-child]:mt-0" style={{ top: BODY_TOP, bottom: BODY_BOTTOM, left: PAD_X, right: PAD_X }}>
      {children}
    </div>
    {num !== undefined && (
      <div
        className={`absolute bottom-8 font-mono text-[11px] text-muted ${side === 'left' ? 'left-14' : 'right-14'}`}
      >
        {String(num).padStart(2, '0')}
      </div>
    )}
  </div>
);

interface LeafProps {
  index: number;
  count: number;
  progress: MotionValue<number>;
  front: React.ReactNode;
  back: React.ReactNode;
}

const Leaf: React.FC<LeafProps> = ({ index, count, progress, front, back }) => {
  const rotateY = useTransform(progress, [index, index + 1], [0, -180], { clamp: true });
  // Slight lift mid-turn so the sheet reads as paper rather than a rigid card
  const z = useTransform(progress, [index, index + 0.5, index + 1], [0, 40, 0], { clamp: true });
  const zIndex = useTransform(progress, (p) =>
    p > index && p < index + 1 ? count * 2 + 1 : p >= index + 1 ? index + 1 : count - index
  );
  const frontShade = useTransform(progress, [index, index + 0.5], [0, 0.45], { clamp: true });
  const backShade = useTransform(progress, [index + 0.5, index + 1], [0.45, 0], { clamp: true });

  return (
    <motion.div
      className="absolute inset-y-0 left-1/2 w-1/2"
      style={{ rotateY, z, zIndex, transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 [backface-visibility:hidden]">
        {front}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-l from-ink/70 via-ink/20 to-transparent"
          style={{ opacity: frontShade }}
        />
      </div>
      <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
        {back}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent"
          style={{ opacity: backShade }}
        />
      </div>
    </motion.div>
  );
};

const useBookSize = () => {
  const get = () => {
    const width = Math.min(1440, window.innerWidth - 64);
    const pageW = Math.floor(width / 2);
    const pageH = Math.floor(Math.min(window.innerHeight - 120, pageW * 1.35));
    return { pageW, pageH, wide: window.innerWidth >= 900 };
  };
  const [size, setSize] = useState(get);
  useEffect(() => {
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => setSize(get()), 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return size;
};

// Greedy pagination over measured block heights; keeps headings with what follows
const paginate = (rects: DOMRect[], avail: number, blocks: BlogBlock[]) => {
  const pages: number[][] = [];
  let start = 0;
  while (start < rects.length) {
    let end = start;
    while (end + 1 < rects.length && rects[end + 1].bottom - rects[start].top <= avail) end++;
    if (end > start && end + 1 < rects.length && (blocks[end].type === 'h2' || blocks[end].type === 'h3')) end--;
    pages.push(Array.from({ length: end - start + 1 }, (_, k) => start + k));
    start = end + 1;
  }
  return pages;
};

export const ArticleReader: React.FC<ArticleReaderProps> = ({ post, onClose }) => {
  const { pageW, pageH, wide } = useBookSize();
  const measureRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number[][] | null>(null);

  useLayoutEffect(() => {
    if (!wide) return;
    let cancelled = false;
    const measure = () => {
      const el = measureRef.current;
      if (!el || cancelled) return;
      const rects = Array.from(el.children).map((c) => c.getBoundingClientRect());
      setPages(paginate(rects, pageH - BODY_TOP - BODY_BOTTOM, post.content));
    };
    measure();
    document.fonts?.ready.then(measure);
    return () => {
      cancelled = true;
    };
  }, [post, pageW, pageH, wide]);

  // Content pages are printed on leaves (front + back); pad to an even count
  const contentPages = pages ?? [];
  const padded = contentPages.length % 2 ? [...contentPages, []] : contentPages;
  const leafCount = Math.max(1, padded.length / 2);

  const { scrollYProgress } = useScroll({ container: scrollRef });
  const rawTurn = useTransform(scrollYProgress, (v) => v * leafCount);
  const turn = useSpring(rawTurn, { stiffness: 120, damping: 24, mass: 0.6 });
  const [spread, setSpread] = useState(0);
  useMotionValueEvent(rawTurn, 'change', (v) => setSpread(Math.round(v)));

  const goTo = useCallback(
    (leaf: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(leafCount, leaf));
      el.scrollTo({ top: (clamped / leafCount) * (el.scrollHeight - el.clientHeight), behavior: 'smooth' });
    },
    [leafCount]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(spread + 1);
      if (e.key === 'ArrowLeft') goTo(spread - 1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, goTo, spread]);

  const pageContent = (idx: number) => padded[idx]?.map((b) => renderBlock(post.content[b], b));
  const leftNum = spread * 2;
  const totalNums = padded.length;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#1B2232]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition-colors hover:border-white hover:bg-white hover:text-ink"
        aria-label="Close article"
      >
        <X className="h-5 w-5" strokeWidth={1.75} />
      </button>

      {!wide ? (
        // Narrow screens: a single readable column instead of the book
        <div className="h-full overflow-y-auto bg-[#FBFAF6]">
          <img src={post.image} alt="" className="aspect-[16/10] w-full object-cover" />
          <div className="px-6 pb-16 pt-8">
            <div className="text-[11px] uppercase tracking-[0.12em] text-muted">
              <span className="font-semibold text-brand">{post.category}</span> · {post.date} · {post.readTime}
            </div>
            <h1 className="mt-3 font-display text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">{post.title}</h1>
            <div className="mt-6 [&>*:first-child]:mt-0">{post.content.map(renderBlock)}</div>
          </div>
        </div>
      ) : (
        <>
          {/* Off-screen measuring column, same width as a page body */}
          <div
            ref={measureRef}
            className="pointer-events-none invisible absolute left-0 top-0 [&>*:first-child]:mt-0"
            style={{ width: pageW - PAD_X * 2 }}
            aria-hidden="true"
          >
            {post.content.map(renderBlock)}
          </div>

          <div ref={scrollRef} className="h-full overflow-y-auto">
            <div style={{ height: `${100 + leafCount * TURN_VH}vh` }}>
              <div className="sticky top-0 flex h-screen flex-col items-center justify-center">
                <motion.div
                  className="relative"
                  style={{ width: pageW * 2, height: pageH, perspective: 2400 }}
                  initial={{ y: 40, opacity: 0, rotateX: 8 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Hardcover board and page-edge stacks */}
                  <div className="absolute -inset-3 rounded-[6px] bg-[#0F1522] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]" />
                  <div className="absolute -bottom-1.5 left-1 right-1 h-2 rounded-b-[2px] bg-[repeating-linear-gradient(to_bottom,#e9e6dc_0,#e9e6dc_1px,#d6d2c4_1px,#d6d2c4_2px)]" />
                  <div className="absolute inset-y-0 left-1/2 z-[1] w-px -translate-x-1/2 bg-ink/25" />

                  {/* Opening page: cover */}
                  <div className="absolute inset-y-0 left-0 w-1/2">
                    <Page side="left">
                      <div className="flex h-full flex-col">
                        <div className="relative -mx-14 -mt-[84px] h-[46%] overflow-hidden">
                          <img src={post.image} alt="" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#FBFAF6] via-transparent to-transparent" />
                        </div>
                        <div className="mt-4 flex items-center gap-3 text-[10.5px] uppercase tracking-[0.14em] text-muted">
                          <span className="font-semibold text-brand">{post.category}</span>
                          <span className="h-px w-4 bg-line" />
                          <span>{post.date}</span>
                          <span className="h-px w-4 bg-line" />
                          <span>{post.readTime}</span>
                        </div>
                        <h1 className="mt-3 font-display text-[clamp(24px,2.4vw,36px)] font-semibold leading-[1.12] tracking-[-0.025em] text-ink">
                          {post.title}
                        </h1>
                        <p className="mt-4 line-clamp-4 text-[15px] leading-[1.7] text-muted">{post.excerpt}</p>
                        <div className="mt-auto flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-muted/80">
                          <span className="h-[2px] w-6 bg-accent" />
                          3Axial Insights
                        </div>
                      </div>
                    </Page>
                  </div>

                  {/* Closing page, revealed once every leaf has turned */}
                  <div className="absolute inset-y-0 right-0 w-1/2">
                    <Page side="right">
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <span className="h-[2px] w-10 bg-accent" />
                        <p className="mt-6 font-display text-[24px] font-semibold tracking-[-0.02em] text-ink">Thanks for reading</p>
                        <p className="mt-3 max-w-[32ch] text-[15px] leading-[1.7] text-muted">
                          More on steel detailing, BIM and fabrication from the 3Axial team.
                        </p>
                        <button onClick={onClose} className="btn-accent btn-sm mt-8">
                          Back to Insights
                        </button>
                      </div>
                    </Page>
                  </div>

                  {pages &&
                    Array.from({ length: leafCount }, (_, k) => (
                      <Leaf
                        key={k}
                        index={k}
                        count={leafCount}
                        progress={turn}
                        front={
                          <Page side="right" num={k * 2 + 1} header={post.category}>
                            {pageContent(k * 2)}
                          </Page>
                        }
                        back={
                          <Page side="left" num={k * 2 + 2} header={post.title}>
                            {pageContent(k * 2 + 1)}
                          </Page>
                        }
                      />
                    ))}
                </motion.div>

                {/* Controls */}
                <div className="mt-8 flex items-center gap-5 text-white/70">
                  <button
                    onClick={() => goTo(spread - 1)}
                    disabled={spread === 0}
                    className="flex h-9 w-9 items-center justify-center border border-white/20 transition-colors hover:border-white hover:text-white disabled:opacity-30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                  <span className="min-w-[150px] text-center font-mono text-[11px] uppercase tracking-[0.16em]">
                    {spread === 0 ? 'Scroll to turn' : `Pages ${leftNum}–${Math.min(leftNum + 1, totalNums)} of ${totalNums}`}
                  </span>
                  <button
                    onClick={() => goTo(spread + 1)}
                    disabled={spread >= leafCount}
                    className="flex h-9 w-9 items-center justify-center border border-white/20 transition-colors hover:border-white hover:text-white disabled:opacity-30"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
