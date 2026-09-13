import React, { useEffect, useState } from 'react';
import { Hero } from '../../components/hero/Hero';
import { ProjectCard } from '../../components/work/ProjectCard';
import { ServiceCard } from '../../components/services/ServiceCard';
import { PhilosophySection } from '../../components/philosophy/PhilosophySection';
import { ProcessSection } from '../../components/process/ProcessSection';
import { TechStackSection } from '../../components/skills/TechStackSection';
import { AboutSection } from '../../components/about/AboutSection';
import { TestimonialsSection } from '../../components/testimonials/TestimonialsSection';
import { ContactSection } from '../../components/contact/ContactSection';
import { Container } from '../../components/ui/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Button } from '../../components/ui/Button';
import { ProjectCardSkeleton } from '../../components/ui/Skeleton';
import { IProject, IService } from '../../types';
import { ProjectService } from '../../services/project.service';
import { ServiceItemService } from '../../services/service.service';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, servRes] = await Promise.all([
          ProjectService.getPublicProjects(),
          ServiceItemService.getPublicServices(),
        ]);
        if (projRes.success && projRes.data) {
          setProjects(projRes.data);
        }
        if (servRes.success && servRes.data) {
          setServices(servRes.data);
        }
      } catch (err) {
        console.error('Failed to load home page content:', err);
      } finally {
        setLoadingProjects(false);
        setLoadingServices(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <Hero />

      {/* Engineering Benchmarks & Architectural Proof Strip */}
      <section className="border-y border-[#1C1C1C] bg-[#0A0A0A] py-8">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#1C1C1C]">
            <div className="pt-4 sm:pt-0 sm:px-4 first:pl-0">
              <div className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#F5F5F2]">
                40<span className="text-[#C9A769]">+</span>
              </div>
              <p className="font-mono text-xs text-[#888882] uppercase tracking-wider mt-1">
                Shipped Systems & Products
              </p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-4">
              <div className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#F5F5F2]">
                &lt;50<span className="text-[#C9A769]">ms</span>
              </div>
              <p className="font-mono text-xs text-[#888882] uppercase tracking-wider mt-1">
                Optimized API Query Latency
              </p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-4">
              <div className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#F5F5F2]">
                99.99<span className="text-[#C9A769]">%</span>
              </div>
              <p className="font-mono text-xs text-[#888882] uppercase tracking-wider mt-1">
                Production SLA Availability
              </p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-4">
              <div className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#F5F5F2]">
                100<span className="text-[#C9A769]">%</span>
              </div>
              <p className="font-mono text-xs text-[#888882] uppercase tracking-wider mt-1">
                Strict TypeScript Strictness
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Selected Work Section */}
      <section id="selected-work" className="py-20 sm:py-28 bg-[#070707] border-t border-[#1C1C1C]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <SectionHeading
              eyebrow="SELECTED CASE STUDIES"
              title="RECENT DIGITAL PRODUCTS"
              description="A curated selection of platforms and distributed architectures engineered with rigorous performance, strict typing, and high uptime."
              className="mb-0 sm:mb-0"
            />
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/work')}
              icon={<ArrowRight className="w-4 h-4" />}
              className="self-start md:self-auto shrink-0"
            >
              VIEW ALL ARCHIVES
            </Button>
          </div>

          {loadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.slice(0, 4).map((project, idx) => (
                <ProjectCard key={project._id || project.slug} project={project} index={idx} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* What I Build / Services Section */}
      <section id="services" className="py-20 sm:py-28 bg-[#090909] border-t border-[#1C1C1C]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <SectionHeading
              eyebrow="CORE PRODUCT CAPABILITIES"
              title="WHAT I BUILD"
              description="From single-purpose high-concurrency SaaS tools to complex headless commerce and operational command centers."
              className="mb-0 sm:mb-0"
            />
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/services')}
              icon={<ArrowRight className="w-4 h-4" />}
              className="self-start md:self-auto shrink-0"
            >
              FULL SPECIFICATIONS
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, idx) => (
              <ServiceCard key={service._id || service.title} service={service} index={idx} />
            ))}
          </div>
        </Container>
      </section>

      {/* Philosophy Section */}
      <PhilosophySection />

      {/* Process Section */}
      <ProcessSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* About Section */}
      <AboutSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
}
