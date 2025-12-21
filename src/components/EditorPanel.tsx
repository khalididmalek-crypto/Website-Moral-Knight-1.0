import React, { useEffect, useState } from 'react';
import { TileData, ContentType } from '../types';
import { X, Check, Upload, Link } from 'lucide-react';
import { SPACING } from '../constants';

interface Props {
  tile: TileData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTile: TileData) => void;
  allTiles: TileData[];
  onSelectTile: (id: string) => void;
}

export const EditorPanel: React.FC<Props> = ({
  tile,
  isOpen,
  onClose,
  onSave,
  allTiles,
  onSelectTile,
}) => {
  const [formData, setFormData] = useState<TileData | null>(null);

  useEffect(() => {
    if (tile) {
      setFormData({ ...tile });
    }
  }, [tile]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof TileData | 'type', value: unknown) => {
    setFormData((prev) => {
      if (!prev) return null;

      if (field === 'type') {
        const newType = value as ContentType;

        let newTitle = prev.title;
        switch (newType) {
          case ContentType.PDF:
            newTitle = 'PDF DOCUMENT';
            break;
          case ContentType.QUOTE:
            newTitle = 'KEY QUOTE';
            break;
          case ContentType.SLIDES:
            newTitle = 'PRESENTATION';
            break;
          case ContentType.IMAGE:
            newTitle = 'FIGURE';
            break;
          case ContentType.VIDEO:
            newTitle = 'VIDEO SOURCE';
            break;
          case ContentType.TEXT:
            newTitle = 'NOTES';
            break;
          case ContentType.CONTACT:
            newTitle = prev.title || 'CONTACT';
            break;
          default:
            break;
        }

        return {
          ...prev,
          type: newType,
          title: newTitle,
          content: {
            src: '',
            text: '',
            caption: '',
            author: '',
          },
        };
      }

      return { ...prev, [field]: value } as TileData;
    });
  };

  const handleContentChange = (
    field: keyof TileData['content'],
    value: string,
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        content: { ...prev.content, [field]: value, lastModified: Date.now() },
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && formData) {
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          title: file.name.split('.')[0]?.toUpperCase() ?? prev.title,
          content: {
            ...prev.content,
            src: objectUrl,
            caption: 'Local File',
          },
        };
      });
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-white border-l border-grid-line transition-transform duration-300 z-[100] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.05)]`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between ${SPACING.MODAL_HEADER_PADDING} border-b border-grid-line`}>
        <div>
          <h2 className="font-sans font-semibold text-sm uppercase tracking-widest text-text-main">
            Configure Tile
          </h2>
          <div className="flex gap-2 mt-2 overflow-x-auto pb-2 w-80 no-scrollbar">
            {allTiles.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTile(t.id)}
                className={`w-6 h-6 flex items-center justify-center text-[10px] font-mono border ${
                  t.id === formData.id
                    ? 'bg-text-main text-white border-text-main'
                    : 'text-gray-400 border-gray-200 hover:border-text-main'
                }`}
              >
                {t.index + 1}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X size={20} strokeWidth={1} />
        </button>
      </div>

      {/* Form */}
      <div className={`flex-1 overflow-y-auto ${SPACING.FORM_PADDING} ${SPACING.FORM_SPACING}`}>
        <div className="space-y-2">
          <label className="block font-mono text-xs text-gray-500 uppercase tracking-widest">
            Tile Label
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full bg-bg-app border-b border-grid-line ${SPACING.INPUT_PADDING} font-mono text-sm focus:border-text-main outline-none transition-colors rounded-none placeholder-gray-300`}
            placeholder="E.G. FIGURE 1"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-mono text-xs text-gray-500 uppercase tracking-widest">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as ContentType)}
            className={`w-full bg-bg-app border-b border-grid-line ${SPACING.INPUT_PADDING} font-mono text-sm focus:border-text-main outline-none transition-colors appearance-none rounded-none cursor-pointer`}
          >
            {Object.values(ContentType).map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-6 border-t border-grid-line">
          <label className="block font-mono text-xs text-text-main font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
            <Link size={12} /> Content Source
          </label>

          <div className="space-y-6">
            {(formData.type === ContentType.IMAGE ||
              formData.type === ContentType.PDF ||
              formData.type === ContentType.VIDEO) && (
              <div className="group border border-dashed border-gray-300 hover:border-text-main hover:bg-gray-50 p-4 transition-colors text-center cursor-pointer relative">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
                <Upload
                  size={20}
                  className="mx-auto mb-2 text-gray-400 group-hover:text-text-main"
                />
                <span className="block font-mono text-xs uppercase text-gray-500 group-hover:text-text-main">
                  Drag or Click to Upload
                </span>
              </div>
            )}

            {(formData.type !== ContentType.TEXT &&
              formData.type !== ContentType.QUOTE) && (
              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-gray-400 uppercase">
                  Or Paste Link (URL)
                </label>
                <input
                  type="text"
                  value={('src' in formData.content ? formData.content.src : '') ?? ''}
                  onChange={(e) => {
                    if ('src' in formData.content) {
                      setFormData(prev => prev ? { ...prev, content: { ...prev.content, src: e.target.value } } : null);
                    }
                  }}
                  placeholder="https://..."
                  className={`w-full bg-bg-app border-b border-grid-line ${SPACING.INPUT_PADDING} font-mono text-xs focus:border-text-main outline-none`}
                />
              </div>
            )}

            {(formData.type === ContentType.TEXT ||
              formData.type === ContentType.QUOTE ||
              formData.type === ContentType.PDF) && (
              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-gray-400 uppercase">
                  {formData.type === ContentType.QUOTE ? 'Quote Text' : 'Content / Description'}
                </label>
                <textarea
                  rows={10}
                  value={('text' in formData.content ? formData.content.text : '') ?? ''}
                  onChange={(e) => {
                    if ('text' in formData.content) {
                      setFormData(prev => prev ? { ...prev, content: { ...prev.content, text: e.target.value } } : null);
                    }
                  }}
                  className={`w-full bg-white border border-grid-line ${SPACING.INPUT_PADDING} font-mono text-sm focus:border-text-main outline-none resize-none leading-relaxed`}
                  placeholder="Type text here..."
                />
              </div>
            )}

            {formData.type === ContentType.QUOTE && (
              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-gray-400 uppercase">
                  Author
                </label>
                <input
                  type="text"
                  value={('author' in formData.content ? formData.content.author : '') ?? ''}
                  onChange={(e) => {
                    if ('author' in formData.content) {
                      setFormData(prev => prev ? { ...prev, content: { ...prev.content, author: e.target.value } } : null);
                    }
                  }}
                  className={`w-full bg-bg-app border-b border-grid-line ${SPACING.INPUT_PADDING} font-mono text-sm focus:border-text-main outline-none`}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-mono text-[10px] text-gray-400 uppercase">
                Bottom Caption
              </label>
              <input
                type="text"
                value={formData.content.caption ?? ''}
                onChange={(e) => handleContentChange('caption', e.target.value)}
                className={`w-full bg-bg-app border-b border-grid-line ${SPACING.INPUT_PADDING} font-mono text-sm focus:border-text-main outline-none`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`${SPACING.MODAL_FOOTER_PADDING} border-t border-grid-line bg-bg-app`}>
        <button
          type="button"
          onClick={() => onSave(formData)}
          className="flex items-center justify-center w-full gap-3 bg-text-main text-white py-3 px-4 font-mono text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          <Check size={16} />
          <span>Apply Changes</span>
        </button>
      </div>
    </div>
  );
};


