import type { AppProps } from 'next/app'
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
        </>
    )
}
