import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Quote, User } from 'lucide-react';
import { TestimonialService } from '../../services/testimonial.service';
import { ITestimonial } from '../../types';
import { Button } from '../../components/ui/Button';
import { ImagePicker } from '../../components/ui/ImagePicker';
import { DeleteConfirmModal } from '../../components/ui/DeleteConfirmModal';
import { AdminModal } from '../../components/ui/AdminModal';
import { useToast } from '../../context/ToastContext';

export function AdminTestimonials() {
  const { showToast } = useToast();
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState<Partial<ITestimonial> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const res = await TestimonialService.getAllAdminTestimonials();
      if (res.success && res.data) {
        setTestimonials(res.data);
      }
    } catch {
      showToast('Failed to load testimonials', 'error');
    }
  };

  const handleOpenNew = () => {
    setActiveTestimonial({
      name: '',
      role: '',
      company: '',
      quote: '',
      avatarUrl: '',
      order: testimonials.length + 1,
      published: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (t: ITestimonial) => {
    setActiveTestimonial({ ...t });
    setIsEditing(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await TestimonialService.deleteTestimonial(deleteTarget.id);
      if (res.success) {
        showToast(`Testimonial from "${deleteTarget.name}" deleted permanently`, 'success');
        setTestimonials((prev) => prev.filter((item) => (item._id || item.id) !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        showToast(res.message || 'Failed to delete testimonial', 'error');
      }
    } catch {
      showToast('Failed to delete testimonial', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTestimonial || !activeTestimonial.name || !activeTestimonial.quote) {
      showToast('Name and quote are required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const id = activeTestimonial._id || activeTestimonial.id;
      if (id) {
        const res = await TestimonialService.updateTestimonial(id, activeTestimonial);
        if (res.success) {
          showToast('Testimonial updated', 'success');
          setIsEditing(false);
          loadTestimonials();
        }
      } else {
        const res = await TestimonialService.createTestimonial(activeTestimonial);
        if (res.success) {
          showToast('Testimonial created', 'success');
          setIsEditing(false);
          loadTestimonials();
        }
      }
    } catch {
      showToast('Failed to save testimonial', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2] uppercase tracking-tight">
            Client Testimonials
          </h1>
          <p className="text-xs font-mono text-[#888882] mt-1">
            Executive recommendations, client feedback, and partnership endorsements
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenNew} icon={<Plus className="w-4 h-4" />}>
          ADD TESTIMONIAL
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => {
          const id = t._id || t.id || '';
          return (
            <div
              key={id}
              className="p-6 bg-[#0D0D0D] border border-[#242424] rounded-sm flex flex-col justify-between"
            >
              <div>
                <Quote className="w-6 h-6 text-[#C9A769] mb-4" />
                <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#1C1C1C] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {t.avatarUrl ? (
                    <img
                      src={t.avatarUrl}
                      alt={t.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#2A2A2A]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#777772]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-[#F5F5F2]">{t.name}</div>
                    <div className="text-[10px] text-[#888882]">{t.role} · {t.company}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 text-[#888882] hover:text-[#C9A769] cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(id, t.name)}
                    className="p-1.5 text-rose-400/70 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isEditing && activeTestimonial && (
        <AdminModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          title={activeTestimonial._id ? 'Edit Testimonial' : 'New Testimonial'}
          subtitle="Manage client review attribution, quote excerpt, and avatar media"
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                CANCEL
              </Button>
              <Button
                type="submit"
                form="testimonial-form"
                variant="primary"
                size="sm"
                isLoading={isSaving}
                icon={<Save className="w-3.5 h-3.5" />}
              >
                SAVE TESTIMONIAL
              </Button>
            </div>
          }
        >
          <form id="testimonial-form" onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-[#A0A09B] mb-1">Client Name *</label>
              <input
                type="text"
                required
                value={activeTestimonial.name || ''}
                onChange={(e) => setActiveTestimonial({ ...activeTestimonial, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono uppercase text-[#A0A09B] mb-1">Role / Title</label>
                <input
                  type="text"
                  value={activeTestimonial.role || ''}
                  onChange={(e) => setActiveTestimonial({ ...activeTestimonial, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
                />
              </div>
              <div>
                <label className="block font-mono uppercase text-[#A0A09B] mb-1">Company</label>
                <input
                  type="text"
                  value={activeTestimonial.company || ''}
                  onChange={(e) => setActiveTestimonial({ ...activeTestimonial, company: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A0A09B] mb-1">Quote / Review *</label>
              <textarea
                rows={4}
                required
                value={activeTestimonial.quote || ''}
                onChange={(e) => setActiveTestimonial({ ...activeTestimonial, quote: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
              />
            </div>

            <div>
              <ImagePicker
                label="Client Avatar Photo"
                value={activeTestimonial.avatarUrl || ''}
                onChange={(url) => setActiveTestimonial({ ...activeTestimonial, avatarUrl: url })}
                helperText="Select or upload a headshot photo for the client testimonial."
              />
            </div>
          </form>
        </AdminModal>
      )}

      {/* In-App Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Testimonial"
        itemType="client testimonial"
        itemName={deleteTarget?.name}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
