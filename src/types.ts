export enum ContentType {
  PDF = 'PDF',
  QUOTE = 'QUOTE',
  SLIDES = 'SLIDES',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  CONTACT = 'CONTACT',
  BLOG = 'BLOG',
}

// Base content interface
interface BaseTileContent {
  caption?: string;
  lastModified?: number;
}

// Discriminated unions for type-safe content
export type PDFContent = BaseTileContent & {
  src: string;
  text?: string; // Optional description
};

export type QuoteContent = BaseTileContent & {
  text: string;
  author?: string;
};

export type SlidesContent = BaseTileContent & {
  src: string;
};

export type ImageContent = BaseTileContent & {
  src: string;
  alt?: string;
};

export type VideoContent = BaseTileContent & {
  src: string;
};

export type TextContent = BaseTileContent & {
  text: string;
};

export type ContactContent = BaseTileContent & {
  text?: string;
};

export type BlogContent = BaseTileContent & {
  text: string;
};

// Union type for all content types
export type TileContent =
  | PDFContent
  | QuoteContent
  | SlidesContent
  | ImageContent
  | VideoContent
  | TextContent
  | ContactContent
  | BlogContent;

// Type guards for type narrowing
export const isPDFContent = (content: TileContent, type: ContentType): content is PDFContent =>
  type === ContentType.PDF && 'src' in content;

export const isQuoteContent = (content: TileContent, type: ContentType): content is QuoteContent =>
  type === ContentType.QUOTE && 'text' in content;

export const isSlidesContent = (content: TileContent, type: ContentType): content is SlidesContent =>
  type === ContentType.SLIDES && 'src' in content;

export const isImageContent = (content: TileContent, type: ContentType): content is ImageContent =>
  type === ContentType.IMAGE && 'src' in content;

export const isVideoContent = (content: TileContent, type: ContentType): content is VideoContent =>
  type === ContentType.VIDEO && 'src' in content;

export const isTextContent = (content: TileContent, type: ContentType): content is TextContent =>
  type === ContentType.TEXT && 'text' in content;

export const isContactContent = (content: TileContent, type: ContentType): content is ContactContent =>
  type === ContentType.CONTACT;

export const isBlogContent = (content: TileContent, type: ContentType): content is BlogContent =>
  type === ContentType.BLOG && 'text' in content;

export interface TileData {
  id: string;
  index: number; // For order
  title: string;
  type: ContentType;
  content: TileContent;
  version?: number; // Used to force re-render/animation on update
  fillColor?: string;
  disableHighlight?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  content: string;
}


