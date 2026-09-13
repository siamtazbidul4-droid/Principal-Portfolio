import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Layers } from 'lucide-react';
import { ServiceItemService } from '../../services/service.service';
import { IService } from '../../types';
import { Button } from '../../components/ui/Button';
import { DeleteConfirmModal } from '../../components/ui/DeleteConfirmModal';
import { AdminModal } from '../../components/ui/AdminModal';
import { useToast } from '../../context/ToastContext';

export function AdminServices() {
  const { showToast } = useToast();
  const [services, setServices] = useState<IService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeService, setActiveService] = useState<Partial<IService> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const res = await ServiceItemService.getAllAdminServices();
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch {
      showToast('Failed to load services', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNew = () => {
    setActiveService({
      title: '',
      shortDescription: '',
      detailedDescription: '',
      icon: 'Layers',
      features: ['TypeScript strict typing', 'Database optimization'],
      deliverables: ['Production code repository', 'Architecture spec'],
      order: services.length + 1,
      published: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (s: IService) => {
    setActiveService({ ...s });
    setIsEditing(true);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await ServiceItemService.deleteService(deleteTarget.id);
      if (res.success) {
        showToast(`Service "${deleteTarget.title}" deleted permanently`, 'success');
        setServices((prev) => prev.filter((item) => (item._id || item.id) !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        showToast(res.message || 'Failed to delete service', 'error');
      }
    } catch {
      showToast('Failed to delete service', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService || !activeService.title) {
      showToast('Title is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const id = activeService._id || activeService.id;
      if (id) {
        const res = await ServiceItemService.updateService(id, activeService);
        if (res.success) {
          showToast('Service updated', 'success');
          setIsEditing(false);
          loadServices();
        }
      } else {
        const res = await ServiceItemService.createService(activeService);
        if (res.success) {
          showToast('Service created', 'success');
          setIsEditing(false);
          loadServices();
        }
      }
    } catch {
      showToast('Failed to save service', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2] uppercase tracking-tight">
            Consultancy Services
          </h1>
          <p className="text-xs font-mono text-[#888882] mt-1">
            Configure technical capabilities, deliverables, and service offerings
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenNew} icon={<Plus className="w-4 h-4" />}>
          ADD SERVICE
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => {
          const id = s._id || s.id || '';
          return (
            <div
              key={id}
              className="p-6 bg-[#0D0D0D] border border-[#242424] rounded-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-[#141414] border border-[#262626] rounded-sm text-[#C9A769]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[10px] text-[#666662]">#{s.order}</span>
                </div>

                <h3 className="text-lg font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-[#969691] leading-relaxed mb-4">
                  {s.shortDescription}
                </p>

                <div className="space-y-1 pt-3 border-t border-[#1C1C1C]">
                  {s.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="text-[11px] text-[#B0B0AB] flex items-center gap-1.5">
                      <span className="text-[#C9A769]">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-[#1C1C1C] flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    s.published ? 'text-emerald-400 bg-emerald-950/30' : 'text-amber-400 bg-amber-950/30'
                  }`}
                >
                  {s.published ? 'Active' : 'Hidden'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 text-[#888882] hover:text-[#C9A769] cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(id, s.title)}
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

      {isEditing && activeService && (
        <AdminModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          title={activeService._id ? 'Edit Service' : 'Add New Service'}
          subtitle="Define engineering capabilities, deliverables, and features"
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                CANCEL
              </Button>
              <Button
                type="submit"
                form="service-form"
                variant="primary"
                size="sm"
                isLoading={isSaving}
                icon={<Save className="w-3.5 h-3.5" />}
              >
                SAVE SERVICE
              </Button>
            </div>
          }
        >
          <form id="service-form" onSubmit={handleSave} className="space-y-5 text-xs">
            <div>
              <label className="block font-mono uppercase text-[#A0A09B] mb-1">Service Title *</label>
              <input
                type="text"
                required
                value={activeService.title || ''}
                onChange={(e) => setActiveService({ ...activeService, title: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A0A09B] mb-1">Short Description *</label>
              <textarea
                rows={2}
                required
                value={activeService.shortDescription || ''}
                onChange={(e) => setActiveService({ ...activeService, shortDescription: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A0A09B] mb-1">Detailed Description</label>
              <textarea
                rows={3}
                value={activeService.detailedDescription || ''}
                onChange={(e) => setActiveService({ ...activeService, detailedDescription: e.target.value })}
                placeholder="In-depth breakdown of architectural methodology and technology execution..."
                className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A0A09B] mb-1">
                Features & Capabilities (Comma Separated)
              </label>
              <input
                type="text"
                value={(activeService.features || []).join(', ')}
                onChange={(e) =>
                  setActiveService({
                    ...activeService,
                    features: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#A0A09B] mb-1">
                Deliverables (Comma Separated)
              </label>
              <input
                type="text"
                value={(activeService.deliverables || []).join(', ')}
                onChange={(e) =>
                  setActiveService({
                    ...activeService,
                    deliverables: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="published-service"
                checked={!!activeService.published}
                onChange={(e) => setActiveService({ ...activeService, published: e.target.checked })}
                className="rounded border-[#333333]"
              />
              <label htmlFor="published-service" className="font-mono text-[#D4D4D0]">
                Published on Public Site
              </label>
            </div>
          </form>
        </AdminModal>
      )}

      {/* In-App Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Service Capability"
        itemType="service capability"
        itemName={deleteTarget?.title}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
