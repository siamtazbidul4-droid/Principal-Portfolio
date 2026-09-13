import React from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

export function ProcessSection() {
  const steps = [
    {
      number: '01',
      phase: 'DISCOVER',
      headline: 'Deep Domain & Business Modeling',
      description:
        'Before writing a line of code, we clarify the product core: Who uses it? What are the throughput limits? What business metric drives success? We map data flows and eliminate ambiguity early.',
      deliverables: ['Technical specification document', 'System boundary definition', 'Risk & compliance audit'],
    },
    {
      number: '02',
      phase: 'ARCHITECT',
      headline: 'Data Schemas & API Contracts',
      description:
        'We establish the foundational architecture: MongoDB collections with compound indexes, Express endpoint routing, state trees, caching strategies, and defensive Zod validation layers.',
      deliverables: ['Mongoose database schemas', 'RESTful OpenAPI contracts', 'Infrastructure diagram'],
    },
    {
      number: '03',
      phase: 'DESIGN',
      headline: 'Refined Editorial UI/UX',
      description:
        'We craft an interface with mathematical visual rhythm, intentional typography, clear affordances, and responsive ergonomics across desktop, tablet, and mobile displays.',
      deliverables: ['Figma interactive prototype', 'Design token system', 'Accessible component hierarchy'],
    },
    {
      number: '04',
      phase: 'ENGINEER',
      headline: 'Full-Stack Production Development',
      description:
        'Building the platform with clean React 19, TypeScript, Express, and MongoDB. Every module is modular, testable, and strictly typed with zero unhandled error states.',
      deliverables: ['Complete full-stack repository', 'Continuous integration setup', 'End-to-end unit tests'],
    },
    {
      number: '05',
      phase: 'LAUNCH',
      headline: 'Hardening & Global Deployment',
      description:
        'Comprehensive security review, query plan optimization, asset minification, transactional email verification, and production container deployment with real-time telemetry.',
      deliverables: ['Production Cloud Run / Atlas rollout', 'SSL & security headers verification', 'Handoff documentation'],
    },
  ];

  return (
    <section id="process" className="py-20 sm:py-28 bg-[#0A0A0A] border-t border-[#1C1C1C]">
      <Container>
        <SectionHeading
          eyebrow="METHODICAL EXECUTION"
          title="HOW I WORK"
          description="A systematic, five-stage engineering process designed to eliminate guesswork and deliver mission-critical software predictably."
        />

        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-8 sm:p-10 bg-[#0D0D0D] border border-[#222222] hover:border-[#383838] transition-colors rounded-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Step indicator */}
              <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-start justify-between border-b lg:border-b-0 lg:border-r border-[#1E1E1E] pb-4 lg:pb-0 lg:pr-6">
                <span className="text-4xl sm:text-5xl font-extrabold font-['Space_Grotesk',sans-serif] text-[#C9A769]">
                  {step.number}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#969691] mt-2">
                  {step.phase}
                </span>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-6">
                <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] mb-3">
                  {step.headline}
                </h3>
                <p className="text-sm sm:text-base text-[#969691] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Deliverables Column */}
              <div className="lg:col-span-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#1E1E1E] lg:pl-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#666662] mb-3">
                  Phase Outputs
                </h4>
                <ul className="space-y-2">
                  {step.deliverables.map((item, i) => (
                    <li key={i} className="text-xs text-[#B5B5B0] font-mono flex items-start gap-2">
                      <span className="text-[#C9A769]">↳</span>
                      <span>{item}</span>
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
