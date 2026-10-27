import React from 'react';
import { tone } from '../theme';
import { motion } from 'framer-motion';
import { CountUp } from './CountUp';

const STATS = [
  { number: '25+', label: 'Years experience', desc: 'Combined leadership expertise in AISC/CISC structural detailing' },
  { number: '800+', label: 'Successful projects', desc: 'Commercial towers, industrial plants and stadium framing' },
  { number: '15+', label: 'Countries served', desc: 'USA, Canada, Australia, Europe and Asia Pacific' },
  { number: '100+', label: 'Clients', desc: 'Long-term fabricator and contractor partnerships' }
];

export const StatsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.06 }}
          viewport={{ once: true }}
          className={`border-line py-8 sm:pr-6 ${index > 0 ? 'border-t sm:border-t-0' : ''} ${
            index % 2 === 1 ? 'sm:border-l sm:pl-6' : ''
          } ${index > 0 ? 'lg:border-l lg:pl-8' : ''} ${index >= 2 ? 'sm:border-t lg:border-t-0' : ''}`}
        >
          <div className={`font-display text-[52px] font-semibold leading-none tracking-[-0.03em] ${tone(index).text}`}>
            <CountUp value={item.number} />
          </div>
          <div className={`mt-4 h-[3px] w-10 ${tone(index).solid}`} />
          <h3 className="mt-4 text-[15px] font-medium text-ink">{item.label}</h3>
          <p className="mt-1 text-[14px] leading-relaxed text-muted">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};
