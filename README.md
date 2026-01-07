# MK Responsible AI

**Moral Knight** is a platform dedicated to responsible AI in the public domain. This repository contains the source code for the platform, built with **Next.js (Pages Router)** and **Tailwind CSS**.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (Pages Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Content**: Markdown (Local) & WordPress API (Remote Fallback)

## Project Structure

The project follows a standard Next.js structure with a few key conventions:

```
src/
├── components/   # React components (strictly typed)
├── data/         # STATIC CONTENT (Markdown files for tiles, moved from root)
├── lib/          # Utilities, configuration, and API handlers (WordPress)
├── pages/        # Next.js Pages (Routing)
│   ├── index.tsx # Main entry point (uses src/data + WordPress fallbacks)
│   └── blog/     # Blog routing
└── styles/       # Global styles and Tailwind imports
```

> **Note on Data**: Static content files (like `probleem_tekst.md`) reside in `src/data`. Do **not** move these files back to root or modify their internal structure without updating `index.tsx` logic.

## Data Fetching & Fallbacks

This project employs a robust **Hybrid Data Strategy**:

1.  **Local Static Content**: Core landing page content ("Probleem", "Oplossing") is read from `src/data/*.md` at build time (`getStaticProps`).
    *   **Fallback**: If these files are missing, the build will **not fail**. instead, it returns empty strings to ensure Vercel availability.
    
2.  **WordPress API**: Blog posts are fetched from an external WordPress instance defined in `.env.local` (`WORDPRESS_API_URL`).
    *   **Resiliency**: If the WordPress API is unreachable, `src/lib/wordpress.ts` catches errors to prevent build crashes, returning empty lists or null objects.

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

## Maintenance & Guidelines

- **Visual Consistency**: Global styles and Tailwind configuration are **frozen** to maintain visual parity. Do not modify `index.css` or `tailwind.config.js` unless explicitly authorized.
- **Dependency Management**: The dependency tree has been pruned. Run `npm prune` after removing packages to keep `package-lock.json` clean.
