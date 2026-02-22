# PRIVACY.md - Moral Knight Privacy Status

Dit document beschrijft de huidige technische status van de privacy en gegevensbescherming op de Moral Knight website. Dit bestand wordt bijgewerkt bij elke relevante codewijziging.

## Huidige Status: **PRIVACY-EERST (Actief)**
*Laatste Update: 22 februari 2026*

### 1. Tracking & Analytics
- **Status:** Alleen cookieloze, privacy-vriendelijke analytics (Simple Analytics).
- **Historie:** Google Analytics is verwijderd op 20 februari 2026.
- **Implementatie:** Gegevens worden geanonimiseerd en op Europese bodem verwerkt zonder de bezoeker te tracken of profilering toe te passen. Geen cookiemelding nodig.

### 2. Meldpunt (Whistleblower Protection)
- **Status:** Extreem Veilig / Anoniem.
- **Anonimiteit & IP-Masking:** Zodra een gebruiker kiest voor "Anoniem Melden", wordt het IP-adres van de verzender in de code direct genegeerd en vervangen door `0.0.0.0`. Er wordt geen enkel logboek bijgehouden van de herkomst.
- **Metadata Scrubber:** Bij anonieme meldingen worden bijgevoegde afbeeldingen automatisch verwerkt door een server-side "scrubber" die alle verborgen gegevens (EXIF, GPS-locatie, apparaatinformatie) definitief wist voordat het bericht wordt verwerkt.
- **Privacy by Design:** De applicatie stript technisch alle ingevulde persoonsgegevens op de browser voordat de melding naar de server wordt verstuurd als "Anoniem Melden" actief is.
- **Geen "Inbox Trace":** Er worden géén automatische bevestigingsmails naar melders gestuurd voor anonieme meldingen. Dit voorkomt dat de melding ontdekt kan worden op het apparaat van de melder.
- **Referentie:** Melder krijgt een uniek kenmerk (ID) direct op het scherm te zien voor eigen administratie.

### 3. Gegevensverwerking & Hosting
- **Hosting:** Vimexx (Antagonist cluster, Nederlandse servers).
- **Infrastructuur:** Data blijft binnen de EU/Nederland.
- **SMTP Beveiliging:** Gebruik van beveiligde SSL/TLS verbindingen met strikte certificaat-validatie (`rejectUnauthorized: true`).

### 4. Website Beveiliging
- **Security Headers:** Actief via `next.config.js` (A+ status).
    - `Content-Security-Policy` (CSP): Strenge controle op welke scripts en bronnen mogen laden.
    - `Iframe Sandboxing`: Alle externe content (PDF/Slides) wordt in een veilige 'sandbox' uitgevoerd.
    - `Strict-Transport-Security` (HSTS)
    - `X-Content-Type-Options`
    - `X-Frame-Options`
    - `Referrer-Policy`

---
*Moral Knight: Bescherming van de morele kreukelzone.*
