# MK Responsible AI

**Moral Knight** is a platform dedicated to responsible AI in the public domain. This repository contains the source code for the platform, built with **Next.js (Pages Router)** and **Tailwind CSS**.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (Pages Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Content**: Markdown (Lokaal, in `src/content/blog/`) — aangemaakt via de NotebookLM-workflow
- **Analytics**: [Simple Analytics](https://simpleanalyticscdn.com/) (cookieloos, privacy-vriendelijk)

## Project Structure

The project follows a standard Next.js structure with a few key conventions:

```
src/
├── components/   # React components (strictly typed)
├── content/
│   └── blog/     # Blogposts als Markdown (.md) — beheerd via NotebookLM
├── contexts/     # React Contexts (o.a. DarkModeContext)
├── data/         # Statische content (Markdown voor tiles)
├── hooks/        # Custom React hooks
├── lib/          # Utilities en configuratie
├── pages/        # Next.js Pages (Routing)
│   ├── index.tsx # Hoofdpagina (laadt tiles uit src/data)
│   ├── privacy.tsx
│   ├── visie.tsx
│   └── [[...slug]].tsx  # Dynamische blog-routes
├── types.ts      # Gedeelde TypeScript types
└── utils/        # Hulpfuncties
```

> **Note on Data**: Static content files (like `probleem_tekst.md`) reside in `src/data`. Do **not** move these files back to root or modify their internal structure without updating `index.tsx` logic.

## Content & Data

1.  **Landingspagina content**: Core teksten ("Probleem", "Oplossing") worden geladen uit `src/data/*.md` bij build time (`getStaticProps`).
    *   Als bestanden ontbreken, faalt de build **niet** — er worden lege strings teruggegeven.

2.  **Blog**: Blogposts zijn lokale Markdown-bestanden in `src/content/blog/`. Publiceren gaat via de NotebookLM-workflow (zie `docs/BLOG_WORKFLOW.md`).

> **Note**: WordPress-integratie is gearchiveerd. `src/lib/wordpress.ts` is aanwezig als legacy-bestand maar wordt niet meer actief gebruikt.

## Local Development

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Configuration (Environment Variables)

The application requires the following environment variables for email functionality:

- `SMTP_USER`: SMTP server username (e.g., info@moralknight.nl)
- `SMTP_PASS`: SMTP server password
- `SMTP_HOST`: SMTP server hostname (e.g., web0170.zxcs.nl)
- `SMTP_PORT`: SMTP server port (e.g., 465)

See `.env.local.example` for a template.

## Maintenance & Guidelines

- **Styling**: Globale stijlen staan zowel in `src/index.css` als als inline Tailwind-config in `src/pages/_document.tsx`. Wijzig alleen als dit expliciet nodig is.
- **Privacy**: Alle functies volgen het "Privacy by Design" principe. Wijzigingen aan formulieren (zoals `ReportForm.tsx`) moeten de technische anonimiteit van het meldpunt waarborgen (data stripping op client-side).
- **Security**: De `contact.ts` API route bevat strikte input validatie en rate limiting. Gebruik altijd `sanitize()` voor nieuwe input velden.


- **Blog publiceren**: Gebruik de NotebookLM-workflow zoals beschreven in `docs/BLOG_WORKFLOW.md`.
