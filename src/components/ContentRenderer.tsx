import React, { useState } from 'react';
import Image from 'next/image';
import { TileData, ContentType, isPDFContent, isSlidesContent, isImageContent, isVideoContent, isQuoteContent, isTextContent } from '../types';
import { PlayCircle } from 'lucide-react';
import { ContactForm } from './ContactForm';
import { LoadingSpinner } from './LoadingSpinner';
import { sanitizeHTML } from '../lib/sanitize';
import { sanitizeURL } from '../lib/urlValidation';
import { SPACING } from '../constants';

interface Props {
  data: TileData;
  className?: string;
  mode: 'preview' | 'fullscreen';
  typingComplete?: boolean;
  onClose?: () => void;
}

export const ContentRenderer = React.memo<Props>(
  ({
    data,
    className = '',
    mode,
    typingComplete = false,
    onClose,
  }) => {
    const { type, content } = data;
    const isPreview = mode === 'preview';

    const baseStyles = `w-full h-full ${mode === 'fullscreen' ? 'transition-none' : 'transition-all duration-500'
      }`;
    const mediaStyles = `${baseStyles} object-cover grayscale contrast-125`;
    const iframeStyles = `${baseStyles} border-none grayscale contrast-125`;

    const previewPointerEvents = isPreview ? 'pointer-events-none' : 'pointer-events-auto';

    const renderPlaceholder = () => (
      <div
        className={`flex flex-col items-center justify-center h-full w-full text-gray-300 group-hover:bg-transparent ${isPreview ? 'scale-75' : ''
          } ${typingComplete ? 'bg-transparent' : 'bg-[#F7F7F7]'}`}
      />
    );

    const renderEmptyState = () => (
      <div
        className={`h-full w-full group-hover:bg-transparent flex items-center justify-center ${className} ${typingComplete ? 'bg-transparent' : 'bg-[#F7F7F7]'
          }`}
      />
    );

    switch (type) {
      case ContentType.PDF: {
        if (!isPDFContent(content, type) || !content.src) {
          return renderEmptyState();
        }

        const sanitizedSrc = sanitizeURL(content.src);
        if (!sanitizedSrc) {
          return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 font-mono text-xs uppercase">
              <span>Ongeldige PDF URL</span>
            </div>
          );
        }

        const pdfSrc = isPreview
          ? `${sanitizedSrc}#toolbar=0&navpanes=0&scrollbar=0`
          : sanitizedSrc;

        const PDFWithLoading: React.FC = () => {
          const [isLoading, setIsLoading] = useState(true);

          return (
            <div
              className={`h-full w-full group-hover:bg-transparent relative overflow-hidden ${className} ${typingComplete ? 'bg-transparent' : 'bg-white'
                }`}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                  <LoadingSpinner size="lg" aria-label="PDF laden" />
                </div>
              )}
              <iframe
                src={pdfSrc}
                className={`${iframeStyles} ${previewPointerEvents} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                title={data.title}
                onLoad={() => setIsLoading(false)}
              />
              {isPreview && <div className="absolute inset-0 z-10 bg-transparent" />}
            </div>
          );
        };
        return <PDFWithLoading />;
      }

      case ContentType.QUOTE:
        if (!isQuoteContent(content, type)) {
          return renderEmptyState();
        }
        return (
          <div
            className={`flex flex-col items-center justify-center h-full text-center group-hover:bg-transparent ${className} ${isPreview ? SPACING.QUOTE_PADDING_PREVIEW : SPACING.QUOTE_PADDING_FULLSCREEN
              } ${typingComplete ? 'bg-transparent' : 'bg-transparent'}`}
          >
            <blockquote
              className={`font-mono uppercase tracking-widest text-text-main ${isPreview ? 'text-xs line-clamp-4' : 'text-2xl leading-relaxed'
                }`}
            >
              {content.text}
            </blockquote>
            {content.author && (
              <cite
                className={`block font-mono text-gray-500 not-italic uppercase tracking-widest mt-4 ${isPreview ? 'text-[10px]' : 'text-sm md:text-lg mt-12'
                  }`}
              >
                &mdash; {content.author}
              </cite>
            )}
          </div>
        );

      case ContentType.SLIDES: {
        if (!isSlidesContent(content, type) || !content.src) {
          return renderEmptyState();
        }

        const sanitizedSrc = sanitizeURL(content.src);
        if (!sanitizedSrc) {
          return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 font-mono text-xs uppercase">
              <span>Ongeldige presentatie URL</span>
            </div>
          );
        }

        const slideSrc = isPreview
          ? `${sanitizedSrc}#toolbar=0&navpanes=0&scrollbar=0`
          : sanitizedSrc;

        const SlidesWithLoading: React.FC = () => {
          const [isLoading, setIsLoading] = useState(true);

          return (
            <div
              className={`h-full w-full group-hover:bg-transparent relative ${className} ${typingComplete ? 'bg-transparent' : 'bg-gray-100'
                }`}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                  <LoadingSpinner size="lg" aria-label="Presentatie laden" />
                </div>
              )}
              <iframe
                src={slideSrc}
                className={`${iframeStyles} ${previewPointerEvents} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                title={data.title}
                allowFullScreen
                onLoad={() => setIsLoading(false)}
              />
              {isPreview && <div className="absolute inset-0 z-10 bg-transparent" />}
            </div>
          );
        };
        return <SlidesWithLoading />;
      }

      case ContentType.IMAGE:
        if (isImageContent(content, type) && content.src) {
          // Allow data URLs and blob URLs for images (from file uploads)
          const imageSrc = content.src.startsWith('data:') || content.src.startsWith('blob:')
            ? content.src
            : sanitizeURL(content.src);

          if (!imageSrc) {
            return (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 font-mono text-xs uppercase">
                <span>Ongeldige afbeelding URL</span>
              </div>
            );
          }

          const ImageWithLoading: React.FC = () => {
            const [isLoading, setIsLoading] = useState(true);
            const [hasError, setHasError] = useState(false);

            return (
              <div
                className={`h-full w-full group-hover:bg-transparent flex items-center justify-center overflow-hidden relative ${className} ${typingComplete ? 'bg-transparent' : 'bg-white'
                  }`}
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <LoadingSpinner size="md" aria-label="Afbeelding laden" />
                  </div>
                )}
                {hasError ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 font-mono text-xs uppercase">
                    <span>Afbeelding kon niet worden geladen</span>
                  </div>
                ) : (
                  <Image
                    src={imageSrc}
                    alt={('alt' in content ? content.alt : undefined) || content.caption || `Afbeelding voor ${data.title}`}
                    className={`max-w-full max-h-full ${mediaStyles} ${isLoading ? 'opacity-0' : 'animate-beam-in'}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={!isPreview}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      setIsLoading(false);
                      setHasError(true);
                    }}
                  />
                )}
                {!isPreview && content.caption && (
                  <div className={`absolute ${SPACING.CAPTION_BOTTOM} left-0 right-0 text-center font-mono text-xs text-gray-500 uppercase tracking-wider bg-white/90 ${SPACING.CAPTION_PADDING_Y} backdrop-blur-sm border-t border-gray-100`}>
                    {content.caption}
                  </div>
                )}
              </div>
            );
          };
          return <ImageWithLoading />;
        }
        return renderEmptyState();

      case ContentType.VIDEO:
        if (isVideoContent(content, type) && content.src) {
          // Allow blob URLs for direct video files
          let videoSrc = content.src.startsWith('blob:')
            ? content.src
            : sanitizeURL(content.src);

          if (!videoSrc) {
            return (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 font-mono text-xs uppercase">
                <span>Ongeldige video URL</span>
              </div>
            );
          }

          // Normalize YouTube URLs
          if (videoSrc.includes('youtube.com/watch?v=')) {
            videoSrc = videoSrc.replace('watch?v=', 'embed/');
          }

          if (videoSrc.includes('youtu.be/')) {
            videoSrc = videoSrc.replace('youtu.be/', 'youtube.com/embed/');
          }

          const isDirectFile =
            !videoSrc.includes('youtube') && !videoSrc.includes('vimeo');

          if (isDirectFile) {
            return (
              <div
                className={`h-full w-full group-hover:bg-transparent relative flex items-center justify-center overflow-hidden ${className} ${typingComplete ? 'bg-transparent' : 'bg-[#F7F7F7]'
                  }`}
              >
                <video
                  src={videoSrc}
                  className={mediaStyles}
                  controls={!isPreview}
                  autoPlay={isPreview}
                  muted={isPreview}
                  loop={isPreview}
                  playsInline
                />
                {isPreview && (
                  <div className="absolute inset-0 bg-white opacity-80 pointer-events-none mix-blend-hard-light" />
                )}
              </div>
            );
          }

          if (isPreview) {
            return (
              <div
                className={`h-full w-full group-hover:bg-transparent relative overflow-hidden flex items-center justify-center ${className} ${typingComplete ? 'bg-transparent' : 'bg-[#F7F7F7]'
                  }`}
              >
                <div className="bg-white/80 rounded-full p-2 shadow-sm backdrop-blur-sm">
                  <PlayCircle size={24} className="text-gray-800 opacity-80" />
                </div>
              </div>
            );
          }

          return (
            <div
              className={`h-full w-full group-hover:bg-transparent relative overflow-hidden ${className} ${typingComplete ? 'bg-transparent' : 'bg-[#F7F7F7]'
                }`}
            >
              <iframe
                src={`${videoSrc}${videoSrc.includes('?') ? '&' : '?'
                  }autoplay=${isPreview ? 1 : 0}&mute=${isPreview ? 1 : 0}&controls=${isPreview ? 0 : 1
                  }&loop=1&playlist=${videoSrc.split('/').pop()}`}
                title={data.title}
                className={`${iframeStyles} ${previewPointerEvents}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute inset-0 bg-white opacity-80 pointer-events-none z-20 mix-blend-hard-light" />
              {isPreview && <div className="absolute inset-0 z-10 bg-transparent" />}
            </div>
          );
        }

        if (isPreview) {
          return null;
        }

        return renderPlaceholder();

      case ContentType.CONTACT:
        return (
          <ContactForm
            className={className}
            mode={mode}
            onClose={onClose}
          />
        );

      case ContentType.BLOG:
        // Blog tile - render empty state with transparent background
        // The content is shown in FullscreenView
        return (
          <div className="h-full w-full bg-transparent" />
        );

      case ContentType.TEXT:
        if (!isTextContent(content, type) || !content.text) {
          return renderEmptyState();
        }
        const sanitizedText = sanitizeHTML(content.text);
        return (
          <div
            className={`w-full group-hover:bg-transparent overflow-hidden ${className} ${isPreview
              ? `h-full ${data.id.startsWith('serv-') ? 'flex flex-col justify-center' : ''} ` + (data.id === 'tile-1'
                ? 'pt-24 px-4 pb-4 md:pt-32 md:px-6 md:pb-6' // Custom padding for tile-1 to move text down
                : SPACING.TEXT_PADDING_PREVIEW)
              : `h-auto max-h-[80vh] ${SPACING.TEXT_PADDING_FULLSCREEN} overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']`
              } ${typingComplete ? 'bg-transparent' : 'bg-transparent'}`}
          >
            {!isPreview && data.id === 'tile-1' && (
              <h2 className="text-[#37422F] font-bold text-xl uppercase tracking-wider mb-4 max-w-3xl mx-auto font-sans">
                AI die mensen schaadt
              </h2>
            )}

            <div
              className={`${data.id === 'tile-1' ? 'font-mono text-[9.5px]' : 'font-mono'
                } text-gray-800 whitespace-pre-wrap ${isPreview
                  ? data.id === 'tile-1'
                    ? 'text-[13.5px] leading-snug line-clamp-[8]'
                    : 'text-[13.5px] leading-snug line-clamp-[8]'
                  : `text-sm md:text-base leading-relaxed max-w-3xl mx-auto pt-12 md:pt-16 text-justify`
                }`}
              dangerouslySetInnerHTML={{ __html: sanitizedText }}
            />
          </div>
        );

      default:
        return renderPlaceholder();
    }
  },
);

ContentRenderer.displayName = 'ContentRenderer';


