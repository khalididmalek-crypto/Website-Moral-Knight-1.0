
## Moral Knight — Responsible AI Overhead System (v1.0)

Een minimalistische, academische presentatietool geïnspireerd op retro overheadprojectoren, ontworpen om **mensgerichte en verantwoorde AI** uit te leggen in het publieke domein.

De interface gebruikt een **overhead‑grid** van tegels (1–6) waarmee je verhalen, casussen en materialen rondom AI‑ethiek en publieke waarden kunt presenteren.

---

## 1. Installatie & Starten

1. Open een terminal in deze map:
   ```bash
   cd "MK Responsible AI"
   ```
2. Installeer eenmalig de dependencies:
   ```bash
   npm install
   ```
3. Start de ontwikkelserver:
   ```bash
   npm run dev
   ```
4. Open de getoonde link in je browser (meestal `http://localhost:3000`).


---

## 2. Gebruik in de browser

### Grid‑weergave
- **Tegels 1–6**: Klik op een tegel om deze in volledig scherm te openen.
- **Drag & Drop (voor assets)**:
  - Sleep een afbeelding, video, PDF of tekstbestand op een tegel om de inhoud te vullen.
  - De inhoud wordt lokaal in de browser opgeslagen (via `localStorage` of tijdelijke object‑URLs).
- **Label & iconen**:
  - Bovenin elke tegel staat een label met type/rol.
  - Sommige tegels tonen een klein icoon (bijv. AI‑chip, koffer, paper‑icoon) voor directe herkenning.

### Presentatiemodus (volledig scherm)
- **ESC**: sluit de tegel en ga terug naar het grid.
- **Pijltje Links / Rechts**: navigeer tussen tegels.
- **Contact‑tegel**: in fullscreen verschijnt een formulier waarmee bezoekers een bericht kunnen achterlaten (demo; geen echte verzending).

### Belangrijke opmerking over data
- Bestanden die je **lokaal** in de app sleept (drag & drop) worden alleen in de browser opgeslagen (geen externe server).
- **Ververs de pagina niet (Refresh/F5)** tijdens je presentatie, anders moet je de gesleepte bestanden opnieuw toevoegen.
- Teksten en web‑links worden wél persistent bewaard in `localStorage`.

---

## 3. Architectuur & structuur

Belangrijkste mappen en bestanden:

- `src/pages/index.tsx` – entrypoint voor Next.js.
- `src/App.tsx` – hoofd‑layout (titel, grid, footer, projector‑overlay).
- `src/components/`
  - `Grid`, `Tile`, `FullscreenView`, `ProjectorOverlay` (layout & presentatie)
  - `ContentRenderer` (weergave van PDF/IMAGE/VIDEO/TEXT/QUOTE/CONTACT)
  - `ContactForm`, `EditorPanel`, `GlobalSettingsModal`, `Typewriter` (forms, configuratie, animatie)
- `src/lib/`
  - `storage.ts` – lokale opslag van tegels in `localStorage`.
  - `auth.ts` – getype stub voor toekomstige authenticatie/rollen.
  - `drive.ts` – stub voor toekomstige koppeling met externe opslag (bijv. Drive/SharePoint).
  - `config.ts` – centrale app‑ en Responsible‑AI‑configuratie.
- `src/constants.ts` – thema en initiële tegels.
- `src/types.ts` – TypeScript‑types (`TileData`, `ContentType`, enz.).
- `src/index.css` – Tailwind‑basis + maatwerk animaties en retro‑styling.

---

## 4. Responsible AI‑principes in deze tool

Deze tool is gebouwd rond een aantal **Responsible AI‑principes**:

- **Transparantie**
  - Heldere titels en labels op elke tegel (bijv. *Wat is het Probleem?*, *Hoe doen we dat?*).
  - Mogelijkheid om per tegel tekst toe te voegen die de context, aannames en beperkingen van een AI‑systeem uitlegt.
  - In de fullscreen‑modus wordt expliciet gemaakt waar het over gaat (bijv. “AI die mensen schaadt” vs. “AI met een moreel kompas”).

- **Menselijke maat & uitlegbaarheid**
  - Inhoud focust op verhalen, casussen en uitleg – niet op “magie”.
  - De typewriter‑animatie en retro‑stijl leggen nadruk op **langzamer nadenken** in plaats van instant‑antwoord.

- **Dataminimalisatie & controle**
  - Standaard worden alleen lokale browsergegevens gebruikt (`localStorage` voor tegels).
  - Externe bestanden (bijv. PDF/afbeeldingen) worden als tijdelijke object‑URLs geladen, niet naar een server geüpload.
  - Toekomstige integraties met externe opslag (Drive/SharePoint) zijn bewust als **stubs** in `src/lib/drive.ts` geplaatst, zodat je ze gecontroleerd en gedocumenteerd kunt toevoegen.

- **Verantwoording & governance (voor later)**
  - `src/lib/auth.ts` bevat een basis voor gebruikers/rollen (viewer/presenter/admin).
  - `src/lib/config.ts` bevat een `responsibleAi`‑config (bijv. toggles voor logging, AI‑disclaimers, context‑uitleg).
  - Dit maakt het makkelijk om later logging, audit‑trails en rechtenbeheer toe te voegen.

---

## 5. Tooling (linting & kwaliteit)

In `package.json` zijn basis‑scripts aanwezig:

- `npm run dev` – ontwikkelserver starten.
- `npm run build` – Next.js build.
- `npm run start` – start de productiebuild.


Aanbevolen (optioneel toe te voegen, indien gewenst):

- **ESLint + Prettier** voor consistente code‑kwaliteit.
- **Vitest + React Testing Library** voor component‑tests (bijv. grid‑rendering, formuliergedrag).

Wil je, dan kan ik deze configuraties ook daadwerkelijk toevoegen (`.eslintrc`, `.prettierrc`, tests) en de `package.json`‑scripts uitbreiden.

---

---

## 6. Formulieren & Privacy

De website bevat een **Contactformulier** en een **MK Meldpunt** voor professionele interactie. Deze zijn ontworpen met privacy en veiligheid als uitgangspunt:

- **Honeypot-beveiliging**: Om spam door bots te minimaliseren zonder irritante gebruikerservaring (zoals Captcha's), gebruiken we een onzichtbaar `_website` veld. Scripts die dit veld invullen worden direct en geruisloos genegeerd door de API.
- **AVG / GDPR Compliance**:
  - Gebruikers moeten expliciet toestemming geven voor dataverwerking via een verplichte checkbox.
  - Verzendknoppen zijn uitgeschakeld totdat akkoord is gegaan.
  - Data wordt via een beveiligde Google Workspace SMTP-verbinding (SSL/TLS) verzonden.
  - Alle invoer wordt aan de serverzijde getrimd en gesaneerd (sanitization).

---

## 7. Volgende stappen / ideeën

- Uitbreiden van de inhoud (meer tegels, casussen, voorbeelden).
- Echte koppeling met een identity provider (auth) en beveiligde data‑opslag.
- Logging + export van “presentatie‑sessies” om verantwoording af te leggen (wel binnen de kaders van privacywetgeving).
- Meertaligheid (NL/EN) via de config‑laag.

