import { TileData, ContentType, TextContent, ContactContent, BlogContent, BlogPost } from './types';

export const THEME = {
  colors: {
    background: '#F4F1EC',
    text: '#111111',
    highlightGreen: '#B6C3AC', // ral-6035-text equivalent or similar
    tileDefault: '#F7F7F7',
    tileHighlight: '#B6C3AC',
    border: '#000000',
    subtleNoise: '#F1E1DB', // Example from tile-1
  },
  fonts: {
    mono: 'monospace', // Tailwinds font-mono
    sans: 'sans-serif',
  },
};

export const INITIAL_TILES: TileData[] = [
  {
    id: 'tile-1',
    index: 0,
    title: 'Wat is het Probleem?',
    type: ContentType.TEXT,
    content: {
      text: '',
    } as TextContent,
    fillColor: '#F1E1DB',
  },
  {
    id: 'tile-2',
    index: 1,
    title: 'Wat is de oplossing?',
    type: ContentType.TEXT,
    content: {
      text: '',
    } as TextContent,
    fillColor: '#B6C3AC',
  },
  {
    id: 'tile-3',
    index: 2,
    title: 'Onze aanpak',
    type: ContentType.TEXT,
    content: {
      text: '',
    } as TextContent,
    fillColor: '#CCD5C6',
  },
  {
    id: 'tile-4',
    index: 3,
    title: 'Onze diensten',
    type: ContentType.TEXT,
    content: {
      text: '',
    } as TextContent,
    disableHighlight: true,
    fillColor: '#AEB5B9',
  },
  {
    id: 'tile-5',
    index: 4,
    title: 'Contact',
    type: ContentType.CONTACT,
    content: {
      text: 'Neem contact op',
    } as ContactContent,
    disableHighlight: true,
    fillColor: '#E9E0D2',
  },
  {
    id: 'tile-6',
    index: 5,
    title: 'Blog',
    type: ContentType.BLOG,
    content: {
      text: 'Gedachten en inzichten over verantwoorde AI',
    } as BlogContent,
    disableHighlight: true,
    fillColor: '#E1EBF5',
  },
];

export const EMPTY_SUB_TILES: TileData[] = Array.from({ length: 6 }, (_, i) => ({
  id: `sub-tile-${i + 1}`,
  index: i,
  title: '',
  type: ContentType.TEXT,
  content: { text: '' },
  fillColor: '#F7F7F7',
  disableHighlight: true,
}));

// Animation & Timing Constants
export const ANIMATION_DELAYS = {
  TILE_STAGGER: 25, // ms delay between tile animations
  TYPEWRITER_SPEED: 2, // base speed for typewriter
  TYPEWRITER_TITLE_SPEED: 10, // speed for tile titles
} as const;

// Spacing Constants (standardized Tailwind spacing scale)
// Based on 4px increments for visual consistency
// Spacing Constants (standardized Tailwind spacing scale)
// Based on 4px increments for visual consistency
export const SPACING = {
  // Grid & Layout
  GRID_GAP: 'gap-4 md:gap-8', // 16px mobile, 32px desktop
  SECTION_GAP: 'gap-6 md:gap-10', // 24px mobile, 40px desktop

  // Container Padding
  CONTAINER_X: 'px-4 md:px-6', // 16px mobile, 24px desktop
  CONTAINER_Y: 'py-6 md:py-10', // 24px mobile, 40px desktop
  CONTAINER_RESPONSIVE_X: 'px-4 md:px-6', // 16px mobile, 24px desktop

  // Tile Spacing
  TILE_PADDING: 'p-4 md:p-6', // 16px mobile, 24px desktop
  TILE_PADDING_PREVIEW: 'p-4 md:p-6', // 16px mobile, 24px desktop
  TILE_PADDING_FULLSCREEN: 'p-6 md:p-12', // 24px mobile, 48px desktop
  TILE_INSET_TOP: 'top-3 md:top-4', // 12px mobile, 16px desktop
  TILE_INSET_LEFT: 'left-3 md:left-4', // 12px mobile, 16px desktop
  TILE_INSET_RIGHT: 'right-3 md:right-4', // 12px mobile, 16px desktop
  TILE_LABEL_PADDING_X: 'px-2 md:px-3', // 8px mobile, 12px desktop
  TILE_LABEL_PADDING_Y: 'py-1 md:py-1.5', // 4px mobile, 6px desktop

  // Content Padding
  CONTENT_PADDING_SM: 'p-3 md:p-4', // 12px mobile, 16px desktop
  CONTENT_PADDING_MD: 'p-4 md:p-6', // 16px mobile, 24px desktop
  CONTENT_PADDING_LG: 'p-6 md:p-8', // 24px mobile, 32px desktop
  CONTENT_PADDING_XL: 'p-8 md:p-12', // 32px mobile, 48px desktop

  // Text Content Specific
  TEXT_PADDING_PREVIEW: 'pt-12 px-4 pb-4 md:pt-16 md:px-6 md:pb-6', // Responsive padding
  TEXT_PADDING_FULLSCREEN: 'px-6 py-6 md:px-12 md:py-8', // Responsive padding

  // Quote Content Specific
  QUOTE_PADDING_PREVIEW: 'p-4 md:p-6', // Responsive padding
  QUOTE_PADDING_FULLSCREEN: 'p-8 md:p-16', // Responsive padding

  // Form & Input Spacing
  FORM_PADDING: 'p-4 md:p-6', // Responsive padding
  FORM_SPACING: 'space-y-4 md:space-y-6', // Responsive spacing
  INPUT_PADDING: 'p-3', // 12px - Input field padding (better touch targets than p-2)
  INPUT_GAP: 'gap-4 md:gap-5', // Responsive gap

  // Modal & Panel Spacing
  MODAL_HEADER_PADDING: 'p-4 md:p-6', // Responsive padding
  MODAL_CONTENT_PADDING: 'p-4 md:p-6', // Responsive padding
  MODAL_FOOTER_PADDING: 'p-4 md:p-6', // Responsive padding
  MODAL_BOTTOM_SPACING: 'pb-8 md:pb-16', // Responsive padding

  // Footer & Utility
  FOOTER_MARGIN: 'mt-6 md:mt-10', // Responsive margin
  FIXED_ELEMENT_INSET: 'bottom-4 right-4 md:bottom-8 md:right-8', // Responsive positioning

  // Image Caption
  CAPTION_PADDING_Y: 'py-2 md:py-3', // Responsive padding
  CAPTION_BOTTOM: 'bottom-4 md:bottom-6', // Responsive positioning
} as const;

// Color Constants (extracted from hardcoded values)
export const A11Y_COLORS = {
  BADGE_BACKGROUND: '#B6C3AC',
  BADGE_TEXT: '#111111',
};

export const COLORS = {
  PRIMARY_GREEN: '#194D25', // ral-6035-text equivalent
  SECONDARY_GREEN: '#37422F', // Used in footer and text
  HIGHLIGHT_GREEN: '#B6C3AC', // Tile highlight color
  BLOG_BACKGROUND: '#E8EDE6', // Blog page background - soft variant of green/grey
  BORDEAUX_RED: '#8B1A3D', // Bordeaux red for hover effects
} as const;

// Form-specific color tokens for consistent theming
export const FORM_COLORS = {
  INPUT_BG: THEME.colors.tileDefault, // #F7F7F7 - Input background
  INPUT_BORDER: '#E2E8F0', // Subtle border for inputs (lighter as requested)
  INPUT_FOCUS: COLORS.PRIMARY_GREEN, // Focus state color
  LABEL_TEXT: COLORS.SECONDARY_GREEN, // Label text color
  ERROR: '#DC2626', // Error color (red-600)
  ERROR_BG: '#FEF2F2', // Error background (red-50)
  ERROR_BORDER: '#FCA5A5', // Error border (red-300)
  SUCCESS_BG: COLORS.HIGHLIGHT_GREEN, // Success background
  SUCCESS_ICON: COLORS.PRIMARY_GREEN, // Success icon color
  TEXT_PRIMARY: THEME.colors.text, // #111111 - Primary text
  TEXT_SECONDARY: COLORS.SECONDARY_GREEN, // Secondary text
  PLACEHOLDER: '#9CA3AF', // Placeholder text (gray-400)
} as const;

// Touch Target Minimum Size (WCAG AA)
export const TOUCH_TARGET_MIN_SIZE = 44; // pixels

// Grid Layout Constants
export const GRID_COLUMNS = {
  MOBILE: 1,
  TABLET: 2,
  DESKTOP: 3,
} as const;

// Blog Posts Data
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'de-uitwassen-van-digitaal-kolonialisme',
    title: 'De uitwassen van digitaal kolonialisme',
    excerpt: 'Grote techbedrijven eigenen zich data en infrastructuur toe op een manier die historische uitbuiting weerspiegelt. Wie profiteert er werkelijk van deze digitale expansie?',
    date: '2026-01-15',
    tag: 'Maatschappij',
    content: `
      <div class="font-mono text-xs md:text-sm leading-snug text-gray-800">
        <p class="mb-3">De roep om technologische vooruitgang overschaduwt vaak de verborgen kosten voor gemeenschappen wereldwijd. Grote techbedrijven eigenen zich data en digitale infrastructuur toe op een manier die historische patronen van uitbuiting weerspiegelt. Lokale waarden en culturele nuances worden hierbij regelmatig genegeerd ten gunste van schaalbaarheid en winst. Dit creëert een nieuwe vorm van afhankelijkheid waarbij soevereiniteit onder druk komt te staan. Het is tijd om kritisch te kijken naar wie er werkelijk profiteert van deze digitale expansie.</p>
        <p class="font-bold mt-4" style="color: #2C3E50">... meer volgt</p>
      </div>
    `,
  },
  {
    id: 'blog-2',
    slug: 'heb-jij-al-een-ai-therapeut',
    title: 'Heb jij al een AI-therapeut?',
    excerpt: 'AI-chatbots worden gepresenteerd als oplossing voor de mentale zorg. Maar kan een algoritme empathie tonen of simuleert het slechts begrip?',
    date: '2026-01-10',
    tag: 'Zorg',
    content: `
      <div class="font-mono text-xs md:text-sm leading-snug text-gray-800">
        <p class="mb-3">De mentale gezondheidszorg staat onder enorme druk en AI-chatbots worden steeds vaker gepresenteerd als dé oplossing. Ze zijn altijd beschikbaar, oordelen niet en kosten een fractie van een menselijke therapeut. Maar kan een algoritme werkelijk empathie tonen of simuleert het slechts begrip? Het risico bestaat dat we kwetsbare mensen overlaten aan systemen die emoties niet daadwerkelijk kunnen doorgronden. We moeten ons afvragen of efficiëntie hier niet ten koste gaat van menselijke verbinding.</p>
        <p class="font-bold mt-4" style="color: #2C3E50">... meer volgt</p>
      </div>
    `,
  },
  {
    id: 'blog-3',
    slug: 'hoe-intelligent-mag-ai-worden',
    title: 'Hoe intelligent mag AI worden?',
    excerpt: 'Wanneer systemen beslissingen nemen over mensenlevens, waar ligt dan de verantwoordelijkheid? We moeten grenzen stellen aan autonome AI.',
    date: '2025-12-20',
    tag: 'Filosofie',
    content: `
      <div class="font-mono text-xs md:text-sm leading-snug text-gray-800">
        <p class="mb-3">De ontwikkeling van kunstmatige intelligentie gaat razendsnel en roept fundamentele vragen op over grenzen. Wanneer systemen beslissingen nemen die mensenlevens beïnvloeden, moeten we weten waar de verantwoordelijkheid ligt. Is er een punt waarop AI te autonoom wordt en onze controle verliest? Het definiëren van de grens tussen behulpzame assistentie en onwenselijke dominantie is cruciaal voor onze toekomst. We moeten nu bepalen welke intelligentie ons dient en welke ons bedreigt.</p>
        <p class="font-bold mt-4" style="color: #2C3E50">... meer volgt</p>
      </div>
    `,
  },
];

export const PROBLEM_TILES: TileData[] = [
  {
    id: 'prob-1',
    index: 0,
    title: 'Commercie boven Publiek Belang',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">Algoritmes sturen onze maatschappelijke infrastructuur aan, van zorg tot sociale zekerheid. Onder druk van commerciële belangen wordt het publiek belang vaak ondergeschikt gemaakt aan winstmaximalisatie. Hierdoor verliest de burger zijn stem en wordt technologie een instrument van uitsluiting in plaats van vooruitgang.</p>',
    } as TextContent,
    fillColor: '#F1E1DB',
  },
  {
    id: 'prob-2',
    index: 1,
    title: 'De Digitale Muur',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">Systemen nemen besluiten over levensbepalende zaken zoals werk en inkomen, maar de logica erachter blijft vaak onzichtbaar. Zonder transparantie staan burgers en werknemers alleen wanneer \'het systeem\' een fout maakt. Er ontstaat een ondoordringbare muur van techniek die grondrechten aantast en kwetsbaren beschadigt.</p>',
    } as TextContent,
    fillColor: '#F1E1DB',
  },
  {
    id: 'prob-3',
    index: 2,
    title: 'De Morele Kreukelzone',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">Professionals worden gereduceerd tot passieve procesbewakers. Zij dragen de juridische verantwoordelijkheid voor besluiten van een machine die zij zelf niet meer volledig kunnen doorgronden. Deze beklemming zorgt ervoor dat werknemers niet kunnen ingrijpen bij evidente misslagen, met reputatieschade en morele schade tot gevolg.</p>',
    } as TextContent,
    fillColor: '#F1E1DB',
  },
  {
    id: 'prob-4',
    index: 3,
    title: 'Onzichtbare Macht',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">Zonder onafhankelijke controle opereren algoritmes in een vacuüm. Mistanden in de samenwerking tussen mens en techniek blijven onopgemerkt totdat het te laat is. Dit gebrek aan toezicht holt de rechtsstaat uit en maakt van burgers proefkonijnen in een digitaliserende samenleving.</p>',
    } as TextContent,
    fillColor: '#F1E1DB',
  },
];

export const SOLUTION_TILES: TileData[] = [
  {
    id: 'sol-1',
    index: 0,
    title: 'Onafhankelijke Waakhond',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">Moral Knight waarborgt de menselijke regie. Wij toetsen AI-toepassingen in het publieke domein op begrijpelijkheid en rechtvaardigheid. Onze audits zorgen ervoor dat technologie de burger dient en dat besluiten voor iedereen betwistbaar blijven. Wij brengen de menselijke maat terug in de machine.</p>',
    } as TextContent,
    fillColor: '#B6C3AC',
  },
  {
    id: 'sol-2',
    index: 1,
    title: 'Harde Bewijslast',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">Onze audits zijn geen vrijblijvende adviezen, maar leveren de feiten die nodig zijn om onjuiste besluitvorming bloot te leggen. Wij bieden burgers en organisaties het fundament om effectief weerstand te bieden tegen falende systemen. Zo beschermen we de integriteit van de digitaliserende rechtsstaat.</p>',
    } as TextContent,
    fillColor: '#B6C3AC',
  },
  {
    id: 'sol-3',
    index: 2,
    title: 'Professionele Integriteit',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">Wij geven de macht terug aan de werknemer. Door onze toetsing behouden professionals diepgaand inzicht in de werking van hun systemen. In plaats van een \'aanhangsel\' van de techniek te zijn, blijven zij de baas over de besluiten die zij nemen. Kennis is de beste garantie voor ethisch handelen.</p>',
    } as TextContent,
    fillColor: '#B6C3AC',
  },
  {
    id: 'sol-4',
    index: 3,
    title: 'Permanent Toezicht',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">Ethische principes vertalen wij naar meetbare normen die we gedurende de gehele levenscyclus van een systeem bewaken. Onze \'ethical maintenance\' voorkomt dat AI-systemen na verloop van tijd partijdig of onveilig worden. Wij stoppen niet na de lancering; wij waken zolang de techniek draait.</p>',
    } as TextContent,
    fillColor: '#B6C3AC',
  },
];

export const HOW_TILES: TileData[] = [
  {
    id: 'how-1',
    index: 0,
    title: 'Toetsing',
    type: ContentType.TEXT,
    content: {
      text: `<div class="flex flex-col items-start text-left">
        <h4 class="font-bold text-base mb-3 uppercase tracking-wider text-[#194D25]">Van ethiek naar harde feiten</h4>
        <p class="text-sm md:text-base leading-relaxed max-w-2xl">Wij vertalen abstracte ethische kaders naar meetbare, technische normen. Door systemen diepgaand te auditeren, leveren wij de feitelijke bewijslast die nodig is voor toezichthouders en de samenleving. Onze toetsing maakt onzichtbare vooroordelen zichtbaar en zorgt dat digitale besluiten voor iedereen begrijpelijk en betwistbaar blijven.</p>
      </div>`,
    } as TextContent,
    fillColor: '#CCD5C6',
  },
  {
    id: 'how-2',
    index: 1,
    title: 'Borging',
    type: ContentType.TEXT,
    content: {
      text: `<div class="flex flex-col items-start text-left">
        <h4 class="font-bold text-base mb-3 uppercase tracking-wider text-[#194D25]">Permanent toezicht op de menselijke maat</h4>
        <p class="text-sm md:text-base leading-relaxed max-w-2xl">De impact van AI verandert continu door nieuwe data. Via 'Ethical Maintenance' bieden wij permanent toezicht op de gehele levenscyclus van een algoritme. Hiermee borgen we de rechtsstaat en geven we professionals de tools om weer regie te voeren. Zo zorgen we dat technologie altijd onder menselijke controle blijft en het publiek belang dient.</p>
      </div>`,
    } as TextContent,
    fillColor: '#CCD5C6',
  },
];

export const SERVICES_TILES: TileData[] = [
  {
    id: 'serv-1',
    index: 0,
    title: 'Stress-test',
    type: ContentType.TEXT,
    content: {
      text: '',
    } as TextContent,
    fillColor: '#AEB5B9',
  },
  {
    id: 'serv-2',
    index: 1,
    title: 'Justice Audit',
    type: ContentType.TEXT,
    content: {
      text: '',
    } as TextContent,
    fillColor: '#AEB5B9',
  },
  {
    id: 'serv-3',
    index: 2,
    title: 'Accountability Check',
    type: ContentType.TEXT,
    content: {
      text: '',
    } as TextContent,
    fillColor: '#AEB5B9',
  },
];

export const SERVICES_SUB_SUB_TILES: Record<string, { title: string, content: string }[]> = {};

export const SERVICES_DETAILS: Record<string, string> = {
  'serv-1': `<div class="flex flex-col items-start text-left"><h4 class="font-bold text-base mb-3 uppercase tracking-wider text-[#194D25]">transparantie en privacy</h4><p class="text-sm md:text-base leading-relaxed max-w-2xl">Onze basistest ten aanzien van publiek vertrouwen. Wij testen of uw AI-besluiten en uitingen voldoende transparant en privacygevoelig zijn. En daarmee of uw toepassing voldoet aan de gangbare normen zoals de EU AI Act of richtlijnen op het vlak van mensenrechten.</p></div>`,
  'serv-2': `<div class="flex flex-col items-start text-left"><h4 class="font-bold text-base mb-3 uppercase tracking-wider text-[#194D25]">bias en rechtvaardigheid</h4><p class="text-sm md:text-base leading-relaxed max-w-2xl">Onze voornaamste test ten aanzien van eerlijkheid. Sluit uw algoritme onbedoeld groepen uit? Wij sporen verborgen vooroordelen (bias) op en toetsen of uw systeem elke burger gelijk behandelt.</p></div>`,
  'serv-3': `<div class="flex flex-col items-start text-left"><h4 class="font-bold text-base mb-3 uppercase tracking-wider text-[#194D25]">menselijke regie</h4><p class="text-sm md:text-base leading-relaxed max-w-2xl">De test van macht en controle. Heeft de mens nog écht de controle? Of zijn er risico's waardoor de organisatie AI-ethiek uit het oog verliest? Wij auditen of uw medewerkers een verkeerd AI-besluit daadwerkelijk kunnen signaleren of herstellen wanneer dat nodig is.</p></div>`
};
