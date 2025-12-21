# TileBase Visualisatie - Hoe ziet het eruit?

## TileBase Component Structuur

### Visuele Layout

```
┌─────────────────────────────────────────────────────────┐
│  ┌─────────────┐                              ┌──────┐  │
│  │   LABEL     │                              │ ICON │  │ ← Top Layer
│  │  (top-left) │                              │(top- │  │   z-20, z-30
│  └─────────────┘                              │right)│  │
│                                                └──────┘  │
│                                                          │
│                                                          │
│              ┌──────────────────────────┐               │
│              │                          │               │
│              │    CONTENT AREA          │               │ ← Content Layer
│              │    (ContentRenderer)     │               │   z-10
│              │                          │               │
│              └──────────────────────────┘               │
│                                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
         ↑
    BORDER LAYER (z-0)
    - Default: border border-black
    - Animated: animate-buggy-static-border
```

## Code Voorbeeld: TileBase Gebruik

### Voorbeeld 1: Tile 1 (met geanimeerde border)

```tsx
<TileBase
  id="tile-1"
  fillColor="#F1E1DB"
  borderVariant="animated"  // ← Speciale border voor tile-1
  typingComplete={true}
  mode="preview"
  onClick={() => onClick('tile-1')}
  label={
    <TileLabel applyNoise={false} typingComplete={true}>
      Wat is het Probleem?
    </TileLabel>
  }
  icon={
    <TileIcon variant="cross" color="#194D25" showIntro={true}>
      <X size={24} strokeWidth={1.5} />
    </TileIcon>
  }
>
  <ContentRenderer data={tile1Data} mode="preview" />
</TileBase>
```

### Voorbeeld 2: Tile 2 (met arrow icon)

```tsx
<TileBase
  id="tile-2"
  fillColor="#EBF0E8"
  borderVariant="default"  // ← Standaard border
  typingComplete={true}
  mode="preview"
  onClick={() => onClick('tile-2')}
  label={
    <TileLabel applyNoise={true} typingComplete={true}>
      <Typewriter text="Wat is de oplossing?" />
    </TileLabel>
  }
  icon={
    <TileIcon variant="arrow" showIntro={true}>
      <ArrowLeft size={24} strokeWidth={1.5} />
    </TileIcon>
  }
>
  {/* Content hidden in preview mode */}
</TileBase>
```

### Voorbeeld 3: Tile 3-6 (met standaard icons)

```tsx
<TileBase
  id="tile-3"
  fillColor="#EBF0E8"
  borderVariant="default"
  typingComplete={true}
  mode="preview"
  onClick={() => onClick('tile-3')}
  label={
    <TileLabel applyNoise={true} typingComplete={true}>
      <Typewriter text="Hoe doen we dat?" />
    </TileLabel>
  }
  icon={
    <TileIcon variant="cross" color="#194D25" showIntro={true}>
      <Cpu size={24} strokeWidth={1.5} />
    </TileIcon>
  }
>
  <ContentRenderer data={tile3Data} mode="preview" />
</TileBase>
```

## Component Hiërarchie

```
Tile (src/components/Tile.tsx)
│
├── TileBase (src/components/TileBase.tsx)
│   ├── Border Layer (z-0)
│   │   └── Animated or Default border
│   │
│   ├── Label Container (z-20, top-left)
│   │   └── TileLabel (src/components/TileLabel.tsx)
│   │       ├── White background
│   │       ├── Border (black when complete, gray when typing)
│   │       └── Text content (with optional noise filter)
│   │
│   ├── Icon Container (z-30, top-right)
│   │   └── TileIcon (src/components/TileIcon.tsx)
│   │       ├── Intro animation (cross/arrow/default)
│   │       └── Hover state (opacity transition)
│   │
│   └── Content Area (z-10)
│       └── ContentRenderer (src/components/ContentRenderer.tsx)
│           ├── TEXT content
│           ├── IMAGE content
│           ├── VIDEO content
│           ├── PDF content
│           ├── SLIDES content
│           ├── QUOTE content
│           └── CONTACT content
```

## Styling Details

### Border
- **Default:** `border border-black` - Altijd zichtbaar, zwart
- **Animated:** `animate-buggy-static-border bg-subtle-tv-noise` - Voor tile-1
- **Hover:** `group-hover:border-black` - Consistente hover state

### Label
- **Position:** `absolute top-4 left-4` (16px inset)
- **Background:** `bg-white`
- **Border:** 
  - `border-black` wanneer `typingComplete === true`
  - `border-gray-300` wanneer `typingComplete === false`
- **Padding:** `px-3 py-1.5` (12px horizontal, 6px vertical)
- **Typography:** `font-mono text-[13.2px] font-semibold uppercase tracking-widest`

### Icon
- **Position:** `absolute top-4 right-4` (16px inset)
- **Size:** 24px (behalve Send icon: 27px)
- **Color:** 
  - Cross variant: `#194D25` (PRIMARY_GREEN)
  - Arrow variant: `text-gray-500`
- **Animation:**
  - Intro: `animate-cross-intro` of `animate-arrow-intro`
  - Hover: `opacity-0 group-hover:opacity-100 animate-arrow-hover`

### Content Area
- **Padding:** Via `SPACING` constants
  - Preview: `SPACING.TEXT_PADDING_PREVIEW` (`pt-16 px-6 pb-6`)
  - Fullscreen: `SPACING.TEXT_PADDING_FULLSCREEN` (`px-12 py-8`)
- **Scaling:** Responsive via Tailwind classes
- **Overflow:** `overflow-hidden` in preview, `overflow-visible` in fullscreen

## Responsive Gedrag

### Preview Mode
```tsx
className="w-full aspect-video overflow-hidden"
```
- Volledige breedte van grid cel
- Aspect ratio 16:9 (aspect-video)
- Content wordt geknipt (overflow-hidden)

### Fullscreen Mode
```tsx
className="w-auto h-auto overflow-visible"
```
- Auto sizing op basis van content
- Content volledig zichtbaar (overflow-visible)
- Max breedte via parent container

## Alle Tegels Overzicht

| Tile | Label | Icon | Icon Positie | Border | Fill Color |
|------|-------|------|--------------|--------|------------|
| tile-1 | "Wat is het Probleem?" | X | Top-right ✅ | Animated | #F1E1DB |
| tile-2 | "Wat is de oplossing?" | ArrowLeft | Top-right ✅ | Default | #EBF0E8 |
| tile-3 | "Hoe doen we dat?" | Cpu | Top-right ✅ | Default | #EBF0E8 |
| tile-4 | "Onze diensten" | Briefcase | Top-right ✅ | Default | #D8DDE1 |
| tile-5 | "Contact" | Send | Top-right ✅ | Default | #FFFFFF |
| tile-6 | "Blog" | FileText | Top-right ✅ | Default | #FFFFFF |

## Belangrijkste Verbeteringen

### ✅ Voor (Oud)
- Icons waren in label container (links)
- Inconsistente border styling
- Icons niet altijd in dezelfde positie
- Veel conditional logic in Tile component

### ✅ Na (Nieuw)
- Icons altijd in top-right corner
- Consistente witte/zwarte border
- Alle tegels gebruiken dezelfde base component
- Minder code, meer declaratief
- Makkelijker te onderhouden en uit te breiden

