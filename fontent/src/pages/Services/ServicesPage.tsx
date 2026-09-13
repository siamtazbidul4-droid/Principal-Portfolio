import React, { useEffect, useState } from 'react';
import { Container } from '../../components/ui/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { ServiceCard } from '../../components/services/ServiceCard';
import { Button } from '../../components/ui/Button';
import { IService } from '../../types';
import { ServiceItemService } from '../../services/service.service';
import { ArrowUpRight, ShieldCheck, Zap, Database, Server, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<IService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await ServiceItemService.getPublicServices();
        if (res.success && res.data) {
          setServices(res.data);
        }
      } catch {
        // fail gracefully
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="py-12 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="ENGINEERING CONSULTANCY & CAPABILITIES"
          title="WHAT I BUILD & DELIVER"
          description="From greenfield product inception to rescuing legacy codebases, I provide high-touch software engineering and architectural leadership."
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, idx) => (
            <ServiceCard key={service._id || service.title} service={service} index={idx} />
          ))}
        </div>

        {/* Engagement Models */}
        <div className="p-8 sm:p-12 bg-[#0D0D0D] border border-[#242424] rounded-sm mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2] uppercase mb-8 pb-4 border-b border-[#1E1E1E]">
            Flexible Engagement Models
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#121212] border border-[#222222] rounded-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-[#C9A769] uppercase tracking-wider block mb-2">
                  Model 01
                </span>
                <h3 className="text-xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] mb-3">
                  Fixed-Scope Product Sprint
                </h3>
                <p className="text-sm text-[#969691] leading-relaxed mb-6">
                  Best for MVPs, proof-of-concepts, and well-defined standalone features. Clear milestones, fixed investment, and guaranteed delivery schedule.
                </p>
              </div>
              <div className="text-xs font-mono text-[#CCCCCC] pt-4 border-t border-[#1C1C1C]">
                Duration: 3 — 8 Weeks
              </div>
            </div>

            <div className="p-6 bg-[#121212] border border-[#222222] rounded-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-[#C9A769] uppercase tracking-wider block mb-2">
                  Model 02
                </span>
                <h3 className="text-xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] mb-3">
                  Technical Architecture Retainer
                </h3>
                <p className="text-sm text-[#969691] leading-relaxed mb-6">
                  For growing product teams seeking continuous technical leadership, codebase reviews, database tuning, and high-complexity feature development.
                </p>
              </div>
              <div className="text-xs font-mono text-[#CCCCCC] pt-4 border-t border-[#1C1C1C]">
                Commitment: Monthly Retainer
              </div>
            </div>

            <div className="p-6 bg-[#121212] border border-[#222222] rounded-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-[#C9A769] uppercase tracking-wider block mb-2">
                  Model 03
                </span>
                <h3 className="text-xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] mb-3">
                  Architecture & Codebase Audit
                </h3>
                <p className="text-sm text-[#969691] leading-relaxed mb-6">
                  A deep-dive investigation into query bottlenecks, security vulnerabilities, bundle bloat, and architectural anti-patterns with actionable remediation roadmap.
                </p>
              </div>
              <div className="text-xs font-mono text-[#CCCCCC] pt-4 border-t border-[#1C1C1C]">
                Duration: 1 — 2 Weeks
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-[#969691]">
              Need a tailored scope or custom consulting arrangement?
            </span>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/contact')}
              icon={<ArrowUpRight className="w-4 h-4" />}
            >
              SCHEDULE A TECHNICAL DISCOVERY
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
