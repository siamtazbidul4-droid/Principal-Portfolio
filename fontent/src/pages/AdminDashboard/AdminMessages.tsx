import React, { useEffect, useMemo, useState } from 'react';
import {
  Mail,
  CheckCircle2,
  Trash2,
  Eye,
  Clock,
  Building2,
  DollarSign,
  AlertCircle,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { ContactService } from '../../services/contact.service';
import { IContactInquiry } from '../../types';
import { Button } from '../../components/ui/Button';
import { DeleteConfirmModal } from '../../components/ui/DeleteConfirmModal';
import { AdminModal } from '../../components/ui/AdminModal';
import { useToast } from '../../context/ToastContext';

type MessageFilter = 'all' | 'unread' | 'read' | 'contacted' | 'archived';

const STATUS_PILL: Record<IContactInquiry['status'], string> = {
  unread: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
  contacted: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
  archived: 'bg-[#181818] text-[#777772] border-[#2E2E2E]',
  read: 'bg-[#181818] text-[#888882] border-[#2E2E2E]',
};

export function AdminMessages() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<IContactInquiry[]>([]);
  const [filter, setFilter] = useState<MessageFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<IContactInquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMessages = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await ContactService.getInquiries();
      if (res.success && res.data) {
        setMessages(res.data.inquiries);
      } else {
        setLoadError(res.message || 'Failed to load messages.');
      }
    } catch {
      setLoadError('Network error while loading messages. Please try again.');
      showToast('Failed to load messages', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (id: string, newStatus: IContactInquiry['status']) => {
    try {
      const res = await ContactService.updateInquiryStatus(id, newStatus);
      if (res.success) {
        setMessages((prev) =>
          prev.map((item) =>
            (item._id || item.id) === id ? { ...item, status: newStatus } : item
          )
        );
        if (selectedMessage && (selectedMessage._id || selectedMessage.id) === id) {
          setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
      } else {
        showToast(res.message || 'Failed to update status', 'error');
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleViewMessage = (message: IContactInquiry) => {
    setSelectedMessage(message);
    const id = message._id || message.id || '';
    if (message.status === 'unread' && id) {
      handleStatusChange(id, 'read');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await ContactService.deleteInquiry(deleteTarget.id);
      if (res.success) {
        showToast('Message deleted permanently', 'success');
        setMessages((prev) => prev.filter((i) => (i._id || i.id) !== deleteTarget.id));
        if (selectedMessage && (selectedMessage._id || selectedMessage.id) === deleteTarget.id) {
          setSelectedMessage(null);
        }
        setDeleteTarget(null);
      } else {
        showToast(res.message || 'Failed to delete message', 'error');
      }
    } catch {
      showToast('Network error while deleting message', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const unreadCount = useMemo(
    () => messages.filter((m) => m.status === 'unread').length,
    [messages]
  );

  const filtered = useMemo(
    () => (filter === 'all' ? messages : messages.filter((m) => m.status === filter)),
    [messages, filter]
  );

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2] uppercase tracking-tight">
            Messages
          </h1>
          <p className="text-xs font-mono text-[#888882] mt-1">
            Client correspondence submitted through the portfolio contact form
            {unreadCount > 0 && <span className="ml-2 text-amber-300">· {unreadCount} unread</span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0D0D0D] border border-[#242424] rounded-sm">
            {(['all', 'unread', 'read', 'contacted', 'archived'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                  filter === s
                    ? 'bg-[#C9A769] text-[#070707] font-semibold'
                    : 'text-[#888882] hover:text-[#F5F5F2]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={loadMessages}
            disabled={isLoading}
            title="Refresh messages"
            className="p-2 text-[#888882] hover:text-[#C9A769] transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-[#0D0D0D] border border-[#242424] rounded-sm animate-pulse"
            />
          ))}
        </div>
      ) : loadError ? (
        /* Error State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0D0D0D] border border-[#242424] rounded-sm max-w-lg mx-auto">
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#F5F5F2] tracking-tight">
            Unable to load messages
          </h3>
          <p className="mt-2 text-sm text-[#969691] max-w-sm">{loadError}</p>
          <div className="mt-6">
            <Button variant="secondary" size="sm" onClick={loadMessages}>
              RETRY
            </Button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0D0D0D] border border-[#242424] rounded-sm max-w-lg mx-auto">
          <div className="p-3 bg-[#161616] border border-[#262626] rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-[#969691]" />
          </div>
          <h3 className="text-lg font-semibold text-[#F5F5F2] tracking-tight">
            {filter === 'all' ? 'No messages yet' : `No ${filter} messages`}
          </h3>
          <p className="mt-2 text-sm text-[#969691] max-w-sm">
            {filter === 'all'
              ? 'Client messages submitted through the contact form will appear here.'
              : 'Try a different status filter to see other messages.'}
          </p>
        </div>
      ) : (
        /* Message Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((message) => {
            const id = message._id || message.id || '';
            return (
              <div
                key={id}
                className="flex flex-col bg-[#0D0D0D] border border-[#242424] rounded-sm p-5 hover:border-[#383838] transition-colors"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#F5F5F2] truncate">
                        {message.name}
                      </span>
                      {message.status === 'unread' && (
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-[#888882] truncate">
                      {message.email}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                      STATUS_PILL[message.status]
                    }`}
                  >
                    {message.status}
                  </span>
                </div>

                {/* Summary metrics */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-[#777772] mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <Building2 className="w-3 h-3" />
                    {message.company || 'No company'}
                  </span>
                </div>

                {/* Message preview */}
                <p className="text-xs text-[#969691] leading-relaxed line-clamp-3 mb-4 flex-1">
                  {message.message}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1A]">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    iconPosition="left"
                    onClick={() => handleViewMessage(message)}
                  >
                    VIEW
                  </Button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id, name: message.name })}
                    className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <AdminModal
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title={selectedMessage.name}
          subtitle={`${selectedMessage.email}${
            selectedMessage.company ? ` · ${selectedMessage.company}` : ''
          }`}
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Regarding Your Technical Inquiry — Tazbidul Siam`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A769] text-[#070707] font-semibold text-xs font-mono rounded-sm hover:bg-[#D4B77C] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>REPLY VIA EMAIL</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedMessage._id || selectedMessage.id;
                    if (id) handleStatusChange(id, 'contacted');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-emerald-300/90 hover:text-emerald-300 hover:bg-emerald-950/30 font-mono text-xs rounded-sm transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>MARK CONTACTED</span>
                </button>
              </div>

              <Button variant="secondary" size="sm" onClick={() => setSelectedMessage(null)}>
                CLOSE
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#121212] border border-[#202020] rounded-sm text-xs font-mono">
              <div>
                <span className="text-[#666662] block">Project Type:</span>
                <span className="text-[#F5F5F2] font-semibold">
                  {selectedMessage.projectType}
                </span>
              </div>
              <div>
                <span className="text-[#666662] block">Budget Range:</span>
                <span className="inline-flex items-center gap-1 text-[#F5F5F2] font-semibold">
                  <DollarSign className="w-3 h-3 text-[#666662]" />
                  {selectedMessage.budgetRange || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-[#666662] block">Submitted At:</span>
                <span className="text-[#969691]">
                  {formatDateTime(selectedMessage.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-[#666662] block">Current Status:</span>
                <span className="text-emerald-400 uppercase font-semibold">
                  {selectedMessage.status}
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-[#666662] uppercase mb-2">
                Message Body:
              </div>
              <div className="p-4 bg-[#111] border border-[#1E1E1E] rounded-sm text-sm text-[#E2E2DE] leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#666662] pt-2 border-t border-[#1A1A1A]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    selectedMessage.emailSent ? 'text-emerald-400' : 'text-[#666662]'
                  }`}
                />
                Email {selectedMessage.emailSent ? 'delivered' : 'not delivered'}
              </span>
              {selectedMessage.ip && <span>Source IP · {selectedMessage.ip}</span>}
            </div>
          </div>
        </AdminModal>
      )}

      {/* In-App Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Message Record"
        itemType="client message"
        itemName={deleteTarget?.name}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
