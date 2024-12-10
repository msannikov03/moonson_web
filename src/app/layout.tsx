import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '../components/Providers'

const inter = Inter({ subsets: ['latin'], display: 'swap', adjustFontFallback: false})

export const metadata = {
  title: 'Your App Title',
  description: 'Your App Description',
  icons: {
    icon: '/favicon.ico',
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