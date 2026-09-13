import React, { useEffect, useState } from 'react';
import { Save, Settings, ShieldCheck, Mail, Globe } from 'lucide-react';
import { SettingsService } from '../../services/settings.service';
import { ISiteSettings } from '../../types';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export function AdminSettings() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await SettingsService.getPublicSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch {
      showToast('Failed to load site settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const res = await SettingsService.updateSettings(settings);
      if (res.success) {
        showToast('Site settings updated successfully', 'success');
      } else {
        showToast(res.message || 'Failed to update settings', 'error');
      }
    } catch {
      showToast('Network error while updating settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return <div className="p-8 text-xs font-mono text-[#888882]">Loading configuration...</div>;
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="pb-6 border-b border-[#1E1E1E]">
        <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2] uppercase tracking-tight">
          Global Studio Settings
        </h1>
        <p className="text-xs font-mono text-[#888882] mt-1">
          Configure availability status, hero messaging, contact endpoints, and SEO metadata
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs bg-[#0D0D0D] border border-[#242424] p-8 rounded-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
              Engineer / Studio Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
            />
          </div>

          <div>
            <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
              Professional Title
            </label>
            <input
              type="text"
              value={settings.professionalTitle}
              onChange={(e) => setSettings({ ...settings, professionalTitle: e.target.value })}
              className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
            Primary Contact Email (Inquiry Target)
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
              Availability Status Tag
            </label>
            <input
              type="text"
              value={settings.availabilityStatus}
              onChange={(e) => setSettings({ ...settings, availabilityStatus: e.target.value })}
              className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
            />
          </div>

          <div>
            <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
              Availability Note
            </label>
            <input
              type="text"
              value={settings.availabilityNote}
              onChange={(e) => setSettings({ ...settings, availabilityNote: e.target.value })}
              className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
            Hero Eyebrow Label
          </label>
          <input
            type="text"
            value={settings.heroEyebrow}
            onChange={(e) => setSettings({ ...settings, heroEyebrow: e.target.value })}
            className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
          />
        </div>

        <div>
          <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
            Hero Heading
          </label>
          <input
            type="text"
            value={settings.heroHeading}
            onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
            className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
          />
        </div>

        <div>
          <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">
            Hero Description Body
          </label>
          <textarea
            rows={3}
            value={settings.heroDescription}
            onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
            className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">GitHub URL</label>
            <input
              type="text"
              value={settings.socialLinks?.github || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, github: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
            />
          </div>

          <div>
            <label className="block font-mono uppercase text-[#A0A09B] mb-1.5">LinkedIn URL</label>
            <input
              type="text"
              value={settings.socialLinks?.linkedin || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-[#121212] border border-[#242424] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] rounded-sm"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[#1E1E1E] flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            icon={<Save className="w-4 h-4" />}
          >
            SAVE CONFIGURATION
          </Button>
        </div>
      </form>
    </div>
  );
}
