import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface EnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const EnquireModal: React.FC<EnquireModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onShowToast('Request received. Our engineering team will review your specifications and respond shortly.');
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel max-w-lg" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="enquire-title">
        <div className="logo-stripe h-1" />
        <div className="flex items-start justify-between border-b border-line px-8 py-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-muted">AISC / CISC steel bids</p>
            <h3 id="enquire-title" className="mt-2 font-display text-[24px] font-semibold tracking-[-0.02em] text-ink">
              Request a quote
            </h3>
          </div>
          <button
            onClick={onClose}
            className="-mr-2 flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-ink"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75vh] space-y-5 overflow-y-auto px-8 py-7">
          <div>
            <label className="field-label" htmlFor="eq-name">Full name</label>
            <input id="eq-name" type="text" required className="field" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="eq-email">Work email</label>
              <input id="eq-email" type="email" required className="field" />
            </div>
            <div>
              <label className="field-label" htmlFor="eq-phone">Phone</label>
              <input id="eq-phone" type="tel" required className="field" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="eq-service">Service required</label>
            <select id="eq-service" className="field">
              <option>Pre-bid Estimations & ABM</option>
              <option>Structural Steel Detailing</option>
              <option>Miscellaneous Steel Detailing</option>
              <option>Connection Design & Stamping</option>
              <option>Joist & Deck Layouts</option>
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="eq-msg">Project details</label>
            <textarea id="eq-msg" rows={4} placeholder="Tonnage, timeline and location" className="field" />
          </div>
          <button type="submit" disabled={submitting} className="btn-green w-full">
            {submitting ? 'Sending…' : 'Submit Enquiry'}
            {!submitting && <ArrowRight className="h-4 w-4" strokeWidth={1.75} />}
          </button>
        </form>
      </div>
    </div>
  );
};
