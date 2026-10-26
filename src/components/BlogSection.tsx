import React, { useState, useEffect } from 'react';
import { tone } from '../theme';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import type { BlogBlock, BlogPost } from '../types';
import { BLOG_POSTS } from '../data/siteData';

const renderBlock = (block: BlogBlock, i: number) => {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={i} className="mt-12 font-display text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={i} className="mt-8 font-display text-[19px] font-semibold tracking-[-0.01em] text-brand">
          {block.text}
        </h3>
      );
    case 'p':
      return (
        <p key={i} className="mt-4 text-[17px] leading-[1.8] text-ink/80">
          {block.text}
        </p>
      );
    case 'ul':
      return (
        <ul key={i} className="mt-4 space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[16px] leading-[1.65] text-ink/80">
              <span className="mt-[11px] block h-[2px] w-3 flex-shrink-0 bg-green" />
              {item}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={i} className="mt-6 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
          {block.items.map((item, n) => (
            <li key={item} className="flex items-baseline gap-3 bg-surface px-5 py-4 text-[15px] text-ink">
              <span className="text-[12px] text-accent">{String(n + 1).padStart(2, '0')}</span>
              {item}
            </li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote key={i} className="mt-8 border-l-[3px] border-accent bg-surface px-6 py-5">
          <p className="font-display text-[20px] font-medium leading-[1.45] tracking-[-0.01em] text-ink">“{block.text}”</p>
          {block.cite && <footer className="mt-3 text-[14px] text-muted">— {block.cite}</footer>}
        </blockquote>
      );
  }
};

export const BlogSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (!selectedArticle) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedArticle(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedArticle]);

  return (
    <section className="section bg-white">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
          {BLOG_POSTS.map((post, idx) => (
            <motion.button
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="group flex flex-col text-left"
              onClick={() => setSelectedArticle(post)}
            >
              <div className="aspect-[16/10] overflow-hidden bg-surface">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-7 flex items-center gap-3 text-[11px] uppercase tracking-[0.08em] text-muted">
                <span className={tone(idx).text}>{post.category}</span>
                <span className="h-px w-4 bg-line" />
                <span>{post.date}</span>
                <span className="h-px w-4 bg-line" />
                <span>{post.readTime}</span>
              </div>
              <h3 className="mt-3 font-display text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink transition-colors group-hover:text-brand">
                {post.title}
              </h3>
              <p className="mt-4 text-[16px] leading-[1.7] text-muted">{post.excerpt}</p>
              <span className="mt-7 inline-flex h-11 items-center gap-2.5 self-start rounded-[4px] border-2 border-brand/25 bg-tint px-5 text-[14px] font-semibold text-brand transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                Read article
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {selectedArticle && (
        <div className="modal-backdrop" onClick={() => setSelectedArticle(null)}>
          <article
            className="modal-panel max-w-3xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedArticle.title}
          >
            <div className="max-h-[90vh] overflow-y-auto">
              <div className="relative aspect-[21/9] bg-surface">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="h-full w-full object-cover" />
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center bg-white text-ink transition-colors hover:bg-brand hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
              <div className="px-7 py-10 sm:px-12 sm:py-12">
                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.08em] text-muted">
                  <span className="text-brand">{selectedArticle.category}</span>
                  <span className="h-px w-4 bg-line" />
                  <span>{selectedArticle.date}</span>
                  <span className="h-px w-4 bg-line" />
                  <span>{selectedArticle.readTime}</span>
                </div>
                <h2 className="mt-4 font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[38px]">
                  {selectedArticle.title}
                </h2>
                <div className="mt-6">{selectedArticle.content.map(renderBlock)}</div>
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
};
