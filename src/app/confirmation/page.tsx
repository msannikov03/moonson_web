'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '../../hooks/useCart'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderConfirmation() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()

  useEffect(() => {
    const cartData = searchParams.get('cartData')
    if (cartData) {
      // Process the order data if needed
      console.log('Order placed:', JSON.parse(cartData))
      // Clear the cart
      clearCart()
    }
  }, [searchParams, clearCart])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>
          <CardTitle className="text-center mt-4">Заказ подтвержден!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Спасибо за покупку. Ваш заказ был успешно оформлен.</p>
          <p>Детали вашего заказы были направлены на адрес электронной почты.</p>
          <Button asChild>
            <Link href="/">На домашнюю страницу</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}