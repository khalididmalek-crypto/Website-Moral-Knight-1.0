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
    slug: 'heeft-nederland-een-ai-gigafabriek-nodig',
    title: 'Heeft Nederland een AI gigafabriek nodig?',
    excerpt: 'Om digitaal soeverein te blijven, moet Nederland investeren in eigen AI-infrastructuur. Maar is een gigafabriek de juiste oplossing?',
    date: '2025-02-15',
    tag: 'Infrastructuur',
    content: `
      <div class="font-mono text-xs md:text-sm leading-snug text-gray-800">
        <p class="mb-3">De roep om strategische autonomie in Europa klinkt steeds luider. Afhankelijkheid van Amerikaanse en Chinese techreuzen maakt ons kwetsbaar. Het idee van een "AI gigafabriek" – een grootschalig centrum voor de ontwikkeling van nationale AI-modellen – wint aan populariteit.</p>
        <p class="mb-3">Voorstanders wijzen op het belang van controle over data en algoritmen. Als we onze eigen infrastructuur bouwen, kunnen we garanderen dat deze voldoet aan onze waarden en wetgeving. Maar critici vrezen een verspilling van middelen in een race die we wellicht niet kunnen winnen op schaal.</p>
        <p>De vraag is niet alleen of we de rekenkracht kunnen bouwen, maar of we de kennis en het talent kunnen vasthouden om deze fabriek te laten draaien. Een slimme samenwerking binnen Europa lijkt de meest haalbare kaart.</p>
      </div>
    `,
  },
  {
    id: 'blog-2',
    slug: 'hoe-maken-we-ai-empathisch',
    title: 'Hoe maken we AI empathisch?',
    excerpt: 'AI kan emoties simuleren, maar is dat hetzelfde als empathie? En wat zijn de risico\'s van machines die doen alsof ze ons begrijpen?',
    date: '2025-02-10',
    tag: 'Ethiek',
    content: `
      <div class="font-mono text-xs md:text-sm leading-snug text-gray-800">
        <p class="mb-3">Emotionele AI is in opkomst. Chatbots reageren "bezorgd" als je zegt dat je ziek bent, en zorgrobots kijken "blij" als je medicijnen neemt. Dit lijkt een vooruitgang in gebruiksvriendelijkheid, maar het roept fundamentele vragen op.</p>
        <p class="mb-3">Empathie vereist bewustzijn en gedeelde menselijke ervaring, iets wat een algoritme per definitie mist. Wat AI doet is simulatie: het herkent patronen en projecteert een gepaste reactie. Het risico is dat mensen zich emotioneel hechten aan systemen die niets terugvoelen.</p>
        <p>Moeten we AI-systemen ontwerpen die empathie veinzen? Of is eerlijkheid over de machinale aard van de interactie uiteindelijk respectvoller naar de menselijke gebruiker? Het antwoord ligt in de balans tussen comfort en transparantie.</p>
      </div>
    `,
  },
  {
    id: 'blog-3',
    slug: 'hoe-intelligent-is-ai',
    title: 'Hoe intelligent is AI?',
    excerpt: 'Generatieve AI verbaast ons dagelijks, maar begrijpt het echt wat het doet? Een kritische blik op de definitie van intelligentie.',
    date: '2025-02-01',
    tag: 'Filosofie',
    content: `
      <div class="font-mono text-xs md:text-sm leading-snug text-gray-800">
        <p class="mb-3">We noemen het "Kunstmatige Intelligentie", maar de manier waarop AI leert verschilt fundamenteel van menselijke intelligentie. Grote taalmodellen zijn in essentie geavanceerde voorspellers van het volgende woord, getraind op enorme bergen tekst.</p>
        <p class="mb-3">Ze hebben geen begrip van de wereld, geen "common sense" en geen intentie. Toch vertonen ze gedrag dat door menigeen als intelligent wordt bestempeld. Dit fenomeen, waarbij we menselijke eigenschappen toedichten aan levenloze objecten, heet antropomorfisme.</p>
        <p>Het gevaar is dat we de capaciteiten van AI overschatten. Als we denken dat het systeem "weet" wat feiten zijn, vertrouwen we het te blindelings. Het erkennen van de grenzen van AI-intelligentie is cruciaal voor een verantwoorde inzet ervan.</p>
      </div>
    `,
  },
];

export const PROBLEM_TILES: TileData[] = [
  {
    id: 'prob-1',
    index: 0,
    title: 'Afhankelijkheid',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">AI-systemen spelen steeds vaker een rol bij besluiten met grote maatschappelijke impact. Hierdoor ontstaat een riskante afhankelijkheid: organisaties verliezen de grip op hun eigen keuzes, terwijl burgers afhankelijk worden van techniek die zij niet kunnen beïnvloeden. Hoewel de organisatie wettelijk altijd verantwoordelijk blijft, ligt de feitelijke macht vaak bij de externe leveranciers die niet transparant zijn. Fouten zijn hierdoor lastig te herstellen en overstappen naar een betere oplossing is vaak complex.</p>',
    } as TextContent,
    fillColor: '#F1E1DB',
  },
  {
    id: 'prob-2',
    index: 1,
    title: 'Partijdigheid',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">AI-systemen zijn niet neutraal want ze leren van data uit het verleden. Als die informatie menselijke vooroordelen of ongelijkheid bevat, neemt de techniek deze patronen onbewust over. Hierdoor kunnen organisaties onbedoeld groepen mensen ongelijk behandelen, terwijl de uitkomst van de computer objectief lijkt. Zonder scherpe controle op deze verborgen patronen worden maatschappelijke verschillen versterkt en komt eerlijke besluitvorming onder druk te staan.</p>',
    } as TextContent,
    fillColor: '#F1E1DB',
  },
  {
    id: 'prob-3',
    index: 2,
    title: 'Ongelijkheid',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">AI-systemen vergroten de afstand tussen organisaties die de techniek inzetten en de mensen die er mee te maken krijgen. Niet iedereen heeft de kennis of middelen om geautomatiseerde informatie of besluiten te begrijpen, laat staan aan te vechten als er iets misgaat. Zonder menselijke waarden en heldere uitleg leidt automatisering tot uitsluiting van groepen die minder digitaal vaardig zijn. Wat bedoeld is als een efficiënte oplossing, kan zo onbedoeld zorgen voor structurele ongelijkheid in de toegang tot zorg, recht of onderwijs.</p>',
    } as TextContent,
    fillColor: '#F1E1DB',
  },
  {
    id: 'prob-4',
    index: 3,
    title: 'Wantrouwen',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">Zodra besluiten met AI onvoldoende transparant of uitlegbaar zijn, verdwijnt het vertrouwen bij zowel medewerkers als de samenleving. Technologie die menselijk lijkt maar niet aanspreekbaar is op fouten, roept veel weerstand op. Wanneer mensen geen mogelijkheid hebben om fouten recht te zetten of verantwoording te eisen, verliest een organisatie haar geloofwaardigheid. Wantrouwen blokkeert de weg naar innovatie: zonder draagvlak is zelfs de meest slimme AI-oplossing gedoemd te mislukken.</p>',
    } as TextContent,
    fillColor: '#F1E1DB',
  },
];

export const SOLUTION_TILES: TileData[] = [
  {
    id: 'sol-1',
    index: 0,
    title: 'REALISTISCH',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">Echte innovatie begint bij een nuchtere blik op wat AI kan en waar de valkuilen liggen. Door vooraf kritisch te toetsen op technische beperkingen en maatschappelijke risico\'s, worden kostbare misstappen en onrealistische verwachtingen voorkomen. Een realistische aanpak erkent waar de techniek tekortschiet of onethisch functioneert. En zorgt ervoor dat AI menselijke taken ondersteunt, zonder dat onbeheersbare systemen de controle overnemen.</p>',
    } as TextContent,
    fillColor: '#B6C3AC',
  },
  {
    id: 'sol-2',
    index: 1,
    title: 'WAARDEVOL',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">AI is nooit neutraal. Ieder systeem bevat bewuste of onbewuste aannames en belangen. Zonder expliciete en doordachte keuzes bepaalt de technologie zelf wat de richting is, wat kan leiden tot resultaten die haaks staan op de goede bedoelingen van een organisatie. Waardevolle AI maakt van publieke waarden, zoals rechtvaardigheid, menselijke waardigheid en inclusie, een halszaak. Waarden moeten leidend zijn in ieder ontwerp en ten dienste staan van de gebruikers. Alleen door de waarden toetsbaar te maken, wordt techniek een instrument dat de samenleving niet onbedoeld beschadigd maar juist versterkt.</p>',
    } as TextContent,
    fillColor: '#B6C3AC',
  },
  {
    id: 'sol-3',
    index: 2,
    title: 'BESLUITVAARDIG',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">Besluitvaardigheid betekent dat de organisatie zelf kiest waar de techniek stopt en menselijke verantwoordelijkheid begint. Dit vertalen wij naar concrete kaders. Waarbij wordt vastgelegd welke besluiten AI nooit zelfstandig mag nemen en waar de ‘human in de loop’ controle uitoefent. Daarnaast is het cruciaal de uitlegbaarheid van een systeem te waarborgen. Achteraf moeten besluiten die door de techniek worden genomen gemotiveerd en gecorrigeerd kunnen worden volgens wet- en regelgeving. Door toezicht en menselijk ingrijpen te integreren voordat systemen live gaan in de praktijk, behoudt de organisatie regie over de maatschappelijk impact en de invloed op het dagelijks leven van mensen.</p>',
    } as TextContent,
    fillColor: '#B6C3AC',
  },
  {
    id: 'sol-4',
    index: 3,
    title: 'VERANTWOORDELIJK',
    type: ContentType.TEXT,
    content: {
      text: '<p class="mb-3">Verantwoordelijkheid betekent dat een organisatie optimale regie voert over de gehele AI-keten. Van de oorspronkelijke trainingsdata tot een uiteindelijke beslissing. Het is niet voldoende om blind te vertrouwen op systemen die te weinig rekening houden met menselijke waarden. De ethiek van een systeem moet technisch meetbaar en controleerbaar zijn conform hedendaagse gangbare standaarden (ISO 42001). Dit vraagt om een proactieve houding: het voortdurend monitoren van systemen op bias en borgen dat er altijd een menselijke mogelijkheid is om in te grijpen of bij te sturen. Alleen door het aantoonbaar meewegen van menselijke waarden in het proces, bouwt een organisatie aan een duurzaam fundament en aan het vertrouwen bij cliënten, medewerkers en de samenleving als geheel.</p>',
    } as TextContent,
    fillColor: '#B6C3AC',
  },
];

export const HOW_TILES: TileData[] = [
  {
    id: 'how-1',
    index: 0,
    title: 'Advies',
    type: ContentType.TEXT,
    content: {
      text: `<div class="flex flex-col items-start text-left">
        <h4 class="font-bold text-base mb-3 uppercase tracking-wider text-[#194D25]">samen de koers bepalen</h4>
        <p class="text-sm md:text-base leading-relaxed max-w-2xl">Innovatie zonder duidelijke koers veroorzaakt onwenselijke risico’s voor organisaties. Zoals klachten en in het ergste geval juridische consequenties. Onze aanpak begint altijd bij het fundament: we bepalen de ethische kaders waarbinnen technologie moet functioneren. In deze fase voeren we de dialoog over de noodzakelijkheid van AI (waarom en waartoe is het noodzakelijk?) en komen we tot een breed gedragen plan van aanpak. Zowel voor bestuurders en beleidsmakers, ontwikkelaars en andere relevante betrokkenen werken we tegelijkertijd aan educatie. Daarbij staat het stellen van de juiste vragen over publieke AI-toepassingen centraal. Over de maatschappelijke impact: waarbij je focust op eerlijke en betrouwbare AI. Hiermee leggen we de basis die regie weer teruggeeft aan de organisatie zelf, zodat investeringen vanaf de eerste dag waardevol, veilig en juridisch houdbaar zijn.</p>
      </div>`,
    } as TextContent,
    fillColor: '#CCD5C6',
  },
  {
    id: 'how-2',
    index: 1,
    title: 'Ontwerp',
    type: ContentType.TEXT,
    content: {
      text: `<div class="flex flex-col items-start text-left">
        <h4 class="font-bold text-base mb-3 uppercase tracking-wider text-[#194D25]">publieke waarden verankeren</h4>
        <p class="text-sm md:text-base leading-relaxed max-w-2xl">Een strategisch plan vraagt om een zorgvuldige vertaling naar de dagelijkse praktijk om echt impact te maken. In de ontwerpfase bouwen we voort op de gestelde kaders door ethische principes om te zetten in concrete spelregels en heldere werkafspraken. We focussen hierbij op de menselijke maat: het inregelen van menselijk toezicht en het borgen van transparantie vanaf de eerste stap. Educatie vormt de kern van dit proces; we trainen teams om risico’s zoals uitsluiting of onduidelijke besluiten zelf tijdig te herkennen en te voorkomen. Door waarden direct te verankeren in de inrichting, creëren we een systeem dat niet alleen voldoet aan de strengste wetgeving, maar ook het vertrouwen van medewerkers en cliënten wint.</p>
      </div>`,
    } as TextContent,
    fillColor: '#CCD5C6',
  },
  {
    id: 'how-3',
    index: 2,
    title: 'Toetsing',
    type: ContentType.TEXT,
    content: {
      text: `<div class="flex flex-col items-start text-left">
        <h4 class="font-bold text-base mb-3 uppercase tracking-wider text-[#194D25]">voortdurend controle uitoefenen</h4>
        <p class="text-sm md:text-base leading-relaxed max-w-2xl">Het toepassen van AI in het publieke domein vraagt om een kritische blik die resultaten toetst in de feitelijke praktijk. Wij meten of systemen in de praktijk doen wat ze behoren te doen en achterhalen waarin de organisatie kan groeien en verbeteren. Elke controle is een leermoment waarbij we feitelijke bevindingen gebruiken om de organisatie te informeren over hoe systemen eerlijker, transparanter en verbeterd kunnen worden naar maatschappelijke normen en waarden en de wet- en regelgeving. Deze aanpak biedt niet alleen de nodige bewijslast voor toezichthouders, maar zorgt ook voor een cultuur van verbetering die de organisatie elke ronde sterker en slimmer maakt. In het geval van onregelmatigheden zoals klachten heb je als organisatie simpelweg een ‘goed verhaal’ nodig waarmee je laat zien dat je streeft naar menswaardige AI.</p>
      </div>`,
    } as TextContent,
    fillColor: '#CCD5C6',
  },
];

export const SERVICES_TILES: TileData[] = [
  {
    id: 'serv-1',
    index: 0,
    title: 'Advies',
    type: ContentType.TEXT,
    content: {
      text: '<ul class="list-disc pl-4 font-mono text-sm leading-relaxed space-y-2"><li>Educatie & AI-geletterdheid</li><li>Risicoanalyse & AI-governance</li></ul>',
    } as TextContent,
    fillColor: '#AEB5B9',
  },
  {
    id: 'serv-2',
    index: 1,
    title: 'Ontwerp',
    type: ContentType.TEXT,
    content: {
      text: '<ul class="list-disc pl-4 font-mono text-sm leading-relaxed space-y-2"><li>Value Sensitive Design</li><li>Co-creatie & mensgericht ontwerp</li></ul>',
    } as TextContent,
    fillColor: '#AEB5B9',
  },
  {
    id: 'serv-3',
    index: 2,
    title: 'Toetsing',
    type: ContentType.TEXT,
    content: {
      text: '<ul class="list-disc pl-4 font-mono text-sm leading-relaxed space-y-2"><li>Ethiek- & impactassessment</li><li>AI-audit & compliance-toets</li></ul>',
    } as TextContent,
    fillColor: '#AEB5B9',
  },
];

export const SERVICES_SUB_SUB_TILES: Record<string, { title: string, content: string }[]> = {
  'serv-1': [
    {
      title: 'Educatie & AI-geletterdheid',
      content: 'Strategische regie begint bij fundamenteel begrip. In een wereld waar de afhankelijkheid van AI sneller groeit dan de kennis erover, creëren wij een gedeelde taal en kritisch denkvermogen binnen de organisatie. Wij maken bestuurders en stakeholders AI-geletterd, zodat zij door de hype heen kunnen kijken en zelfverzekerd sturen op menswaardige innovatie in het publieke domein.'
    },
    {
      title: 'Risicoanalyse & AI-governance',
      content: 'Innovatie zonder ethisch fundament is een bestuurlijk risico. Wij richten de governance zo in dat verantwoordelijkheden en escalatiemechanismen kristalhelder zijn voordat systemen diep ingrijpen in de praktijk. Door onafhankelijk juridische en ethische kaders (EU AI Act) vast te leggen, borgen we de menselijke controle over technologische groei.'
    }
  ],
  'serv-2': [
    {
      title: 'Value Sensitive Design',
      content: 'AI is nooit neutraal. Elke toepassing bevat de impliciete keuzes en aannames van de makers. Wij maken deze keuzes expliciet en vertalen publieke waarden, zoals rechtvaardigheid en transparantie, naar het technisch ontwerp. Door ontwerpteams te leren deze waarden concreet te maken, bekrachtigt de technologie de missie van de organisatie in plaats van deze onbedoeld te ondergraven.'
    },
    {
      title: 'Co-creatie & Mensgericht ontwerp',
      content: 'De menselijke maat is de enige weg naar duurzaam vertrouwen. Wij borgen menselijke waardigheid en autonomie door professionals en eindgebruikers vanaf de eerste schets bij het ontwerpproces te betrekken. Onze educatieve aanpak van co-creatie zorgt ervoor dat AI-systemen de menselijke expertise versterken en de regie bij de professional houden.'
    }
  ],
  'serv-3': [
    {
      title: 'Ethische assessments',
      content: 'Voorkom ethische blunders door de impact van AI vooraf meetbaar te maken. Met onafhankelijke assessments (zoals IAMA) identificeren we vooroordelen en misstanden voordat deze schade kunnen aanrichten in de samenleving. We leren de organisatie deze bevindingen te gebruiken als een moreel kompas dat vervolgens de geloofwaardigheid van beslissingen ten goede komt.'
    },
    {
      title: 'Toetsing van compliance',
      content: 'Integriteit krijgt pas waarde wanneer deze aantoonbaar is voor de buitenwereld. Onze audits toetsen de feitelijke werking van systemen aan wereldwijde standaarden zoals ISO 42001. Wij leveren het concrete bewijs en de benodigde kennis om systemen continu te verbeteren naar een menselijke waarden. Zodat maatschappelijke verantwoorde, robuuste en juridisch veilige inzet van AI de norm wordt binnen de organisatie.'
    }
  ],
  'how-1': [
    {
      title: 'Kansen & Risico\'s',
      content: 'AI brengt niet alleen kansen, maar ook juridische en maatschappelijke risico’s met zich mee. Aansprakelijkheid bij schade is vaak onduidelijk, terwijl systemen zoals chatbots al worden ingezet voordat ze veilig en voorspelbaar zijn.'
    },
    {
      title: 'Regie & Governance',
      content: 'Wij helpen organisaties daarom zelf richting te bepalen: met heldere governance, expliciete keuzes over menselijke regie en duidelijke verantwoordelijkheden, zodat besluitvorming controleerbaar blijft.'
    }
  ],
  'how-2': [
    {
      title: 'Waarden inbedden',
      content: 'AI-systemen zijn nooit neutraal: ze dragen impliciete aannames en vooroordelen met zich mee. Wij begeleiden organisaties bij het ontwerpen en selecteren van AI waarin waarden expliciet worden ingebed.'
    },
    {
      title: 'Methodiek',
      content: 'Door methoden als Value Sensitive Design en co-creatie maken we zichtbaar welke normen het systeem volgt — en zorgen we dat technologie aansluit bij de maatschappelijke context.'
    }
  ],
  'how-3': [
    {
      title: 'Datakwaliteit',
      content: 'Betrouwbare AI begint bij datakwaliteit: modellen zijn nooit beter dan de data waarop ze zijn getraind. Slechte of scheve data leiden direct tot onbetrouwbare uitkomsten en verlies van vertrouwen.'
    },
    {
      title: 'Validatie',
      content: 'Wij toetsen AI-toepassingen grondig op data, bias, transparantie en reproduceerbaarheid, zodat organisaties weten of hun systemen wetenschappelijk houdbaar en maatschappelijk geloofwaardig zijn.'
    }
  ]
};

export const SERVICES_DETAILS: Record<string, string> = {
  'serv-1': `<div class="flex flex-col items-center text-center space-y-8">
    <div>
      <h4 class="font-bold text-lg mb-3 uppercase tracking-wider">Educatie & AI-geletterdheid</h4>
      <p class="text-sm md:text-base leading-relaxed max-w-2xl">Strategische regie begint bij fundamenteel begrip. In een wereld waar de afhankelijkheid van AI sneller groeit dan de kennis erover, creëren wij een gedeelde taal en kritisch denkvermogen binnen de organisatie. Wij maken bestuurders en stakeholders AI-geletterd, zodat zij door de hype heen kunnen kijken en zelfverzekerd sturen op menswaardige innovatie in het publieke domein.</p>
    </div>
    <div>
      <h4 class="font-bold text-lg mb-3 uppercase tracking-wider">Risicoanalyse & AI-governance</h4>
      <p class="text-sm md:text-base leading-relaxed max-w-2xl">Innovatie zonder ethisch fundament is een bestuurlijk risico. Wij richten de governance zo in dat verantwoordelijkheden en escalatiemechanismen kristalhelder zijn voordat systemen diep ingrijpen in de praktijk. Door onafhankelijk juridische en ethische kaders (EU AI Act) vast te leggen, borgen we de menselijke controle over technologische groei.</p>
    </div>
  </div>`,
  'serv-2': `<div class="flex flex-col items-center text-center space-y-8">
    <div>
      <h4 class="font-bold text-lg mb-3 uppercase tracking-wider">Value Sensitive Design</h4>
      <p class="text-sm md:text-base leading-relaxed max-w-2xl">AI is nooit neutraal. Elke toepassing bevat de impliciete keuzes en aannames van de makers. Wij maken deze keuzes expliciet en vertalen publieke waarden, zoals rechtvaardigheid en transparantie, naar het technisch ontwerp. Door ontwerpteams te leren deze waarden concreet te maken, bekrachtigt de technologie de missie van de organisatie in plaats van deze onbedoeld te ondergraven.</p>
    </div>
    <div>
      <h4 class="font-bold text-lg mb-3 uppercase tracking-wider">Co-creatie & Mensgericht ontwerp</h4>
      <p class="text-sm md:text-base leading-relaxed max-w-2xl">De menselijke maat is de enige weg naar duurzaam vertrouwen. Wij borgen menselijke waardigheid en autonomie door professionals en eindgebruikers vanaf de eerste schets bij het ontwerpproces te betrekken. Onze educatieve aanpak van co-creatie zorgt ervoor dat AI-systemen de menselijke expertise versterken en de regie bij de professional houden.</p>
    </div>
  </div>`,
  'serv-3': `<div class="flex flex-col items-center text-center space-y-8">
    <div>
      <h4 class="font-bold text-lg mb-3 uppercase tracking-wider">Ethische assessments</h4>
      <p class="text-sm md:text-base leading-relaxed max-w-2xl">Voorkom ethische blunders door de impact van AI vooraf meetbaar te maken. Met onafhankelijke assessments (zoals IAMA) identificeren we vooroordelen en misstanden voordat deze schade kunnen aanrichten in de samenleving. We leren de organisatie deze bevindingen te gebruiken als een moreel kompas dat vervolgens de geloofwaardigheid van beslissingen ten goede komt.</p>
    </div>
    <div>
      <h4 class="font-bold text-lg mb-3 uppercase tracking-wider">Toetsing van compliance</h4>
      <p class="text-sm md:text-base leading-relaxed max-w-2xl">Integriteit krijgt pas waarde wanneer deze aantoonbaar is voor de buitenwereld. Onze audits toetsen de feitelijke werking van systemen aan wereldwijde standaarden zoals ISO 42001. Wij leveren het concrete bewijs en de benodigde kennis om systemen continu te verbeteren naar een menselijke waarden. Zodat maatschappelijke verantwoorde, robuuste en juridisch veilige inzet van AI de norm wordt binnen de organisatie.</p>
    </div>
  </div>`
};
