import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'

import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthProvider'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import { TooltipProvider } from '@/components/ui/tooltip'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <AuthProvider>
        <TooltipProvider>
          <NextNProgress color="#FACC15" />
          <Component {...pageProps} />
        </TooltipProvider>

        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  )
}
