import React from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

export function TechStackSection() {
  const stackCategories = [
    {
      category: 'Frontend Engineering',
      description: 'Building dense, responsive, high-throughput interfaces that never drop frames.',
      items: [
        { name: 'React 19 & TypeScript', detail: 'Modern functional architecture, custom hooks, strictly typed components' },
        { name: 'Tailwind CSS', detail: 'Mathematical spacing tokens, responsive layouts, zero runtime CSS overhead' },
        { name: 'React Router 7', detail: 'Client-side route guards, code-splitting, optimistic navigation' },
        { name: 'State Management', detail: 'Context, Redux Toolkit, and local stores adapted to application complexity' },
      ],
    },
    {
      category: 'Backend & APIs',
      description: 'Secure, high-concurrency microservices, RESTful endpoints, and event gateways.',
      items: [
        { name: 'Node.js & Express', detail: 'Idempotent routing, custom middleware stacks, process clustering' },
        { name: 'Zod Validation', detail: 'Strict runtime boundary enforcement, defense against malformed inputs' },
        { name: 'JWT & Bcrypt', detail: 'Cryptographic password hashing, stateless tokens, role-based authorization' },
        { name: 'Resend HTTPS API', detail: 'Transactional email dispatch, zero-SMTP delivery pipelines' },
      ],
    },
    {
      category: 'Databases & Storage',
      description: 'Data models designed for durability, low latency, and atomic integrity.',
      items: [
        { name: 'MongoDB & Mongoose', detail: 'Schema design, compound indexes, aggregation pipelines, validation' },
        { name: 'PostgreSQL', detail: 'Relational data modeling, ACID transactions, complex foreign key constraints' },
        { name: 'Redis Cache', detail: 'In-memory key-value caching, rate limiting stores, distributed locks' },
        { name: 'Data Migration', detail: 'Zero-downtime schema evolution, automated seed fixtures' },
      ],
    },
    {
      category: 'DevOps & Quality',
      description: 'Continuous integration, containerized packaging, and automated testing.',
      items: [
        { name: 'Docker Containers', detail: 'Multi-stage production Dockerfiles, minimal base images, Cloud Run ready' },
        { name: 'Security Hardening', detail: 'OWASP mitigation, CORS controls, rate limiters, strict HTTP headers' },
        { name: 'Performance Profiling', detail: 'Lighthouse audits, database query plan inspection, memory leak triage' },
        { name: 'Git & Version Control', detail: 'Trunk-based development, semantic commits, PR review rigor' },
      ],
    },
  ];

  return (
    <section id="tech-stack" className="py-20 sm:py-28 bg-[#070707] border-t border-[#1C1C1C]">
      <Container>
        <SectionHeading
          eyebrow="SPECIALIZED CAPABILITIES"
          title="PRODUCTION TECHNOLOGY STACK"
          description="Every tool in my stack is chosen for reliability, developer ergonomics, and verifiable production throughput."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stackCategories.map((group) => (
            <div
              key={group.category}
              className="p-8 bg-[#0D0D0D] border border-[#242424] rounded-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] tracking-tight mb-2">
                  {group.category}
                </h3>
                <p className="text-sm text-[#969691] leading-relaxed mb-6">
                  {group.description}
                </p>

                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="p-3.5 bg-[#121212] border border-[#1E1E1E] rounded-sm"
                    >
                      <div className="text-sm font-semibold text-[#E2E2DE] font-mono">
                        {item.name}
                      </div>
                      <div className="text-xs text-[#8A8A85] mt-1 leading-relaxed">
                        {item.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
