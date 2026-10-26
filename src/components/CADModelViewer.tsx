import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, ShieldCheck, Box, Activity, Layers } from 'lucide-react';

export const CADModelViewer: React.FC = () => {
  const [rotation, setRotation] = useState(15);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [activeView, setActiveView] = useState<'iso' | 'top' | 'front'>('iso');
  const [wireframeMode, setWireframeMode] = useState(false);
  const [showNodes] = useState(true);
  const [showLabels] = useState(true);
  const [selectedMember, setSelectedMember] = useState<string | null>('W14x90 Column - Axis A1');

  const memberDetails: Record<string, { type: string; steel: string; connection: string; code: string; weight: string }> = {
    'W14x90 Column - Axis A1': {
      type: 'Structural Column (Heavy Section)',
      steel: 'ASTM A992 Grade 50 Steel',
      connection: 'Full Penetration Weld Base Plate w/ 4x Anchor Bolts',
      code: 'AISC 360-16 / ADSC Stamped',
      weight: '90 lbs/ft (133.9 kg/m)'
    },
    'W24x68 Main Girder': {
      type: 'Primary Structural Beam',
      steel: 'ASTM A992 Grade 50 Steel',
      connection: '8-Bolt Double Angle Shear Connection',
      code: 'AISC 360-16 / CISC S16',
      weight: '68 lbs/ft (101.2 kg/m)'
    },
    'HSS 8x8x3/8 Bracing': {
      type: 'Seismic Vertical Bracing',
      steel: 'ASTM A500 Grade B HSS',
      connection: 'Gusset Plate Weld w/ High Strength A325 Bolts',
      code: 'AISC 341-16 Seismic Protocol',
      weight: '38.4 lbs/ft (57.1 kg/m)'
    }
  };

  return (
    <section className="bg-slate-50/60 py-20 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold bg-[#1A73E8]/10 border border-[#1A73E8]/30 text-[#1A73E8] mb-3">
            <Activity className="w-3.5 h-3.5 text-[#E66A00]" />
            <span>Interactive Tekla CAD Simulator</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Reactive 3D <span className="text-[#1A73E8]">Tekla BIM CAD</span> Model Viewer
          </h2>
          <p className="text-slate-600 mt-3 text-base leading-relaxed">
            Test our precision structural modeling interface. Rotate 3D steel frames, inspect member properties, and verify zero-clash connection node detailing.
          </p>
        </div>

        {/* Double-Bezel Concentric Architecture Container */}
        <div className="p-2.5 sm:p-3.5 rounded-[2.5rem] bg-slate-900/5 border border-slate-200/90 ring-1 ring-slate-900/5 shadow-2xl">
          
          <div className="bg-white rounded-[calc(2.5rem-0.875rem)] border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-3 shadow-inner">
            
            {/* Main Visual Canvas Area */}
            <div className="lg:col-span-2 bg-[#F0F4F9] relative min-h-[460px] p-6 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200">
              
              {/* Blueprint Grid Background Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-70 pointer-events-none" />

              {/* Top Workstation Controls Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 text-xs shadow-sm">
                  <button
                    onClick={() => setActiveView('iso')}
                    className={`px-3.5 py-1.5 rounded-xl font-heading font-extrabold text-xs transition-all ${
                      activeView === 'iso' ? 'bg-[#1A73E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#1A73E8]'
                    }`}
                  >
                    3D Isometric
                  </button>
                  <button
                    onClick={() => setActiveView('top')}
                    className={`px-3.5 py-1.5 rounded-xl font-heading font-extrabold text-xs transition-all ${
                      activeView === 'top' ? 'bg-[#1A73E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#1A73E8]'
                    }`}
                  >
                    Plan (Top)
                  </button>
                  <button
                    onClick={() => setActiveView('front')}
                    className={`px-3.5 py-1.5 rounded-xl font-heading font-extrabold text-xs transition-all ${
                      activeView === 'front' ? 'bg-[#1A73E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#1A73E8]'
                    }`}
                  >
                    Elevation (Front)
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWireframeMode(!wireframeMode)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-heading font-extrabold flex items-center gap-1.5 transition-all shadow-xs ${
                      wireframeMode ? 'bg-[#1A73E8] text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{wireframeMode ? 'Wireframe Mesh' : 'Solid Render'}</span>
                  </button>

                  <button
                    onClick={() => setIsAutoRotate(!isAutoRotate)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-heading font-extrabold flex items-center gap-1.5 transition-all shadow-xs ${
                      isAutoRotate ? 'bg-[#2E8540] text-white border-green-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
                    <span>{isAutoRotate ? 'Auto Rotate' : 'Rotate Paused'}</span>
                  </button>
                </div>
              </div>

              {/* Simulated 3D Steel Frame Canvas */}
              <div className="relative w-full h-80 flex items-center justify-center my-4 cursor-grab active:cursor-grabbing">
                <motion.div
                  animate={isAutoRotate ? { rotateY: [0, 360] } : { rotateY: rotation }}
                  transition={isAutoRotate ? { repeat: Infinity, duration: 18, ease: 'linear' } : { duration: 0.5 }}
                  className="relative w-72 h-72 flex items-center justify-center"
                  style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                  onClick={() => setRotation(r => r + 45)}
                >
                  {/* Steel Structure Wireframe SVG Canvas */}
                  <svg viewBox="0 0 200 200" className="w-full h-full text-[#1A73E8] filter drop-shadow-md">
                    {/* Grid Axis Lines */}
                    <line x1="10" y1="180" x2="190" y2="180" stroke="#2E8540" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                    <line x1="20" y1="20" x2="20" y2="180" stroke="#2E8540" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                    <line x1="180" y1="20" x2="180" y2="180" stroke="#2E8540" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

                    {/* Columns (Steel Blue) */}
                    <line x1="30" y1="30" x2="30" y2="170" stroke="#1A73E8" strokeWidth={wireframeMode ? 2 : 7} strokeLinecap="round" />
                    <line x1="170" y1="30" x2="170" y2="170" stroke="#1A73E8" strokeWidth={wireframeMode ? 2 : 7} strokeLinecap="round" />
                    <line x1="100" y1="50" x2="100" y2="170" stroke="#1A73E8" strokeWidth={wireframeMode ? 2 : 6} strokeLinecap="round" />

                    {/* Girders / Beams (Industrial Orange) */}
                    <line x1="30" y1="30" x2="170" y2="30" stroke="#E66A00" strokeWidth={wireframeMode ? 2 : 6} />
                    <line x1="30" y1="100" x2="170" y2="100" stroke="#E66A00" strokeWidth={wireframeMode ? 2 : 6} />
                    <line x1="30" y1="170" x2="170" y2="170" stroke="#E66A00" strokeWidth={wireframeMode ? 2 : 6} />

                    {/* Diagonal Bracing (Axis Green) */}
                    <line x1="30" y1="100" x2="100" y2="170" stroke="#2E8540" strokeWidth="3" strokeDasharray="6 3" />
                    <line x1="100" y1="100" x2="170" y2="170" stroke="#2E8540" strokeWidth="3" strokeDasharray="6 3" />

                    {/* Connection Nodes */}
                    {showNodes && (
                      <>
                        <circle cx="30" cy="30" r="5" fill="#2E8540" />
                        <circle cx="170" cy="30" r="5" fill="#2E8540" />
                        <circle cx="30" cy="100" r="5" fill="#2E8540" />
                        <circle cx="170" cy="100" r="5" fill="#2E8540" />
                        <circle cx="100" cy="100" r="6" fill="#E66A00" className="animate-ping opacity-75" />
                        <circle cx="100" cy="100" r="5" fill="#E66A00" />
                      </>
                    )}

                    {/* Member Labels */}
                    {showLabels && (
                      <>
                        <text x="35" y="65" fill="#1A73E8" fontSize="8" fontWeight="bold" fontFamily="Space Grotesk">Column W14x90</text>
                        <text x="70" y="25" fill="#E66A00" fontSize="8" fontWeight="bold" fontFamily="Space Grotesk">Girder W24x68</text>
                        <text x="50" y="145" fill="#2E8540" fontSize="8" fontWeight="bold" fontFamily="Space Grotesk">Brace HSS8x8</text>
                      </>
                    )}
                  </svg>
                </motion.div>
              </div>

              {/* Bottom Status Readout Bar */}
              <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-200 pt-3.5 relative z-10">
                <span className="flex items-center gap-2 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E8540] animate-pulse" />
                  <span>Tekla Structures 2025 Engine • Live Sync</span>
                </span>
                <span className="bg-white/80 px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 font-extrabold">
                  XYZ: [142.5, 88.0, 340.0]
                </span>
              </div>
            </div>

            {/* Member Inspection Side Panel */}
            <div className="p-6 bg-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                    <Box className="w-5 h-5 text-[#1A73E8]" />
                    <span>Member Inspector</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-[#2E8540] border border-green-200">
                    AISC Verified
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
                  Select a structural member to inspect shop detailing parameters and AISC connection compliance:
                </p>

                {/* Member Selector Buttons */}
                <div className="space-y-2 mb-6">
                  {Object.keys(memberDetails).map((name) => (
                    <button
                      key={name}
                      onClick={() => setSelectedMember(name)}
                      className={`w-full text-left p-3.5 rounded-xl text-xs font-heading font-extrabold border transition-all ${
                        selectedMember === name
                          ? 'bg-blue-50/80 border-[#1A73E8] text-[#1A73E8] shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>

                {/* Selected Member Details */}
                {selectedMember && memberDetails[selectedMember] && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Member Type</span>
                      <span className="text-sm font-heading font-extrabold text-slate-900">{memberDetails[selectedMember].type}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Steel Specification</span>
                      <span className="text-xs font-semibold text-[#1A73E8]">{memberDetails[selectedMember].steel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Linear Mass</span>
                      <span className="text-xs font-bold text-slate-700">{memberDetails[selectedMember].weight}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Connection Detail</span>
                      <span className="text-xs font-semibold text-[#E66A00]">{memberDetails[selectedMember].connection}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-heading font-extrabold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2E8540]" />
                  <span>Zero Clash Tolerance</span>
                </span>
                <span className="text-[#1A73E8] ">Imperial & Metric</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

