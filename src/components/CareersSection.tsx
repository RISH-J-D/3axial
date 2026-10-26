import React, { useState, useEffect } from 'react';
import { tone } from '../theme';
import { motion } from 'framer-motion';
import { ArrowUpRight, X, Upload } from 'lucide-react';
import type { JobOpening } from '../types';
import { JOB_OPENINGS } from '../data/siteData';

interface CareersSectionProps {
  onShowToast: (msg: string) => void;
}

export const CareersSection: React.FC<CareersSectionProps> = ({ onShowToast }) => {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedJob) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedJob(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedJob]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onShowToast(`Application submitted for ${selectedJob?.title}.`);
      setSelectedJob(null);
    }, 1200);
  };

  return (
    <section className="section bg-white">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="eyebrow eyebrow-orange">Open Positions</span>
            <h2 className="h-section mt-5">We’ll be there every step of the way.</h2>
          </div>
          <p className="lead lg:col-span-5 lg:col-start-8 lg:pt-10">
            Build your career with a team shaping steel structures worldwide through Tekla modelling, BIM automation
            and connection engineering.
          </p>
        </div>

        <div className="mt-16 border-t-2 border-brand">
          {JOB_OPENINGS.map((job, idx) => (
            <motion.article
              key={job.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6 border-b border-line py-10 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-4">
                <p className={`inline-flex rounded-[3px] px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] ${tone(idx).soft} ${tone(idx).text}`}>{job.department}</p>
                <h3 className="mt-3 font-display text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink">{job.title}</h3>
                <p className="mt-2 text-[14px] text-muted">{job.location}</p>
              </div>
              <div className="lg:col-span-5">
                <p className="text-[15px] leading-[1.7] text-muted">{job.description}</p>
                <ul className="mt-5 space-y-2">
                  {job.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-3 text-[14px] text-ink">
                      <span className={`mt-[8px] block h-[3px] w-3 flex-shrink-0 ${tone(idx).solid}`} />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-3 lg:text-right">
                <button onClick={() => setSelectedJob(job)} className="btn-outline">
                  Apply
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {selectedJob && (
        <div className="modal-backdrop" onClick={() => setSelectedJob(null)}>
          <div className="modal-panel max-w-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-start justify-between border-b border-line px-8 py-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-muted">Application · {selectedJob.location}</p>
                <h3 className="mt-2 font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">{selectedJob.title}</h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="-mr-2 flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-ink"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="max-h-[70vh] space-y-5 overflow-y-auto px-8 py-7">
              <div>
                <label className="field-label" htmlFor="ap-name">Full name</label>
                <input id="ap-name" type="text" required className="field" />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="ap-email">Email</label>
                  <input id="ap-email" type="email" required className="field" />
                </div>
                <div>
                  <label className="field-label" htmlFor="ap-phone">Phone</label>
                  <input id="ap-phone" type="tel" required className="field" />
                </div>
              </div>
              <div>
                <span className="field-label">Résumé (PDF or DOCX)</span>
                <label className="flex cursor-pointer items-center gap-3 border border-dashed border-line px-4 py-5 text-[14px] text-muted transition-colors hover:border-brand">
                  <Upload className="h-5 w-5 text-brand" strokeWidth={1.5} />
                  Select a file
                  <input type="file" accept=".pdf,.doc,.docx" className="sr-only" />
                </label>
              </div>
              <div>
                <label className="field-label" htmlFor="ap-note">Cover note</label>
                <textarea id="ap-note" rows={3} placeholder="Your Tekla Structures experience" className="field" />
              </div>
              <button type="submit" disabled={submitting} className="btn-green w-full">
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
