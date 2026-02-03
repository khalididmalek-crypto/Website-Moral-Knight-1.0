# NotebookLM Blog Workflow

Dit document beschrijft hoe je **Google NotebookLM** gebruikt als jouw CMS (Content Management Systeem) en hoe je de Agent vraagt om artikelen te publiceren.

## Stap 1: Schrijven in NotebookLM

1.  Ga naar [Google NotebookLM](https://notebooklm.google.com/).
2.  Open je notitieboek (bijv. "MK Responsible AI Blog").
3.  **Optie A: Nieuwe Notitie (Aanbevolen)**
    *   Klik linksboven op het **plus-icoon (+)** of "Nieuwe notitie toevoegen".
    *   Titel: Dit wordt de titel van je blogpost (bijv. *"De ethiek van autonome wapens"*).
    *   Inhoud: Schrijf hier je volledige artikel. Je kunt gewoon typen, plakken, of bulletpoints gebruiken.
4.  **Optie B: Bronbestand**
    *   Je kunt ook een Google Doc of PDF uploaden als bron. Zorg dat de titel van het document duidelijk is.

## Stap 2: De Agent Instrueren

Wanneer je klaar bent met schrijven, ga je naar je terminal (of chat met mij) en zeg je:

> "Hé Agent, haal mijn notitie over 'autonome wapens' uit NotebookLM en publiceer het."

## Stap 3: Wat de Agent doet (De "Brug")

1.  **Lezen**: Ik verbind met jouw NotebookLM en zoek de notitie die je bedoelt.
2.  **Formatteren**: Ik zet de tekst om naar het juiste formaat voor jouw website (Markdown).
    *   Ik voeg een datum toe (vandaag).
    *   Ik maak een korte samenvatting (excerpt).
    *   Ik bepaal een passende 'tag' (bijv. Maatschappij, Technologie).
3.  **Aanmaken**: Ik maak een nieuw bestand aan in `src/content/blog/`.
4.  **Bevestigen**: Ik vraag jou om de wijzigingen te controleren en te `git push`-en.

## Stap 4: Resultaat

Na jouw goedkeuring staat het artikel direct op:
*   De Desktop site (via de Blog tegel).
*   De Mobiele site (via de nieuwe Blog sectie).
*   Direct via de link `/blog/jouw-titel-slug`.

---

**Tip**: Je kunt ook meerdere ideeën in één notitie zetten. Vraag mij dan specifiek: *"Maak een blogpost van de tweede alinea over privacy."*
