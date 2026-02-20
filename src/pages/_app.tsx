import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'
import '../index.css'
import { DarkModeProvider } from '../contexts/DarkModeContext'
import DefaultSeo from '../components/DefaultSeo'

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            window.gtag?.('config', 'G-2XL7TXM9SR', {
                page_path: url,
            })
        }
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events])

    return (
        <>
            <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-2XL7TXM9SR" />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-2XL7TXM9SR', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
            <DarkModeProvider>
                <DefaultSeo />
                <Component {...pageProps} />
            </DarkModeProvider>
        </>
    )
}
