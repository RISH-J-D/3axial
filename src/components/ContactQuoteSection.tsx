import React, { useState } from 'react';
import { Download, ArrowRight, Upload } from 'lucide-react';

interface ContactQuoteSectionProps {
  onShowToast: (msg: string) => void;
}

export const ContactQuoteSection: React.FC<ContactQuoteSectionProps> = ({ onShowToast }) => {
  const [tonnage, setTonnage] = useState<number>(250);
  const [serviceType, setServiceType] = useState<string>('Structural Steel Detailing');
  const [designStandard, setDesignStandard] = useState<string>('AISC 360-16 (Imperial)');
  const [submitting, setSubmitting] = useState(false);

  const estimatedHours = Math.round(tonnage * 2.8);
  const estimatedCost = Math.round(tonnage * 18.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onShowToast('Enquiry received. Our engineering team will review your specifications and respond shortly.');
    }, 1200);
  };

  return (
    <section className="section bg-white">
      <div className="container-x grid grid-cols-1 gap-16 lg:grid-cols-12">
        {/* Contact details */}
        <aside className="lg:col-span-4">
          <span className="eyebrow eyebrow-orange">Reach Us</span>
          <h2 className="mt-5 font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] text-ink">
            Here’s how you can reach us.
          </h2>
          <p className="lead mt-5">
            We believe that a competitive quote makes our clients competitive too.
          </p>

          <dl className="mt-10 divide-y divide-line border-y border-line">
            <div className="py-6">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Registered Office</dt>
              <dd className="mt-3 text-[15px] leading-relaxed text-ink">
                3 Axial Steel Detailing Pvt. Ltd.
                <br />
                17B, 3rd Floor, Tech Mahindra Road
                <br />
                Opp. Tata Power Gate No. 01, Electronic City Phase 2
                <br />
                Bengaluru, Karnataka 560100
              </dd>
            </div>
            <div className="py-6">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Phone</dt>
              <dd className="mt-3">
                <a href="tel:+16506956923" className="text-[17px] font-medium text-ink transition-colors hover:text-brand">
                  +1 650 695 6923
                </a>
                <p className="mt-1 text-[13px] text-muted">Available across US, Canadian and global time zones</p>
              </dd>
            </div>
            <div className="py-6">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Email</dt>
              <dd className="mt-3">
                <a href="mailto:info@3axialsteeldetail.com" className="text-[17px] font-medium text-ink transition-colors hover:text-brand">
                  info@3axialsteeldetail.com
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-10 border-l-4 border-green bg-green-tint p-7">
            <h4 className="font-display text-[18px] font-semibold text-ink">Capability brochure</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              Our capabilities, Tekla environment set-up and sample drawing sheets. PDF, 5.2 MB.
            </p>
            <button
              onClick={() => onShowToast('Brochure download started (3Axial-Corporate-Deck.pdf)')}
              className="btn-outline-green btn-sm mt-5"
            >
              <Download className="h-4 w-4" strokeWidth={1.75} />
              Download PDF
            </button>
          </div>
        </aside>

        {/* Quote form */}
        <div className="border-t-2 border-brand pt-10 lg:col-span-8 lg:col-start-5 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
          <h3 className="font-display text-[26px] font-semibold tracking-[-0.02em] text-ink">Request a quote</h3>
          <p className="mt-2 text-[15px] text-muted">Use the estimator for an indicative figure, then send us your project details.</p>

          {/* Estimator */}
          <div className="mt-10 border border-line p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="tonnage" className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                Estimated steel tonnage
              </label>
              <span className="font-display text-[22px] font-semibold tabular-nums text-ink">{tonnage.toLocaleString()} t</span>
            </div>
            <input
              id="tonnage"
              type="range"
              min="20"
              max="5000"
              step="10"
              value={tonnage}
              onChange={(e) => setTonnage(Number(e.target.value))}
              className="mt-5 h-1 w-full cursor-pointer appearance-none bg-line accent-brand"
            />
            <div className="mt-8 grid grid-cols-2 gap-px bg-line">
              <div className="bg-white pr-4">
                <p className="text-[13px] text-muted">Indicative detailing hours</p>
                <p className="mt-1 font-display text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-accent-dark">
                  {estimatedHours.toLocaleString()}
                </p>
              </div>
              <div className="bg-white pl-6">
                <p className="text-[13px] text-muted">Indicative budget (USD)</p>
                <p className="mt-1 font-display text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-green-dark">
                  ${estimatedCost.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="mt-5 text-[12px] text-muted">Indicative only. Final pricing depends on scope, complexity and schedule.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="q-name">Full name</label>
              <input id="q-name" type="text" required className="field" />
            </div>
            <div>
              <label className="field-label" htmlFor="q-email">Work email</label>
              <input id="q-email" type="email" required className="field" />
            </div>
            <div>
              <label className="field-label" htmlFor="q-phone">Phone</label>
              <input id="q-phone" type="tel" required className="field" />
            </div>
            <div>
              <label className="field-label" htmlFor="q-service">Service required</label>
              <select id="q-service" value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="field">
                <option>Pre-bid Estimations & ABM</option>
                <option>Structural Steel Detailing</option>
                <option>Miscellaneous Steel Detailing</option>
                <option>Connection Design & Stamping</option>
                <option>Joist & Deck Layouts</option>
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="q-code">Design standard</label>
              <select id="q-code" value={designStandard} onChange={(e) => setDesignStandard(e.target.value)} className="field">
                <option>AISC 360-16 (Imperial)</option>
                <option>CSA S16 (Canadian Metric)</option>
                <option>BS EN 1993 (Eurocode)</option>
                <option>AS 4100 (Australian)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <span className="field-label">Project drawings / specifications (IFC, PDF, DWG)</span>
              <label className="flex cursor-pointer items-center gap-3 border border-dashed border-line px-4 py-5 text-[14px] text-muted transition-colors hover:border-brand">
                <Upload className="h-5 w-5 text-brand" strokeWidth={1.5} />
                Drag and drop files, or click to browse
                <input type="file" multiple accept=".pdf,.dwg,.ifc" className="sr-only" />
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="q-msg">Notes</label>
              <textarea
                id="q-msg"
                rows={4}
                placeholder="Specifications, erection timeline or specific connection requirements"
                className="field"
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={submitting} className="btn-green">
                {submitting ? 'Sending…' : 'Submit Request'}
                {!submitting && <ArrowRight className="h-4 w-4" strokeWidth={1.75} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
