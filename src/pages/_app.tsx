import type { AppProps } from 'next/app'
import '../index.css'
import { DarkModeProvider } from '../contexts/DarkModeContext'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <DarkModeProvider>
            <Component {...pageProps} />
        </DarkModeProvider>
    )
}
