import React from 'react';
import { Zap, Shield, GitFork, Wrench } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

export function PhilosophySection() {
  const pillars = [
    {
      title: 'Performance',
      metric: 'Sub-100ms P95',
      icon: <Zap className="w-5 h-5 text-[#C9A769]" />,
      description:
        'Fast software converts better. Every database query, network payload, and DOM paint is systematically measured and optimized for near-instant responsiveness.',
      points: ['Aggressive query indexing', 'Lightweight client bundles', 'Optimistic UI mutations', 'Zero layout shifts (CLS < 0.05)'],
    },
    {
      title: 'Security',
      metric: 'Defense-in-Depth',
      icon: <Shield className="w-5 h-5 text-[#C9A769]" />,
      description:
        'Zero-trust mindset across client boundaries. Every public mutation is strictly validated via runtime schemas, rate-limited, and authenticated with hardened tokens.',
      points: ['Zod runtime contract enforcement', 'Rate limiting & brute-force mitigation', 'Sanitized database queries', 'HttpOnly token flows'],
    },
    {
      title: 'Scalability',
      metric: 'Horizontal Elasticity',
      icon: <GitFork className="w-5 h-5 text-[#C9A769]" />,
      description:
        'Decoupled service boundaries and stateless architectures ensure that increasing user concurrency never degrades system availability or transaction reliability.',
      points: ['Stateless API gateway design', 'Asynchronous background queues', 'Optimistic database concurrency locks', 'Sharded document modeling'],
    },
    {
      title: 'Maintainability',
      metric: '100% Strict Typing',
      icon: <Wrench className="w-5 h-5 text-[#C9A769]" />,
      description:
        'Code written today should be painless for your team to modify two years from now. Strict TypeScript guarantees, self-documenting APIs, and modular design patterns.',
      points: ['Clean domain service isolation', 'Zero hidden side-effects', 'Exhaustive error boundaries', 'Automated regression test coverage'],
    },
  ];

  return (
    <section id="philosophy" className="py-20 sm:py-28 bg-[#070707] border-t border-[#1C1C1C]">
      <Container>
        <SectionHeading
          eyebrow="ENGINEERING PHILOSOPHY"
          title="I DON'T JUST WRITE CODE. I ENGINEER SYSTEMS."
          description="A beautiful interface without resilient engineering is a liability. Every architectural decision is guided by four non-negotiable principles."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-8 bg-[#0C0C0C] border border-[#222222] hover:border-[#383838] transition-colors rounded-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1A1A1A]">
                  <div className="p-3 bg-[#141414] border border-[#262626] rounded-sm">
                    {pillar.icon}
                  </div>
                  <span className="font-mono text-xs text-[#C9A769] uppercase tracking-wider bg-[#141414] px-2.5 py-1 border border-[#282828] rounded-sm">
                    {pillar.metric}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] tracking-tight mb-3">
                  {pillar.title}
                </h3>

                <p className="text-sm text-[#969691] leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#181818]">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#ABABAB]">
                  {pillar.points.map((pt, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#C9A769]" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
