import type { AppProps } from 'next/app'
import Script from 'next/script'
import '../index.css'
import { DarkModeProvider } from '../contexts/DarkModeContext'
import DefaultSeo from '../components/DefaultSeo'

export default function App({ Component, pageProps }: AppProps) {

    return (
        <>
            <DarkModeProvider>
                <DefaultSeo />
                <Component {...pageProps} />
            </DarkModeProvider>

            {/* Simple Analytics - 100% Privacy Friendly, No Cookies */}
            <Script src="https://scripts.simpleanalyticscdn.com/latest.js" strategy="afterInteractive" />
            <noscript>
                {/* Fallback for when JavaScript is disabled */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" referrerPolicy="no-referrer-when-downgrade" />
            </noscript>
        </>
    )
}
