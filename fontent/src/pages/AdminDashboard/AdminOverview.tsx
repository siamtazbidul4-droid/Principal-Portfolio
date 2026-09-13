import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Mail,
  Layers,
  Quote,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react';
import { ProjectService } from '../../services/project.service';
import { resolveAssetUrl } from '../../services/api';
import { ContactService } from '../../services/contact.service';
import { ServiceItemService } from '../../services/service.service';
import { TestimonialService } from '../../services/testimonial.service';
import { IContactInquiry, IProject } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export function AdminOverview() {
  const [stats, setStats] = useState({
    projects: 0,
    inquiries: 0,
    unreadInquiries: 0,
    services: 0,
    testimonials: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<IContactInquiry[]>([]);
  const [recentProjects, setRecentProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const [projRes, inqRes, servRes, testRes] = await Promise.all([
          ProjectService.getAllAdminProjects(),
          ContactService.getInquiries(),
          ServiceItemService.getAllAdminServices(),
          TestimonialService.getAllAdminTestimonials(),
        ]);

        const projectList = projRes.data || [];
        const inquiriesList = inqRes.data?.inquiries || [];

        setStats({
          projects: projectList.length,
          inquiries: inquiriesList.length,
          unreadInquiries: inqRes.data?.stats?.unread || 0,
          services: (servRes.data || []).length,
          testimonials: (testRes.data || []).length,
        });

        setRecentProjects(projectList.slice(0, 4));
        setRecentInquiries(inquiriesList.slice(0, 5));
      } catch (err) {
        console.error('Error fetching admin dashboard overview:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOverview();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2] uppercase tracking-tight">
            Consultancy Dashboard
          </h1>
          <p className="text-xs font-mono text-[#888882] mt-1">
            Real-time portfolio management, case studies, and client pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="emerald" dot>
            API Engine Active
          </Badge>
          <Link to="/admin/projects">
            <Button variant="primary" size="sm" icon={<FolderGit2 className="w-3.5 h-3.5" />}>
              MANAGE PROJECTS
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-[#0D0D0D] border border-[#242424] rounded-sm">
          <div className="flex items-center justify-between text-[#888882] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Total Projects</span>
            <FolderGit2 className="w-4 h-4 text-[#C9A769]" />
          </div>
          <div className="text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2]">
            {stats.projects}
          </div>
          <div className="text-[11px] font-mono text-[#666662] mt-2 flex items-center gap-1">
            <span>Published Case Studies</span>
          </div>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#242424] rounded-sm">
          <div className="flex items-center justify-between text-[#888882] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Client Inquiries</span>
            <Mail className="w-4 h-4 text-[#C9A769]" />
          </div>
          <div className="text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2]">
            {stats.inquiries}
          </div>
          <div className="text-[11px] font-mono text-[#666662] mt-2 flex items-center gap-1">
            <span className={stats.unreadInquiries > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
              {stats.unreadInquiries} unread proposals
            </span>
          </div>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#242424] rounded-sm">
          <div className="flex items-center justify-between text-[#888882] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Service Offerings</span>
            <Layers className="w-4 h-4 text-[#C9A769]" />
          </div>
          <div className="text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2]">
            {stats.services}
          </div>
          <div className="text-[11px] font-mono text-[#666662] mt-2">
            Active Capabilities
          </div>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#242424] rounded-sm">
          <div className="flex items-center justify-between text-[#888882] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Database Persistence</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-400">
            Hybrid Active
          </div>
          <div className="text-[11px] font-mono text-[#666662] mt-2">
            MongoDB / Local Store.json
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Inquiries & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries */}
        <div className="lg:col-span-7 bg-[#0D0D0D] border border-[#242424] rounded-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1E1E1E]">
            <h2 className="text-base font-bold font-['Space_Grotesk',sans-serif] uppercase text-[#F5F5F2] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C9A769]" />
              <span>Recent Client Inquiries</span>
            </h2>
            <Link
              to="/admin/inquiries"
              className="text-xs font-mono text-[#C9A769] hover:underline"
            >
              View All ({stats.inquiries})
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-[#666662]">
              No client inquiries logged yet.
            </div>
          ) : (
            <div className="divide-y divide-[#1A1A1A]">
              {recentInquiries.map((inq) => (
                <div key={inq._id || inq.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#F5F5F2]">{inq.name}</span>
                      {inq.company && (
                        <span className="text-xs text-[#80807B]">({inq.company})</span>
                      )}
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                          inq.status === 'unread'
                            ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                            : inq.status === 'contacted'
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                            : 'bg-[#181818] text-[#888882] border-[#2E2E2E]'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#969691] line-clamp-1">{inq.message}</div>
                    <div className="text-[11px] font-mono text-[#666662]">
                      {inq.projectType} · {inq.budgetRange || 'No budget specified'} · {new Date(inq.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <Link
                    to="/admin/inquiries"
                    className="p-2 text-[#969691] hover:text-[#F5F5F2] shrink-0"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Managed Projects List */}
        <div className="lg:col-span-5 bg-[#0D0D0D] border border-[#242424] rounded-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1E1E1E]">
            <h2 className="text-base font-bold font-['Space_Grotesk',sans-serif] uppercase text-[#F5F5F2] flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#C9A769]" />
              <span>Case Studies</span>
            </h2>
            <Link
              to="/admin/projects"
              className="text-xs font-mono text-[#C9A769] hover:underline"
            >
              Add / Edit
            </Link>
          </div>

          <div className="space-y-4">
            {recentProjects.map((p) => (
              <div
                key={p._id || p.slug}
                className="p-3 bg-[#121212] border border-[#202020] rounded-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={resolveAssetUrl(p.heroImage)}
                    alt={p.title}
                    className="w-10 h-10 object-cover rounded-sm border border-[#2A2A2A] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#F5F5F2] truncate">{p.title}</div>
                    <div className="text-[11px] font-mono text-[#777772] truncate">{p.category}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      p.published
                        ? 'text-emerald-400 bg-emerald-950/30'
                        : 'text-amber-400 bg-amber-950/30'
                    }`}
                  >
                    {p.published ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
