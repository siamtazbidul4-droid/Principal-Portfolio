import React, { useEffect, useState } from 'react';
import {
  Mail,
  CheckCircle2,
  Trash2,
  Eye,
  Clock,
  Building2,
  DollarSign,
  AlertCircle,
  X,
  Send,
} from 'lucide-react';
import { ContactService } from '../../services/contact.service';
import { IContactInquiry } from '../../types';
import { Button } from '../../components/ui/Button';
import { DeleteConfirmModal } from '../../components/ui/DeleteConfirmModal';
import { AdminModal } from '../../components/ui/AdminModal';
import { useToast } from '../../context/ToastContext';

export function AdminInquiries() {
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState<IContactInquiry[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'contacted' | 'archived'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<IContactInquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await ContactService.getInquiries();
      if (res.success && res.data) {
        setInquiries(res.data.inquiries);
      }
    } catch {
      showToast('Failed to load inquiries', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: IContactInquiry['status']) => {
    try {
      const res = await ContactService.updateInquiryStatus(id, newStatus);
      if (res.success) {
        showToast(`Status updated to ${newStatus}`, 'success');
        setInquiries((prev) =>
          prev.map((item) => ((item._id || item.id) === id ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry && (selectedInquiry._id || selectedInquiry.id) === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await ContactService.deleteInquiry(deleteTarget.id);
      if (res.success) {
        showToast('Inquiry deleted permanently', 'success');
        setInquiries((prev) => prev.filter((i) => (i._id || i.id) !== deleteTarget.id));
        if (selectedInquiry && (selectedInquiry._id || selectedInquiry.id) === deleteTarget.id) {
          setSelectedInquiry(null);
        }
        setDeleteTarget(null);
      } else {
        showToast(res.message || 'Failed to delete inquiry', 'error');
      }
    } catch {
      showToast('Network error while deleting inquiry', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = inquiries.filter((inq) => {
    if (filter === 'all') return true;
    return inq.status === filter;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2] uppercase tracking-tight">
            Client Inquiries & Proposals
          </h1>
          <p className="text-xs font-mono text-[#888882] mt-1">
            Direct communications submitted through the portfolio contact form
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0D0D0D] border border-[#242424] rounded-sm">
          {(['all', 'unread', 'read', 'contacted', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors ${
                filter === s
                  ? 'bg-[#C9A769] text-[#070707] font-semibold'
                  : 'text-[#888882] hover:text-[#F5F5F2]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-[#0D0D0D] border border-[#242424] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E1E1E] bg-[#111111] text-[11px] font-mono uppercase tracking-wider text-[#888882]">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Project Scope</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A] text-xs">
              {filtered.map((inq) => {
                const id = inq._id || inq.id || '';
                return (
                  <tr key={id} className="hover:bg-[#121212] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#F5F5F2]">{inq.name}</div>
                      <div className="font-mono text-[11px] text-[#888882]">{inq.email}</div>
                      {inq.company && (
                        <div className="text-[11px] text-[#C9A769]">{inq.company}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-[#CCCCCC]">{inq.projectType}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#A3A39E]">
                      {inq.budgetRange || 'Undetermined'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#777772]">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          handleStatusChange(id, e.target.value as IContactInquiry['status'])
                        }
                        className={`text-[10px] font-mono uppercase px-2 py-1 rounded-sm border bg-[#141414] focus:outline-none ${
                          inq.status === 'unread'
                            ? 'text-amber-300 border-amber-800/50'
                            : inq.status === 'contacted'
                            ? 'text-emerald-300 border-emerald-800/50'
                            : 'text-[#888882] border-[#2A2A2A]'
                        }`}
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="contacted">Contacted</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inq);
                            if (inq.status === 'unread') {
                              handleStatusChange(id, 'read');
                            }
                          }}
                          className="p-1.5 text-[#888882] hover:text-[#C9A769] transition-colors cursor-pointer"
                          title="Review Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(id, inq.name)}
                          className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Inquiry"
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

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <AdminModal
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          title={selectedInquiry.name}
          subtitle={`${selectedInquiry.email}${selectedInquiry.company ? ` · ${selectedInquiry.company}` : ''}`}
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding Your Technical Inquiry — Tazbidul Siam`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A769] text-[#070707] font-semibold text-xs font-mono rounded-sm hover:bg-[#D4B77C] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>REPLY VIA EMAIL</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedInquiry._id || selectedInquiry.id;
                    handleDelete(id, selectedInquiry.name);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-400/80 hover:text-rose-400 hover:bg-rose-950/30 font-mono text-xs rounded-sm transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>DELETE INQUIRY</span>
                </button>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedInquiry(null)}
              >
                CLOSE
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#121212] border border-[#202020] rounded-sm text-xs font-mono">
              <div>
                <span className="text-[#666662] block">Project Type:</span>
                <span className="text-[#F5F5F2] font-semibold">{selectedInquiry.projectType}</span>
              </div>
              <div>
                <span className="text-[#666662] block">Budget Range:</span>
                <span className="text-[#F5F5F2] font-semibold">{selectedInquiry.budgetRange || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[#666662] block">Submitted At:</span>
                <span className="text-[#969691]">{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#666662] block">Current Status:</span>
                <span className="text-emerald-400 uppercase font-semibold">{selectedInquiry.status}</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-[#666662] uppercase mb-2">Message Body:</div>
              <div className="p-4 bg-[#111111] border border-[#1E1E1E] rounded-sm text-sm text-[#E2E2DE] leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* In-App Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Inquiry Record"
        itemType="client inquiry"
        itemName={deleteTarget?.name}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
