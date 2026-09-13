import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Cpu, Database, Server, Layers, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';

export function Hero() {
  const navigate = useNavigate();

  const techBadges = [
    'TypeScript',
    'React 19',
    'Node.js',
    'Express',
    'MongoDB',
    'PostgreSQL',
    'REST APIs',
    'Tailwind CSS',
  ];

  return (
    <section id="hero-section" className="relative pt-8 pb-20 sm:pt-14 sm:pb-28 overflow-hidden">
      {/* Subtle ambient light gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C9A769]/5 rounded-full blur-[140px] pointer-events-none" />

      <Container>
        <div className="flex flex-col items-start max-w-4xl">
          {/* Eyebrow */}
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Badge variant="gold" dot size="md">
              INDEPENDENT FULL-STACK SOFTWARE ENGINEER
            </Badge>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase leading-[1.08] mb-6">
            I BUILD DIGITAL PRODUCTS <br />
            THAT FEEL AS GOOD <br />
            <span className="text-[#C9A769]">
              AS THEY PERFORM.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg sm:text-xl text-[#969691] leading-relaxed max-w-2xl mb-8">
            I design and engineer high-performance web applications, SaaS platforms, and distributed systems using modern full-stack technologies. Zero bloated boilerplate. Built for scale from day one.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-14">
            <Button
              id="hero-view-work-cta"
              variant="primary"
              size="lg"
              onClick={() => {
                const el = document.getElementById('selected-work');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate('/work');
              }}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              VIEW SELECTED WORK
            </Button>
            <Button
              id="hero-start-project-cta"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/contact')}
              icon={<ArrowUpRight className="w-4 h-4" />}
            >
              START A PROJECT
            </Button>
          </div>

          {/* Tech Stack Ticker / Pills */}
          <div className="w-full pt-8 border-t border-[#1C1C1C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#666662]">
              Specialized Stack
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {techBadges.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-[#0F0F0F] border border-[#222222] text-[#B0B0AB] text-xs font-mono rounded-sm hover:border-[#C9A769]/50 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live System Architecture Status Bar */}
        <div className="mt-16 p-5 sm:p-6 bg-[#0B0B0B] border border-[#242424] rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-[#141414] border border-[#222222] text-[#C9A769] rounded-sm shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-[#666662] tracking-wider">Engineering Focus</div>
              <div className="text-sm font-semibold text-[#F5F5F2] mt-0.5">High-Concurrency Web Systems</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-[#141414] border border-[#222222] text-[#C9A769] rounded-sm shrink-0">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-[#666662] tracking-wider">API Architecture</div>
              <div className="text-sm font-semibold text-[#F5F5F2] mt-0.5">RESTful & Event Streams</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-[#141414] border border-[#222222] text-[#C9A769] rounded-sm shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-[#666662] tracking-wider">Database Design</div>
              <div className="text-sm font-semibold text-[#F5F5F2] mt-0.5">MongoDB & Indexed Schemas</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-[#141414] border border-[#222222] text-emerald-400 rounded-sm shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-[#666662] tracking-wider">Availability</div>
              <div className="text-sm font-semibold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for Q3/Q4 2026
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
