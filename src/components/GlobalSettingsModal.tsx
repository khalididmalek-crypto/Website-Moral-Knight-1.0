import React, { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';

interface GlobalSettings {
  projectTitle: string;
  authorName: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: GlobalSettings;
  onSave: (settings: GlobalSettings) => void;
}

export const GlobalSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<GlobalSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md shadow-2xl border border-grid-line">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-grid-line">
          <h2 className="font-sans font-semibold text-sm uppercase tracking-widest text-text-main">
            Global Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} strokeWidth={1} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block font-mono text-xs text-gray-500 uppercase tracking-widest">
              Project Title
            </label>
            <input
              type="text"
              value={formData.projectTitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, projectTitle: e.target.value }))
              }
              className="w-full bg-bg-app border-b border-grid-line p-2 font-mono text-sm focus:border-text-main outline-none transition-colors rounded-none placeholder-gray-300"
              placeholder="Overhead System V1.0"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs text-gray-500 uppercase tracking-widest">
              Author Name / ID
            </label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, authorName: e.target.value }))
              }
              className="w-full bg-bg-app border-b border-grid-line p-2 font-mono text-sm focus:border-text-main outline-none transition-colors rounded-none placeholder-gray-300"
              placeholder="MK"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-grid-line bg-bg-app">
          <button
            type="button"
            onClick={() => onSave(formData)}
            className="flex items-center justify-center w-full gap-3 bg-text-main text-white py-3 px-4 font-mono text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            <Check size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};


