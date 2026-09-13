import React from 'react';
import { ArrowUpRight, CheckCircle2, Award, Terminal, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';

export function AboutSection() {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Architecture Philosophy', value: 'Zero Slop' },
    { label: 'Type Safety Guarantee', value: '100% Strict' },
    { label: 'API Target Latency', value: '< 100ms P95' },
    { label: 'Client Delivery Focus', value: 'End-to-End' },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#090909] border-t border-[#1C1C1C]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Portrait & Visual Framing */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] bg-[#121212] border border-[#262626] rounded-sm overflow-hidden p-2">
              <div className="w-full h-full relative overflow-hidden bg-[#181818] border border-[#2A2A2A]">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
                  alt="Tazbidul Siam — Principal Software Engineer"
                  className="w-full h-full object-cover object-top grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent opacity-90" />
              </div>

              {/* Status Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0A0A0A]/95 backdrop-blur-md border border-[#2E2E2E] rounded-sm">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#C9A769] font-medium">TAZBIDUL SIAM</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Available Q3/Q4 2026
                  </span>
                </div>
                <div className="text-[11px] text-[#80807B] mt-1">
                  Independent Full-Stack Engineer & Product Builder
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Ethos */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <Badge variant="gold" dot className="mb-4">
              ENGINEERING WITH INTENTION
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase leading-[1.12] mb-6">
              I BRIDGE PRODUCT VISION AND <br />
              <span className="text-[#C9A769]">RIGOROUS SYSTEM ARCHITECTURE.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#969691] leading-relaxed mb-6">
              Most projects fail not from a lack of ideas, but from fragile foundations: architectural shortcuts, unindexed queries, and disconnected user flows.
            </p>

            <p className="text-sm sm:text-base text-[#969691] leading-relaxed mb-8">
              I work as an independent technical partner. I don’t just take tickets—I take ownership. From data modeling in MongoDB and Express API design to crafting high-fidelity React interfaces with fluid micro-interactions, I deliver digital products designed to endure production pressure.
            </p>

            {/* Metrics Grid */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#0D0D0D] border border-[#222222] rounded-sm mb-8">
              {metrics.map((m) => (
                <div key={m.label} className="flex flex-col">
                  <span className="text-xs font-mono text-[#666662] uppercase">{m.label}</span>
                  <span className="text-base sm:text-lg font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] mt-1">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/contact')}
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                START A PROJECT
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/services')}
              >
                VIEW CAPABILITIES
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
