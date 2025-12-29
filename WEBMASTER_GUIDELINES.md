# Moral Knight Webmaster Guidelines

## Project Status
- **Current Stable Commit**: f9c28ec
- **Tech Stack**: Next.js (Pages Router), Tailwind CSS, TypeScript.

## Strikte Regels voor Ontwikkeling
1. **Desktop Preservation**: De desktop-layout (schermen > 768px) is de 'Golden Master'. Raak bestaande md:, lg:, en xl: classes NOOIT aan.
2. **Mobile-First Logic**: Gebruik uitsluitend prefixes voor mobiele wijzigingen. Gebruik bijv. 'flex-col md:flex-row' om stapeling op mobiel af te dwingen zonder desktop te breken.
3. **Geen Globale CSS**: Voeg geen algemene regels toe aan index.css die invloed hebben op standaard HTML-elementen.
4. **Geen Nieuwe Dependencies**: Gebruik geen externe icon-bibliotheken (zoals lucide). Gebruik alleen inline SVG's of tekst.

## Huidige Opdracht: Dashboard Versimpeling
- Reduceer de actieve tegels naar exact drie: **"Onze Visie"**, **"Wat doen we?"**, en **"Contact"**.
- Verwijder alle navigatie-pijlen en swipe-logica.
- De grid moet op desktop 'grid-cols-3' blijven en op mobiel 'grid-cols-1'.
