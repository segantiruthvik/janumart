import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JANU ENTERPRISE - Premium Quality Food Distribution',
  description: 'Premium quality food distribution with rice, grains, oils, flour, biscuits, and snacks. Order now via WhatsApp.',
  keywords: 'food distribution, rice, grains, oils, flour, biscuits, snacks, premium quality',
  authors: [{ name: 'JANU ENTERPRISE' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'JANU ENTERPRISE - Premium Quality Food Distribution',
    description: 'Premium quality food distribution with rice, grains, oils, flour, biscuits, and snacks.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
