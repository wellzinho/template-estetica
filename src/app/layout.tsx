import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { LenisProvider } from '@/components/providers/lenis-provider'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Lívia Monteiro | Estética Avançada',
  description:
    'Protocolos de estética avançada em Curitiba com ciência, precisão e naturalidade.',
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#22180f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(inter.variable, playfair.variable, cormorant.variable, 'font-sans')}
    >
      <body className="bg-[#22180f] text-marble">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
