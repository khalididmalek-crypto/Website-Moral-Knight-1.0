# PRIVACY.md - Moral Knight Privacy Status

Dit document beschrijft de huidige technische status van de privacy en gegevensbescherming op de Moral Knight website. Dit bestand wordt bijgewerkt bij elke relevante codewijziging.

## Huidige Status: **PRIVACY-EERST (Actief)**
*Laatste Update: 22 februari 2026*

### 1. Tracking & Analytics
- **Status:** Alleen cookieloze, privacy-vriendelijke analytics (Simple Analytics).
- **Historie:** Google Analytics is verwijderd op 20 februari 2026.
- **Implementatie:** Gegevens worden geanonimiseerd en op Europese bodem verwerkt zonder de bezoeker te tracken of profilering toe te passen. Geen cookiemelding nodig.

### 2. Meldpunt (Whistleblower Protection)
- **Status:** Veilig / Anoniem.
- **Anonimiteit:** Gebruikers kunnen "Anoniem Melden" kiezen. In dit geval worden er géén persoonsgegevens (naam/e-mail) verplicht gesteld of opgeslagen.
- **Privacy by Design:** De applicatie stript technisch alle ingevulde persoonsgegevens op de browser voordat de melding naar de server wordt verstuurd als "Anoniem Melden" actief is.
- **Geen "Inbox Trace":** Er worden géén bevestigingsmails naar melders gestuurd voor meldingen. Dit voorkomt dat er sporen achterblijven in de mailbox van de melder op hun apparaat.

- **Referentie:** Melder krijgt een uniek kenmerk (ID) direct op het scherm te zien voor eigen administratie.

### 3. Gegevensverwerking & Hosting
- **Hosting:** Vimexx (Antagonist cluster, Nederlandse servers).
- **Infrastructuur:** Data blijft binnen de EU/Nederland.
- **SMTP Beveiliging:** Gebruik van beveiligde SSL/TLS verbindingen met strikte certificaat-validatie (`rejectUnauthorized: true`).

### 4. Website Beveiliging
- **Security Headers:** Actief via `next.config.js`.
    - `Content-Security-Policy` (CSP)
    - `Strict-Transport-Security` (HSTS)
    - `X-Content-Type-Options`
    - `X-Frame-Options`
    - `Referrer-Policy`

---
*Moral Knight: Bescherming van de morele kreukelzone.*
