import React from 'react';
import { Container } from '../../components/ui/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowUpRight, CheckCircle2, Terminal, Code2, Layers, Cpu, Shield, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AboutPage() {
  const navigate = useNavigate();

  const milestones = [
    {
      year: '2024 — Present',
      role: 'Principal Digital Product Architect & Consultant',
      organization: 'Independent Engineering Studio',
      summary:
        'Partnering with early-stage venture founders and growth companies to design, architect, and ship high-concurrency SaaS platforms, real-time dashboards, and secure data backends.',
    },
    {
      year: '2022 — 2024',
      role: 'Staff Full-Stack Engineer',
      organization: 'FinTech & High-Frequency Data Infrastructure',
      summary:
        'Led core API microservice rewrite in Node.js and TypeScript, reducing P95 latency by 68% and maintaining 99.99% uptime across millions of daily mutations.',
    },
    {
      year: '2020 — 2022',
      role: 'Senior Frontend Systems Engineer',
      organization: 'Global SaaS & Developer Tooling',
      summary:
        'Engineered modular design systems in React and Tailwind CSS, architected complex state management layers, and established automated visual regression testing pipelines.',
    },
  ];

  return (
    <div className="py-12 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="ENGINEERING ETHOS"
          title="ABOUT TAZBIDUL SIAM"
          description="Principal Full-Stack Software Engineer & Systems Architect dedicated to crafting enduring, high-performance digital products."
        />

        {/* Top Grid: Portrait + Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] bg-[#101010] border border-[#242424] rounded-sm overflow-hidden p-2">
              <div className="w-full h-full relative overflow-hidden bg-[#181818] border border-[#2A2A2A]">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
                  alt="Tazbidul Siam Portrait"
                  className="w-full h-full object-cover object-top grayscale contrast-125 opacity-90"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#0D0D0D] border border-[#222222] rounded-sm flex items-center justify-between text-xs font-mono">
              <span className="text-[#888882]">Direct Inquiries:</span>
              <a href="mailto:siamtazbidul4@gmail.com" className="text-[#C9A769] hover:underline font-semibold">
                siamtazbidul4@gmail.com
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-[#A0A09A] leading-relaxed">
            <p className="font-['Newsreader',serif] text-[22px] text-[#F5F5F2] leading-relaxed italic">
              "Great software should feel effortless to the user, impervious to failure, and deeply satisfying for engineering teams to maintain."
            </p>

            <p>
              I am an independent software engineer and product builder with extensive experience delivering complete full-stack web platforms from technical zero to high-throughput production.
            </p>

            <p>
              Rather than siloing myself strictly into frontend or backend, I operate with end-to-end domain ownership. When I build a product, I model the database collections with compound indexes, implement defensive Zod-validated Express REST endpoints, and construct pixel-precise React user interfaces with fluid motion and thoughtful accessibility.
            </p>

            <p>
              My clients include venture-backed founders, engineering directors, and product teams who need senior-level architecture without agency overhead, unnecessary layers of management, or sluggish velocity.
            </p>

            <div className="pt-6 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/contact')}
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                DISCUSS A COLLABORATION
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/work')}
              >
                EXPLORE CASE STUDIES
              </Button>
            </div>
          </div>
        </div>

        {/* Career Timeline / Milestones */}
        <div className="pt-16 border-t border-[#1C1C1C]">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2] uppercase mb-12">
            Selected Career Trajectory
          </h2>

          <div className="space-y-8">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-8 bg-[#0D0D0D] border border-[#242424] rounded-sm grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                <div className="lg:col-span-3">
                  <span className="font-mono text-xs text-[#C9A769] uppercase tracking-wider block mb-1">
                    {m.year}
                  </span>
                  <span className="text-xs text-[#666662] font-mono">{m.organization}</span>
                </div>
                <div className="lg:col-span-9">
                  <h3 className="text-xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] mb-2">
                    {m.role}
                  </h3>
                  <p className="text-sm text-[#969691] leading-relaxed">
                    {m.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
