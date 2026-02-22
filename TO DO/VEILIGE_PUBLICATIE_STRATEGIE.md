# Rapport: Veilige Publicatie & Transparantie Strategie

Dit document dient als blauwdruk voor het open-source maken van de Moral Knight website. Het doel is maximale transparantie naar de burger toe, zonder de veiligheid van de infrastructuur of de klokkenluiders in gevaar te brengen.

## 1. Risico-Analyse voor Publicatie
Bij het publiek maken van code op GitHub zijn er drie hoofdrisico's:
1.  **Secret Leakage:** Hardcoded API-sleutels, SMTP-wachtwoorden of database-credentials in de code of git-geschiedenis.
2.  **History Exposure:** Geheimen die in het verleden zijn verwijderd, maar nog in oude 'commits' staan.
3.  **Infrastructuur Informatie:** Te veel details over de specifieke server-setup die een gerichte aanval makkelijker maken.

## 2. Aanbevolen Gratis & Open Source Tools
Draai deze tools voordat de code definitief live gaat:
- **TruffleHog (SAST):** Voor het scannen van de git-geschiedenis op geheimen.
- **OWASP ZAP (DAST):** Voor een actieve penetratietest op de draaiende website.
- **Mozilla Observatory:** Voor het valideren van de A+ status van je security headers.
- **GitHub Dependabot:** Voor automatisch beheer van onveilige bibliotheken.

---

## 3. MASTER PROMPT VOOR UITVOERING
*Kopieer en plak de onderstaande prompt in een nieuwe chat met mij (Gemini) zodra je klaar bent om de publicatie voor te bereiden.*

> **ONDERWERP: UITVOEREN VEILIGE SANITATIE VOOR PUBLIEKE REPO**
>
> "Ik wil de Moral Knight website publiek maken op GitHub. Voer de 'Public Release Sanitization' procedure uit op de huidige codebase:
> 
> 1. **Check `.gitignore`**: Zorg dat alle `.env`, `.local`, en `node_modules` strikt worden uitgesloten.
> 2. **Scrub Hardcoded Secrets**: Scan alle bestanden in `src/` en `public/` op hardcoded e-mailadressen, wachtwoorden of sleutels. Vervang deze door verwijzingen naar `process.env`.
> 3. **Voorbereiden 'Clean Slate'**: Maak een script of procedure om de code te kopiëren naar een nieuwe map ZONDER de huidige `.git` map, zodat de geschiedenis wordt gewist.
> 4. **Voeg `SECURITY.md` toe**: Maak een Responsible Disclosure beleid aan waarin staat hoe mensen veilig lekken kunnen melden.
> 5. **Final Audit**: Geef me een lijst van alle acties die je hebt ondernomen om de veiligheid te garanderen voordat ik de `git push --public` doe."

---

## 4. Checklist voor de Beheerder
- [ ] Heb je alle SMTP-gegevens in de Vercel/Vimexx dashboard staan en niet in de code?
- [ ] Is het meldpunt getest met de nieuwe IP-masking (`0.0.0.0`)?
- [ ] Is de `src/lib/auth.ts` nog steeds een veilige placeholder?

**Status:** Gereed voor voorbereiding.
*Moral Knight: Transparantie door techniek.*
