import Head from 'next/head';

const DefaultSeo = () => {
    return (
        <Head>
            {/* Primary Meta Tags */}
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
            <meta property="og:image" content="https://www.moralknight.nl/social-preview-padded-v3.png?v=5" />
            <meta property="og:image:secure_url" content="https://www.moralknight.nl/social-preview-padded-v3.png?v=5" />
            <meta property="og:image:alt" content="Moral Knight Social Preview" />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content="nl_NL" />
            <meta property="og:site_name" content="Moral Knight" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:url" content="https://www.moralknight.nl/" />
            <meta name="twitter:title" content="Moral Knight: De onafhankelijke waakhond van publieke AI" />
            <meta name="twitter:description" content="Onafhankelijke toetsing." />
            <meta name="twitter:image" content="https://www.moralknight.nl/social-preview-padded-v3.png?v=5" />
            <meta name="twitter:site" content="@moralknight" />
            <meta name="twitter:creator" content="@moralknight" />
        </Head>
    );
};

export default DefaultSeo;
