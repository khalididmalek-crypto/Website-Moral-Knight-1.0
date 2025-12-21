# Layout Audit Rapport
## Volledige analyse van grids, alignment, margins en paddings

---

## 🔴 KRITIEKE PROBLEMEN

### 1. **Inconsistente Grid Gap**
**Bestand:** `src/components/Grid.tsx` (regel 16)
**Probleem:** Grid gebruikt `SPACING.GRID_GAP` (`gap-8`), maar dit wordt niet consistent toegepast in andere grid-gerelateerde componenten.
**Visuele Impact:** 
- Grid items hebben 2rem (32px) tussenruimte, maar andere spacing is vaak 1.5rem (24px) of 1rem (16px)
- Creëert visuele onbalans tussen grid spacing en andere element spacing
**Ready-to-run prompt:**
```
Standardiseer alle grid gaps naar een consistente waarde. Gebruik SPACING.GRID_GAP ('gap-8') overal waar grids worden gebruikt, of verander SPACING.GRID_GAP naar 'gap-6' voor betere visuele harmonie met andere spacing (px-6, py-12). Controleer Grid.tsx regel 16 en alle andere grid-implementaties.
```

---

### 2. **Hardcoded Padding in Tile Labels**
**Bestand:** `src/components/Tile.tsx` (regel 84)
**Probleem:** Label padding gebruikt arbitraire waarden: `px-[0.6rem] py-[0.3rem]` in plaats van Tailwind spacing scale
**Visuele Impact:**
- Labels hebben 9.6px horizontaal en 4.8px verticaal - niet afgestemd op 4px/8px spacing grid
- Moeilijk te onderhouden en inconsistent met rest van design system
**Ready-to-run prompt:**
```
Vervang hardcoded padding px-[0.6rem] py-[0.3rem] in Tile.tsx regel 84 met Tailwind spacing classes (bijv. px-2.5 py-1 of px-3 py-1.5). Zorg dat padding consistent is met andere UI elementen en gebruik de Tailwind spacing scale (4px increments).
```

---

### 3. **Inconsistente Tile Content Padding**
**Bestand:** `src/components/ContentRenderer.tsx` (regels 103, 340-341)
**Probleem:** 
- Quote content: `p-6` (preview) vs `p-24` (fullscreen) - extreme variatie
- Text content: `pt-24 px-6 pb-6` (preview) vs `px-8 py-4 md:px-10 md:py-6` (fullscreen)
**Visuele Impact:**
- Quote padding springt van 1.5rem naar 6rem - te groot verschil
- Text content heeft verschillende padding logica voor preview vs fullscreen
- Geen consistente padding ratio tussen modes
**Ready-to-run prompt:**
```
Standardiseer padding in ContentRenderer.tsx voor alle content types. Gebruik een consistente ratio tussen preview en fullscreen modes (bijv. preview: p-6, fullscreen: p-12 of p-16). Vervang p-24 met p-12 of p-16 voor quotes. Maak text content padding consistent: gebruik px-6 py-6 voor preview en px-12 py-8 voor fullscreen.
```

---

### 4. **Inconsistente Container Padding**
**Bestand:** `src/App.tsx` (regels 142, 178)
**Probleem:**
- Main container: `px-6 py-12` 
- Grid intro text: `px-4 md:px-0` - verschillende padding logica
- Footer heeft geen expliciete padding maar gebruikt margin
**Visuele Impact:**
- Horizontale padding verschilt tussen secties (24px vs 16px)
- Verticale spacing is `py-12` (48px) maar andere gaps zijn `gap-10` (40px)
- Grid intro text heeft responsive padding die naar 0 gaat op desktop
**Ready-to-run prompt:**
```
Standardiseer container padding in App.tsx. Gebruik consistente horizontale padding: px-6 voor alle containers (of px-4 md:px-6 voor responsive). Verander py-12 naar py-10 om consistent te zijn met gap-10. Verwijder px-4 md:px-0 van grid intro text container en gebruik px-6 voor consistentie.
```

---

### 5. **Tile Position Inconsistencies**
**Bestand:** `src/components/Tile.tsx` (regels 81, 173)
**Probleem:**
- Label container: `top-3 left-3` (12px)
- Empty controls container: `top-3 right-3` (12px)
- Geen gebruik van spacing constanten
**Visuele Impact:**
- Labels zijn 12px van randen, maar andere spacing gebruikt vaak 16px (p-4) of 24px (p-6)
- Niet afgestemd op 4px spacing grid
**Ready-to-run prompt:**
```
Vervang hardcoded top-3 left-3 en top-3 right-3 in Tile.tsx met consistente spacing. Gebruik top-4 left-4 (16px) voor betere alignment met andere padding, of maak een SPACING.TILE_INSET constante ('top-4 left-4') en gebruik die overal.
```

---

## 🟡 MATIGE PROBLEMEN

### 6. **Fullscreen Modal Padding Variatie**
**Bestand:** `src/components/FullscreenView.tsx` (regels 104, 120)
**Probleem:**
- Header: `p-4` (16px)
- Main content: `p-6 pb-32` (24px top/sides, 128px bottom)
**Visuele Impact:**
- Header en content hebben verschillende padding
- Extreme bottom padding (pb-32 = 128px) creëert grote ruimte onder content
**Ready-to-run prompt:**
```
Standardiseer padding in FullscreenView.tsx. Gebruik p-6 voor header (consistent met andere modals) en p-6 pb-16 of pb-20 voor main content (in plaats van pb-32). Zorg dat padding consistent is tussen header en content areas.
```

---

### 7. **Editor Panel Inconsistente Spacing**
**Bestand:** `src/components/EditorPanel.tsx` (regels 122, 154, 276)
**Probleem:**
- Header: `p-6`
- Form content: `p-6 space-y-8`
- Footer: `p-6`
- Form inputs: `p-2` (regel 163, 175, etc.)
**Visuele Impact:**
- Alle secties gebruiken p-6, maar inputs gebruiken p-2 - grote variatie
- space-y-8 creëert 32px tussen form items, maar grid gap is ook 32px - mogelijk te veel
**Ready-to-run prompt:**
```
Standardiseer spacing in EditorPanel.tsx. Overweeg p-4 voor inputs (in plaats van p-2) voor betere touch targets en visuele harmonie. Verander space-y-8 naar space-y-6 voor betere proporties met andere spacing. Zorg dat alle padding waarden deel zijn van een consistente spacing scale.
```

---

### 8. **Contact Form Padding Variatie**
**Bestand:** `src/components/ContactForm.tsx` (regels 131, 137, 161)
**Probleem:**
- Preview: `p-6`
- Fullscreen container: `p-8`
- Form content: `px-6 py-8`
**Visuele Impact:**
- Verschillende padding tussen preview en fullscreen modes
- Geen consistente ratio zoals andere components
**Ready-to-run prompt:**
```
Standardiseer ContactForm padding. Gebruik p-6 voor preview en p-8 of p-10 voor fullscreen (consistente 1.33x of 1.67x ratio). Verander px-6 py-8 naar p-8 voor consistentie, of gebruik p-6 met specifieke py-8 als dat nodig is voor verticale spacing.
```

---

### 9. **Grid Alignment Issues**
**Bestand:** `src/components/Grid.tsx` + `src/App.tsx`
**Probleem:**
- Grid container heeft geen expliciete alignment
- Grid intro text heeft `mb-8` maar grid zelf heeft geen top margin
- Max-width van 1400px op intro text maar grid heeft geen max-width constraint
**Visuele Impact:**
- Grid items kunnen niet netjes uitlijnen als container widths verschillen
- Intro text en grid hebben verschillende max-widths
**Ready-to-run prompt:**
```
Zorg voor consistente alignment in Grid.tsx en App.tsx. Geef grid container dezelfde max-w-[1400px] als intro text, of verwijder max-width van intro text. Voeg mb-6 toe aan grid container (in plaats van mb-8 op intro) voor consistente spacing. Zorg dat grid items perfect uitlijnen door container alignment te controleren.
```

---

## 🟢 KLEINE VERBETERINGEN

### 10. **Footer Spacing**
**Bestand:** `src/App.tsx` (regel 212)
**Probleem:**
- Footer heeft `mt-0` maar zou spacing moeten hebben van main content
- Geen consistente margin met andere secties
**Visuele Impact:**
- Footer lijkt te dicht bij grid te staan
**Ready-to-run prompt:**
```
Voeg mt-10 toe aan footer in App.tsx regel 212 (consistent met gap-10 spacing) of gebruik mt-8 voor consistente spacing met grid gap.
```

---

### 11. **Save Success Indicator Position**
**Bestand:** `src/App.tsx` (regel 202)
**Probleem:**
- Fixed position met `bottom-6 right-6` - hardcoded spacing
**Visuele Impact:**
- Niet consistent met andere spacing waarden
**Ready-to-run prompt:**
```
Vervang bottom-6 right-6 met bottom-8 right-8 in App.tsx regel 202 voor betere alignment met andere spacing (gap-8), of gebruik een SPACING constant.
```

---

### 12. **Content Renderer Text Padding Inconsistencies**
**Bestand:** `src/components/ContentRenderer.tsx` (regel 340)
**Probleem:**
- Preview mode: `pt-24 px-6 pb-6` - asymmetrische padding
- Top padding (96px) is veel groter dan bottom (24px)
**Visuelle Impact:**
- Text content lijkt te hoog geplaatst in preview mode
- Asymmetrie kan verwarrend zijn
**Ready-to-run prompt:**
```
Balanceer text content padding in ContentRenderer.tsx regel 340. Overweeg pt-16 px-6 pb-6 of pt-12 px-6 pb-6 voor preview mode om top padding te verminderen en meer symmetrie te creëren.
```

---

## 📊 SAMENVATTING

### Spacing Variaties Gevonden:
- **Grid gaps:** `gap-8` (32px) - gebruikt in Grid.tsx
- **Section gaps:** `gap-10` (40px) - gebruikt in App.tsx
- **Container padding:** `px-6` (24px), `px-4` (16px), `py-12` (48px), `py-10` (40px)
- **Tile padding:** `p-6` (24px), `p-4` (16px), `p-2` (8px), `p-24` (96px!)
- **Tile insets:** `top-3 left-3` (12px), `top-4 left-4` (16px)
- **Form spacing:** `space-y-8` (32px), `space-y-6` (24px), `gap-5` (20px)

### Aanbevolen Spacing Scale:
```
SPACING = {
  XS: 'gap-1' | 'p-1' (4px)
  SM: 'gap-2' | 'p-2' (8px)
  MD: 'gap-4' | 'p-4' (16px)
  LG: 'gap-6' | 'p-6' (24px)
  XL: 'gap-8' | 'p-8' (32px)
  XXL: 'gap-10' | 'p-10' (40px)
}
```

### Prioriteit:
1. **Hoog:** Problemen 1-5 (kritieke inconsistenties)
2. **Medium:** Problemen 6-9 (matige impact)
3. **Laag:** Problemen 10-12 (kleine verbeteringen)

---

## ✅ ACTIEPLAN

1. **Eerst:** Standaardiseer SPACING constanten in `constants.ts`
2. **Dan:** Pas alle hardcoded waarden aan naar constanten
3. **Vervolgens:** Test visuele consistentie op verschillende schermformaten
4. **Tenslotte:** Documenteer spacing system in code comments

