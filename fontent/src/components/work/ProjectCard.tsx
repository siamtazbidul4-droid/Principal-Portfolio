import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { IProject } from '../../types';
import { Badge } from '../ui/Badge';
import { resolveAssetUrl } from '../../services/api';

interface ProjectCardProps {
  key?: React.Key;
  project: IProject;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article
      id={`project-card-${project.slug}`}
      className="group relative bg-[#0D0D0D] border border-[#242424] hover:border-[#C9A769]/60 transition-all duration-300 rounded-sm overflow-hidden flex flex-col justify-between"
    >
      {/* Top Image Preview Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#141414] border-b border-[#202020]">
        <img
          src={resolveAssetUrl(project.heroImage)}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80" />

        {/* Floating Category Badge & Index */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <Badge variant="default" size="sm" className="bg-[#0A0A0A]/90 backdrop-blur-sm">
            {project.category}
          </Badge>
          <span className="font-mono text-xs text-[#969691] bg-[#0A0A0A]/90 px-2 py-0.5 border border-[#222222] rounded-sm">
            0{index + 1}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Role & Year */}
          <div className="flex items-center gap-3 text-xs font-mono text-[#666662] mb-2 uppercase tracking-wider">
            <span>{project.role}</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] group-hover:text-[#FFFFFF] transition-colors flex items-center justify-between gap-2">
            <span>{project.title}</span>
            <ArrowUpRight className="w-5 h-5 text-[#969691] group-hover:text-[#C9A769] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </h3>

          {/* Short Description */}
          <p className="mt-3 text-sm text-[#969691] leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>

          {/* Key Outcome / Highlight if available */}
          {project.results && project.results.length > 0 && (
            <div className="mt-4 p-3 bg-[#121212] border border-[#1E1E1E] rounded-sm flex items-start gap-2 text-xs text-[#D8D8D4]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{project.results[0]}</span>
            </div>
          )}
        </div>

        {/* Technologies & CTA Link */}
        <div className="mt-6 pt-5 border-t border-[#1C1C1C]">
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono px-2 py-0.5 bg-[#141414] text-[#9E9E99] border border-[#222222] rounded-sm"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 text-[#666662]">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          <Link
            to={`/work/${project.slug}`}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A769] hover:text-[#D4B77C] font-semibold transition-colors"
          >
            <span>VIEW COMPLETE CASE STUDY</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
