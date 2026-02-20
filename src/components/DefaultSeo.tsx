import Head from 'next/head';

interface DefaultSeoProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

const DefaultSeo = ({
    title = "Moral Knight: De onafhankelijke waakhond van publieke AI",
    description = "Onafhankelijke toetsing van publieke AI systemen en algoritmes.",
    image = "https://www.moralknight.nl/social-preview-padded-v3.png?v=5",
    url = "https://www.moralknight.nl/",
    type = "website"
}: DefaultSeoProps) => {

    return (
        <Head>
            {/* UI / Browser Tags */}
            <meta name="theme-color" content="#061424" key="theme-color" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" key="viewport" />

            {/* Primary Meta Tags */}
            <title key="title">{title}</title>
            <meta name="description" content={description} key="description" />
            <meta name="keywords" content="AI ethiek, verantwoorde AI, publieke AI, AI audit, AI governance, chatbot testing, algoritme transparantie, Moral Knight" key="keywords" />
            <meta name="author" content="Moral Knight" key="author" />
            <meta name="robots" content="index, follow" key="robots" />
            <link rel="canonical" href={url} key="canonical" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} key="og:type" />
            <meta property="og:url" content={url} key="og:url" />
            <meta property="og:title" content={title} key="og:title" />
            <meta property="og:description" content={description} key="og:description" />
            <meta property="og:image" content={image} key="og:image" />
            <meta property="og:image:secure_url" content={image} key="og:image:secure" />
            <meta property="og:image:alt" content="Moral Knight Social Preview" key="og:image:alt" />
            <meta property="og:image:type" content="image/png" key="og:image:type" />
            <meta property="og:image:width" content="1200" key="og:image:width" />
            <meta property="og:image:height" content="630" key="og:image:height" />
            <meta property="og:locale" content="nl_NL" key="og:locale" />
            <meta property="og:site_name" content="Moral Knight" key="og:site" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
            <meta name="twitter:url" content={url} key="twitter:url" />
            <meta name="twitter:title" content={title} key="twitter:title" />
            <meta name="twitter:description" content={description} key="twitter:description" />
            <meta name="twitter:image" content={image} key="twitter:image" />
            <meta name="twitter:site" content="@moralknight" key="twitter:site" />
            <meta name="twitter:creator" content="@moralknight" key="twitter:creator" />


        </Head>
    );
};

export default DefaultSeo;
