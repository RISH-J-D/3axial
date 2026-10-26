import React, { useState, useCallback } from 'react';
import { tone } from '../theme';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../data/siteData';
import { ArticleReader } from './ArticleReader';

export const BlogSection: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const close = useCallback(() => setSelectedIdx(null), []);

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
              onClick={() => setSelectedIdx(idx)}
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

      <AnimatePresence>
        {selectedIdx !== null && (
          <ArticleReader
            key={BLOG_POSTS[selectedIdx].id}
            post={BLOG_POSTS[selectedIdx]}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
