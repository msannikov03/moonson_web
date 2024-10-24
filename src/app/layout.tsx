import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '../contexts/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Moonson - Wear Your Thoughts',
  description: 'Overthink your fashion choices with Moonson t-shirts.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}