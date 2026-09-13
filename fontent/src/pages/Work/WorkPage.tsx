import React, { useEffect, useState } from 'react';
import { Container } from '../../components/ui/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { ProjectCard } from '../../components/work/ProjectCard';
import { ProjectCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { IProject } from '../../types';
import { ProjectService } from '../../services/project.service';
import { Search } from 'lucide-react';

export function WorkPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await ProjectService.getPublicProjects();
        if (res.success && res.data) {
          setProjects(res.data);
        }
      } catch (err) {
        console.error('Failed to load projects archive:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['All', 'SaaS', 'E-Commerce', 'Publishing Platform', 'DevOps / Observability'];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="PORTFOLIO ARCHIVES"
          title="SELECTED WORK & CASE STUDIES"
          description="Detailed architectural breakdowns of real platforms, scalable APIs, and client systems designed and engineered for production durability."
        />

        {/* Filter and Search Bar */}
        <div className="mb-12 p-4 sm:p-5 bg-[#0D0D0D] border border-[#242424] rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-sm transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#C9A769] text-[#070707] font-semibold'
                    : 'text-[#969691] hover:text-[#F5F5F2] hover:bg-[#161616]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-[#666662] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stack or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#121212] border border-[#222222] focus:border-[#C9A769] focus:outline-none text-xs text-[#F5F5F2] placeholder-[#555550] rounded-sm font-mono"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title="No projects match this filter"
            description="Try selecting another category tab or clearing your search term."
            actionLabel="Reset Filters"
            onAction={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project._id || project.slug} project={project} index={idx} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
