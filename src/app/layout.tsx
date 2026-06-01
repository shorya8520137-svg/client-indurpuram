import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { LoadingScreen } from '@/components/loading-screen'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { LiveChat } from '@/components/live-chat'

export const metadata: Metadata = {
  title: 'Wasi Dental Clinic | Luxury Dental Care Mumbai',
  description: 'Premium cosmetic and family dentistry in Mumbai. Advanced technology, expert specialists, and personalized treatment experiences.',
  keywords: ['dental clinic Mumbai', 'cosmetic dentistry', 'dental implants', 'teeth whitening', 'smile design', 'Invisalign Mumbai'],
  openGraph: {
    title: 'Wasi Dental Clinic | Luxury Dental Care Mumbai',
    description: 'Crafting confident smiles through advanced dental excellence.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased bg-white text-[#0F1A12]">
        <Providers>
          <LoadingScreen />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <LiveChat />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  )
}
