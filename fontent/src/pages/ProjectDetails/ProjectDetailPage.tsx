import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Github,
  CheckCircle2,
  Layers,
  AlertTriangle,
  Lightbulb,
  Calendar,
  User,
  Activity,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArchitectureDiagram } from '../../components/work/ArchitectureDiagram';
import { Skeleton } from '../../components/ui/Skeleton';
import { IProject } from '../../types';
import { ProjectService } from '../../services/project.service';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<IProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await ProjectService.getProjectBySlug(slug);
        if (res.success && res.data) {
          setProject(res.data);
        } else {
          setError(res.message || 'Case study not found');
        }
      } catch (err) {
        setError('Network error while retrieving project details.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20">
        <Container size="narrow">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-14 w-3/4 mb-4" />
          <Skeleton className="h-20 w-full mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/6" />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-24 text-center">
        <Container size="narrow">
          <h2 className="text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2] mb-4">
            Case Study Not Found
          </h2>
          <p className="text-[#969691] mb-8 max-w-md mx-auto">
            The requested technical case study could not be located or has been relocated.
          </p>
          <Button variant="secondary" onClick={() => navigate('/work')} icon={<ArrowLeft className="w-4 h-4" />}>
            BACK TO SELECTED WORK
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <article className="py-12 sm:py-20">
      <Container>
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#969691] hover:text-[#C9A769] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO ALL PROJECTS</span>
          </Link>
        </div>

        {/* Header Block */}
        <div className="max-w-4xl mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="gold" dot>
              {project.category}
            </Badge>
            <span className="font-mono text-xs text-emerald-400 bg-emerald-950/30 px-2.5 py-0.5 border border-emerald-800/40 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {project.status}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase leading-[1.08] mb-6">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-[#A3A39E] leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Project Meta Bar */}
        <div className="p-6 bg-[#0D0D0D] border border-[#242424] rounded-sm grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
          <div>
            <span className="text-[11px] font-mono text-[#666662] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Role
            </span>
            <span className="text-sm font-semibold text-[#F5F5F2] mt-1 block">
              {project.role}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-[#666662] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Timeline
            </span>
            <span className="text-sm font-semibold text-[#F5F5F2] mt-1 block">
              {project.year}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-[#666662] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Domain
            </span>
            <span className="text-sm font-semibold text-[#F5F5F2] mt-1 block">
              {project.category}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-[#666662] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Codebase
            </span>
            <span className="text-sm font-semibold text-emerald-400 mt-1 block">
              100% Strictly Typed
            </span>
          </div>
        </div>

        {/* Hero Visual Image */}
        <div className="relative aspect-[16/9] bg-[#121212] border border-[#262626] rounded-sm overflow-hidden mb-16 shadow-2xl">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Case Study Deep Dive Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Case Study Text Column */}
          <div className="lg:col-span-8 space-y-16">
            {/* Overview */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase mb-4 pb-3 border-b border-[#1E1E1E]">
                Overview & Context
              </h2>
              <p className="text-base sm:text-lg text-[#A3A39E] leading-relaxed whitespace-pre-line font-['Newsreader',serif] text-[19px]">
                {project.overview}
              </p>
            </section>

            {/* The Challenge */}
            <section className="p-8 bg-[#0D0D0D] border-l-2 border-l-[#C9A769] border-y border-r border-[#202020] rounded-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C9A769] uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>The Core Engineering Challenge</span>
              </div>
              <p className="text-base text-[#D4D4D0] leading-relaxed">
                {project.challenge}
              </p>
            </section>

            {/* The Architectural Approach */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase mb-4 pb-3 border-b border-[#1E1E1E]">
                The Architectural Approach
              </h2>
              <p className="text-base sm:text-lg text-[#A3A39E] leading-relaxed">
                {project.approach}
              </p>
            </section>

            {/* Verified Architecture Diagram */}
            {project.architecture && (
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase mb-6 pb-3 border-b border-[#1E1E1E]">
                  System Architecture Flow
                </h2>
                <ArchitectureDiagram architecture={project.architecture} />
              </section>
            )}

            {/* Engineering Challenges & Concrete Solutions */}
            {project.engineeringChallenges && project.engineeringChallenges.length > 0 && (
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase mb-6 pb-3 border-b border-[#1E1E1E]">
                  Complex Engineering Challenges Solved
                </h2>
                <div className="space-y-6">
                  {project.engineeringChallenges.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 bg-[#0D0D0D] border border-[#242424] rounded-sm"
                    >
                      <div className="flex items-center gap-2 mb-2 text-[#F5F5F2] font-bold text-base">
                        <Lightbulb className="w-4 h-4 text-[#C9A769] shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-sm text-[#969691] leading-relaxed pl-6">
                        {item.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Measurable Results & Outcomes */}
            {project.results && project.results.length > 0 && (
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase mb-6 pb-3 border-b border-[#1E1E1E]">
                  Measurable Results & Outcomes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.results.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#0F0F0F] border border-[#222222] rounded-sm flex items-start gap-3 text-sm text-[#E2E2DE]"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery Images */}
            {project.gallery && project.gallery.length > 0 && (
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase mb-6 pb-3 border-b border-[#1E1E1E]">
                  System Artifacts & Interface Views
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {project.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[16/9] bg-[#121212] border border-[#242424] rounded-sm overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Actions Card */}
              <div className="p-6 bg-[#0D0D0D] border border-[#242424] rounded-sm">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#E2E2DE] mb-4">
                  Deployment & Repository
                </h3>
                <div className="space-y-3">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-between px-4 py-3 bg-[#C9A769] text-[#070707] font-semibold text-xs font-mono rounded-sm hover:bg-[#D4B77C] transition-colors"
                    >
                      <span>LAUNCH LIVE PLATFORM</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className="p-3 bg-[#141414] border border-[#222222] text-xs font-mono text-[#777772] text-center rounded-sm">
                      Private Enterprise Deployment
                    </div>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-between px-4 py-3 bg-[#141414] border border-[#2A2A2A] text-[#E2E2DE] hover:border-[#C9A769] text-xs font-mono rounded-sm transition-colors"
                    >
                      <span>VIEW SOURCE CODE</span>
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Technologies Specification */}
              <div className="p-6 bg-[#0D0D0D] border border-[#242424] rounded-sm">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#E2E2DE] mb-4">
                  Technologies Deployed
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-[#141414] border border-[#222222] text-xs font-mono text-[#B0B0AB] rounded-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Architectural Features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className="p-6 bg-[#0D0D0D] border border-[#242424] rounded-sm">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#E2E2DE] mb-4">
                    Architectural Features
                  </h3>
                  <ul className="space-y-2.5">
                    {project.keyFeatures.map((feat, i) => (
                      <li key={i} className="text-xs text-[#969691] flex items-start gap-2">
                        <span className="text-[#C9A769] font-bold">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Steps CTA */}
              <div className="p-6 bg-[#111111] border border-[#2E2E2E] rounded-sm">
                <h4 className="text-sm font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] mb-2">
                  Building something similar?
                </h4>
                <p className="text-xs text-[#969691] leading-relaxed mb-4">
                  Let's discuss architecture choices and timeline requirements for your next release.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => navigate('/contact')}
                  icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                >
                  START A CONVERSATION
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
