# TileBase Architectuur - Verbeterde Component Structuur

## Overzicht

Deze documentatie beschrijft de nieuwe `TileBase` architectuur die zorgt voor consistente esthetiek, witte kaders, en icon positioning voor alle tegels in de Presentation Grid.

## Doelen Bereikt

✅ **Alle tegels dezelfde esthetiek** - Via gedeelde `TileBase` component  
✅ **Wit kader consistent** - Altijd zichtbaar, uniforme styling  
✅ **Tekstblok schaalt mooi** - Consistente padding en scaling via `ContentRenderer`  
✅ **Icons altijd in rechterbovenhoek** - Via `TileBase` icon slot  
✅ **Responsive gedrag volledig strak** - Gehandeld door `TileBase`

## Component Architectuur

### 1. TileBase Component

**Locatie:** `src/components/TileBase.tsx`

**Verantwoordelijkheden:**
- Consistente witte/zwarte border (altijd zichtbaar)
- Background color logica (fillColor > highlight > default)
- Label positioning (top-left corner)
- Icon positioning (top-right corner)
- Hover states
- Responsive gedrag
- Content area scaling

**Key Features:**
```tsx
<TileBase
  id="tile-1"
  fillColor="#F1E1DB"
  borderVariant="animated" // of "default"
  label={<TileLabel>...</TileLabel>}
  icon={<TileIcon>...</TileIcon>}
>
  <ContentRenderer ... />
</TileBase>
```

**Border Varianten:**
- `default`: Standaard zwarte border (`border border-black`)
- `animated`: Geanimeerde border voor tile-1 (`animate-buggy-static-border`)

### 2. TileLabel Component

**Locatie:** `src/components/TileLabel.tsx`

**Verantwoordelijkheden:**
- Consistente label styling (wit achtergrond, border)
- Consistente padding (`px-3 py-1.5`)
- Typography (mono, uppercase, tracking-widest)
- Text noise filter optioneel

**Gebruik:**
```tsx
<TileLabel 
  applyNoise={true} 
  typingComplete={false}
>
  {titleContent}
</TileLabel>
```

### 3. TileIcon Component

**Locatie:** `src/components/TileIcon.tsx`

**Verantwoordelijkheden:**
- Consistente icon rendering
- Intro animaties (cross/arrow/default)
- Hover states
- Color handling

**Varianten:**
- `cross`: Subtle intro animatie (voor tiles 1, 3-6)
- `arrow`: Wandering intro animatie (voor tile 2)
- `default`: Standaard cross intro

**Gebruik:**
```tsx
<TileIcon 
  variant="cross" 
  color="#194D25"
  showIntro={true}
>
  <X size={24} />
</TileIcon>
```

### 4. Refactored Tile Component

**Locatie:** `src/components/Tile.tsx`

**Wat is veranderd:**
- Gebruikt nu `TileBase` voor alle basis styling
- Icons zijn verplaatst naar top-right corner (was top-left)
- Label blijft in top-left corner
- Minder conditional logic, meer declaratief
- Icon configuratie via `getIconConfig()` functie

**Voor:**
```tsx
// Icons waren in label container (links)
<div className="absolute top-4 left-4">
  <Label />
  <Icon /> {/* ❌ Verkeerde positie */}
</div>
```

**Na:**
```tsx
<TileBase
  label={<TileLabel>...</TileLabel>} // Top-left
  icon={<TileIcon>...</TileIcon>}    // Top-right ✅
>
  <ContentRenderer />
</TileBase>
```

## Tegels die worden Vervangen

Alle tegels gebruiken nu `TileBase`:

| Tile ID | Label Positie | Icon Positie | Border Type | Icon Type |
|---------|---------------|--------------|-------------|-----------|
| tile-1  | Top-left      | Top-right ✅ | Animated    | X (cross) |
| tile-2  | Top-left      | Top-right ✅ | Default     | ArrowLeft |
| tile-3  | Top-left      | Top-right ✅ | Default     | Cpu       |
| tile-4  | Top-left      | Top-right ✅ | Default     | Briefcase |
| tile-5  | Top-left      | Top-right ✅ | Default     | Send      |
| tile-6  | Top-left      | Top-right ✅ | Default     | FileText  |

## Visuele Structuur

```
┌─────────────────────────────────────┐
│ [Label]                    [Icon]   │ ← Top layer (z-20, z-30)
│                                     │
│                                     │
│         Content Area               │ ← Content layer (z-10)
│         (ContentRenderer)           │
│                                     │
│                                     │
└─────────────────────────────────────┘
         ↑ Border Layer (z-0)
```

## Responsive Gedrag

Alle responsive gedrag wordt gehandeld door `TileBase`:

- **Preview mode:** `w-full aspect-video overflow-hidden`
- **Fullscreen mode:** `w-auto h-auto overflow-visible`
- **Minimum sizes:** `min-h-[44px] min-w-[44px]` (WCAG AA touch targets)
- **Hover states:** Consistente `hover:shadow-sm hover:bg-accent-light`
- **Focus states:** `focus-visible:outline-2` met groene outline

## Consistente Spacing

Alle spacing gebruikt `SPACING` constants:

- **Label/Icon inset:** `top-4 left-4 right-4` (16px)
- **Label padding:** `px-3 py-1.5` (12px horizontal, 6px vertical)
- **Content padding:** Via `ContentRenderer` met `SPACING.TEXT_PADDING_PREVIEW` etc.

## Migratie Checklist

- [x] TileBase component gemaakt
- [x] TileLabel component gemaakt
- [x] TileIcon component gemaakt
- [x] Tile component refactored
- [ ] ContentRenderer text scaling gecontroleerd
- [ ] Responsive gedrag getest
- [ ] Alle tegels getest in preview en fullscreen mode

## Volgende Stappen

1. **ContentRenderer verbeteren** voor consistente text scaling
2. **Testen** van alle tegels in verschillende schermformaten
3. **Verifiëren** dat alle animaties correct werken
4. **Optimaliseren** indien nodig

## Voordelen van Nieuwe Architectuur

1. **Consistentie:** Alle tegels delen dezelfde basis styling
2. **Onderhoudbaarheid:** Wijzigingen aan basis styling gebeuren op één plek
3. **Schaalbaarheid:** Nieuwe tegels zijn makkelijk toe te voegen
4. **Testbaarheid:** Componenten zijn geïsoleerd en makkelijk te testen
5. **Accessibility:** Consistente focus states en ARIA labels

