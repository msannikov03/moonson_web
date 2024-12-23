import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '../components/Providers'

const inter = Inter({ subsets: ['latin'], display: 'swap', adjustFontFallback: false})

export const metadata = {
  title: 'Mont Noir — Wear Your Thoughts',
  description: 'Мы - Mont Noir, бренд, который превращает ваши мысли в реальность. Мы с гордостью представляем эксклюзивную коллекцию футболок, разработанную с учетом вашего комфорта и предпочтений.',
  icons: {
    icon: [
      { url: '/favicon.ico', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.ico', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

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