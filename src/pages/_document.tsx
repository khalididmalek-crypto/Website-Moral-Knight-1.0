import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="nl">
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="description" content="Onafhankelijke toetsing." />
        <meta name="keywords" content="AI ethiek, verantwoorde AI, publieke AI, AI audit, AI governance, chatbot testing, algoritme transparantie" />
        <meta name="author" content="Moral Knight" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.moralknight.nl" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.moralknight.nl/" />
        <meta property="og:title" content="Moral Knight: De onafhankelijke waakhond van publieke AI" />
        <meta property="og:description" content="Onafhankelijke toetsing." />
        <meta property="og:image" content="https://www.moralknight.nl/social-preview-padded-v3.png?v=4" />
        <meta property="og:image:secure_url" content="https://www.moralknight.nl/social-preview-padded-v3.png?v=4" />
        <meta property="og:image:alt" content="Moral Knight Social Preview" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="nl_NL" />
        <meta property="og:site_name" content="Moral Knight" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.moralknight.nl/" />
        <meta name="twitter:title" content="Moral Knight: De onafhankelijke waakhond van publieke AI" />
        <meta name="twitter:description" content="Onafhankelijke toetsing." />
        <meta name="twitter:image" content="https://www.moralknight.nl/social-preview-padded-v3.png?v=4" />
        <meta name="twitter:site" content="@moralknight" />
        <meta name="twitter:creator" content="@moralknight" />

        {/* Favicon / Icons */}

        <meta name="theme-color" content="#061424" />
        {/* Tailwind CDN and Config */}
        <script src="https://cdn.tailwindcss.com" defer></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Caveat:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      'bg-app': '#F7F7F7',
                      'grid-line': '#E0E0E0',
                      'text-main': '#111111',
                      'accent': '#5F6F5A',
                      'accent-light': '#E7E6E3',
                      'highlight-green': '#37422F',
                      'tile-background-highlight': '#EEF3EA',
                    },
                    fontFamily: {
                      sans: ['Inter', 'sans-serif'],
                      mono: ['"IBM Plex Mono"', 'monospace'],
                      hand: ['Caveat', 'cursive'],
                    },
                    maxWidth: {
                      'grid': '1200px',
                    },
                    animation: {
                      'flicker': 'flicker 0.15s infinite',
                      'retro-boot': 'retro-boot 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                      'retro-shutdown': 'retro-shutdown 0.5s ease-in forwards',
                    },
                    keyframes: {
                      flicker: {
                        '0%': { opacity: '0.02' },
                        '50%': { opacity: '0.05' },
                        '100%': { opacity: '0.02' },
                      },
                      'retro-boot': {
                        '0%': { opacity: '0', transform: 'scale(0.96) skewX(1deg)', filter: 'blur(8px) brightness(0.2)' },
                        '10%': { opacity: '0.6', transform: 'scale(0.98) skewX(-0.5deg)', filter: 'blur(4px)' },
                        '15%': { opacity: '0.1', filter: 'blur(10px)' }, /* Flicker Out (Bad connection) */
                        '30%': { opacity: '0.8', transform: 'scale(1.005) skewX(0.25deg)', filter: 'blur(2px) brightness(1.2)' }, /* Bulb Surge */
                        '50%': { opacity: '0.9', transform: 'scale(0.995)', filter: 'blur(0.5px)' },
                        '70%': { opacity: '1', transform: 'scale(1.001)', filter: 'blur(0.2px)' },
                        '100%': { opacity: '1', transform: 'scale(1) skewX(0deg)', filter: 'blur(0)' },
                      },
                      'retro-shutdown': {
                        '0%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
                        '20%': { opacity: '0.8', transform: 'scale(1.02)', filter: 'blur(1px) brightness(1.5)' }, /* Bulb flash before die */
                        '100%': { opacity: '0', transform: 'scale(0.9) skewX(4deg)', filter: 'blur(12px) brightness(0)' },
                      }
                    }
                  }
                }
              }
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                background-color: #F7F7F7;
                color: #111111;
                margin: 0;
                font-family: 'Inter', sans-serif;
              }
          
              .ral-6035-text {
                color: #194D25;
              }
          
              /* Clean Dashboard Scrollbar */
              ::-webkit-scrollbar {
                width: 8px;
              }
          
              ::-webkit-scrollbar-track {
                background: transparent;
              }
          
              ::-webkit-scrollbar-thumb {
                background: #E0E0E0;
                border-radius: 4px;
              }
          
              ::-webkit-scrollbar-thumb:hover {
                background: #BEBEBE;
              }
          
              .projector-noise {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 50;
                opacity: 0.03;
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
              }
            `,
          }}
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Moral Knight",
              "description": "Verantwoorde AI audit en governance voor het publieke domein",
              "url": "https://www.moralknight.nl",
              "logo": "https://www.moralknight.nl/MK logo.png",
              "foundingDate": "2025",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "NL",
                "addressLocality": "Nederland"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "availableLanguage": "Dutch"
              },
              "sameAs": [
                "https://linkedin.com/company/moralknight"
              ],
              "keywords": "AI ethiek, verantwoorde AI, AI audit, AI governance, publieke AI, chatbot testing"
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
