import React from 'react';
import { motion } from 'framer-motion';
import { TEAM_MEMBERS } from '../data/siteData';

export const TeamSection: React.FC = () => {
  return (
    <section className="section bg-white">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="eyebrow">Leadership</span>
          <h2 className="h-section mt-5">The people driving our work.</h2>
          <p className="lead mt-5">
            Our leadership combines decades of shop-floor fabrication experience with advanced 3D Tekla engineering.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.figure
              key={member.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (idx % 4) * 0.06 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="aspect-[4/5] overflow-hidden bg-surface">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover grayscale-[35%] transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </div>
              <figcaption className="mt-5 border-t border-line pt-4">
                <h3 className="font-display text-[18px] font-semibold tracking-[-0.015em] text-ink">{member.name}</h3>
                <p className="mt-1 text-[14px] text-muted">{member.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};
