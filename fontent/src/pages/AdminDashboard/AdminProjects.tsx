import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  X,
  Eye,
  AlertCircle,
  Save,
} from 'lucide-react';
import { ProjectService } from '../../services/project.service';
import { resolveAssetUrl } from '../../services/api';
import { IProject } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ImagePicker } from '../../components/ui/ImagePicker';
import { DeleteConfirmModal } from '../../components/ui/DeleteConfirmModal';
import { AdminModal } from '../../components/ui/AdminModal';
import { useToast } from '../../context/ToastContext';

export function AdminProjects() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeProject, setActiveProject] = useState<Partial<IProject> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await ProjectService.getAllAdminProjects();
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch (err) {
      showToast('Failed to load project database', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNew = () => {
    setActiveProject({
      title: '',
      slug: '',
      shortDescription: '',
      category: 'SaaS Platform',
      role: 'Principal Full-Stack Architect',
      year: '2026',
      status: 'Production Live',
      technologies: ['TypeScript', 'React 19', 'Node.js', 'Express', 'MongoDB'],
      heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      gallery: [],
      overview: '',
      challenge: '',
      approach: '',
      architecture: {
        client: 'React 19 SPA + Vite + Tailwind CSS',
        api: 'Express.js REST Gateway + Zod',
        serviceLayer: 'Domain Services + Cache layer',
        database: 'MongoDB Atlas + Document Schemas',
        diagramSummary: 'Stateless Client ↔ JWT REST Gateway ↔ Persistent Storage',
      },
      keyFeatures: ['Sub-100ms API query latency', 'Real-time telemetry pipelines'],
      engineeringChallenges: [
        {
          title: 'High-Concurrency Synchronization',
          solution: 'Engineered optimistic concurrency control with sharded indexes.',
        },
      ],
      results: ['99.99% Uptime across benchmark testing'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      published: true,
      featured: true,
      order: projects.length + 1,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (project: IProject) => {
    setActiveProject({ ...project });
    setIsEditing(true);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await ProjectService.deleteProject(deleteTarget.id);
      if (res.success) {
        showToast(`Case study "${deleteTarget.title}" deleted permanently`, 'success');
        setProjects((prev) => prev.filter((p) => (p._id || p.id) !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        showToast(res.message || 'Failed to delete project', 'error');
      }
    } catch {
      showToast('Network error while deleting project', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !activeProject.title || !activeProject.slug) {
      showToast('Title and Slug are required fields', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const id = activeProject._id || activeProject.id;
      if (id) {
        // Update
        const res = await ProjectService.updateProject(id, activeProject);
        if (res.success && res.data) {
          showToast('Project updated successfully', 'success');
          setIsEditing(false);
          setActiveProject(null);
          loadProjects();
        } else {
          showToast(res.message || 'Update failed', 'error');
        }
      } else {
        // Create
        const res = await ProjectService.createProject(activeProject);
        if (res.success && res.data) {
          showToast('Project created successfully', 'success');
          setIsEditing(false);
          setActiveProject(null);
          loadProjects();
        } else {
          showToast(res.message || 'Creation failed', 'error');
        }
      }
    } catch {
      showToast('Network error while saving project', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2] uppercase tracking-tight">
            Case Studies & Projects
          </h1>
          <p className="text-xs font-mono text-[#888882] mt-1">
            Manage public portfolio case studies, architectural blueprints, and technology tags
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenNew}
          icon={<Plus className="w-4 h-4" />}
        >
          CREATE NEW CASE STUDY
        </Button>
      </div>

      {/* Projects Table */}
      <div className="bg-[#0D0D0D] border border-[#242424] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E1E1E] bg-[#111111] text-[11px] font-mono uppercase tracking-wider text-[#888882]">
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Role / Year</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A] text-xs">
              {projects.map((project) => {
                const id = project._id || project.id || '';
                return (
                  <tr key={id} className="hover:bg-[#121212] transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={resolveAssetUrl(project.heroImage)}
                        alt={project.title}
                        className="w-10 h-10 rounded-sm object-cover border border-[#2A2A2A]"
                      />
                      <div>
                        <div className="font-bold text-[#F5F5F2] text-sm">{project.title}</div>
                        <div className="font-mono text-[11px] text-[#666662]">{project.slug}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#CCCCCC]">{project.category}</td>
                    <td className="py-3 px-4 font-mono text-[#8A8A85]">
                      {project.role} · {project.year}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-800/40">
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                          project.published
                            ? 'text-emerald-300 bg-emerald-950/30'
                            : 'text-amber-300 bg-amber-950/30'
                        }`}
                      >
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/work/${project.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-[#888882] hover:text-[#FFFFFF] transition-colors"
                          title="View Live Case Study"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 text-[#888882] hover:text-[#C9A769] transition-colors cursor-pointer"
                          title="Edit Case Study"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(id, project.title)}
                          className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Case Study"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Form Modal */}
      {isEditing && activeProject && (
        <AdminModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          title={activeProject._id || activeProject.id ? 'Edit Case Study' : 'Create New Case Study'}
          subtitle="Configure portfolio architectural specs, case study deliverables, and media"
          maxWidth="3xl"
          footer={
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                form="project-form"
                variant="primary"
                size="sm"
                isLoading={isSaving}
                icon={<Save className="w-4 h-4" />}
              >
                SAVE CASE STUDY
              </Button>
            </div>
          }
        >
          <form id="project-form" onSubmit={handleSave} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={activeProject.title || ''}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');
                    setActiveProject({
                      ...activeProject,
                      title,
                      slug: activeProject.slug || slug,
                    });
                  }}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={activeProject.slug || ''}
                  onChange={(e) => setActiveProject({ ...activeProject, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">Category</label>
                <input
                  type="text"
                  value={activeProject.category || ''}
                  onChange={(e) =>
                    setActiveProject({ ...activeProject, category: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
                />
              </div>
              <div>
                <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">Role</label>
                <input
                  type="text"
                  value={activeProject.role || ''}
                  onChange={(e) => setActiveProject({ ...activeProject, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
                />
              </div>
              <div>
                <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">Year</label>
                <input
                  type="text"
                  value={activeProject.year || ''}
                  onChange={(e) => setActiveProject({ ...activeProject, year: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
                />
              </div>
            </div>

            <div>
              <ImagePicker
                label="Hero Image / Thumbnail"
                required
                value={activeProject.heroImage || ''}
                onChange={(url) => setActiveProject({ ...activeProject, heroImage: url })}
                helperText="Select an image file from your system. It will be uploaded directly and used across the public site."
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
                Short Description
              </label>
              <textarea
                rows={2}
                value={activeProject.shortDescription || ''}
                onChange={(e) =>
                  setActiveProject({ ...activeProject, shortDescription: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
                Technologies (Comma Separated)
              </label>
              <input
                type="text"
                value={(activeProject.technologies || []).join(', ')}
                onChange={(e) =>
                  setActiveProject({
                    ...activeProject,
                    technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
                Overview / Context
              </label>
              <textarea
                rows={3}
                value={activeProject.overview || ''}
                onChange={(e) => setActiveProject({ ...activeProject, overview: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">The Challenge</label>
                <textarea
                  rows={3}
                  value={activeProject.challenge || ''}
                  onChange={(e) => setActiveProject({ ...activeProject, challenge: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
                />
              </div>
              <div>
                <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">The Approach</label>
                <textarea
                  rows={3}
                  value={activeProject.approach || ''}
                  onChange={(e) => setActiveProject({ ...activeProject, approach: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-mono text-[#D4D4D0]">
                <input
                  type="checkbox"
                  checked={!!activeProject.published}
                  onChange={(e) => setActiveProject({ ...activeProject, published: e.target.checked })}
                  className="rounded border-[#333333]"
                />
                <span>Published on Public Site</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-mono text-[#D4D4D0]">
                <input
                  type="checkbox"
                  checked={!!activeProject.featured}
                  onChange={(e) => setActiveProject({ ...activeProject, featured: e.target.checked })}
                  className="rounded border-[#333333]"
                />
                <span>Featured on Home Page</span>
              </label>
            </div>
          </form>
        </AdminModal>
      )}

      {/* In-App Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Case Study"
        itemType="case study"
        itemName={deleteTarget?.title}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
