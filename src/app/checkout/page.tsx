'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../../contexts/CartContext' // Updated import
import { ArrowLeft, Truck, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Checkout() {
  const { cartItems, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const router = useRouter()

  const [subtotal, setSubtotal] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce((total, item) => total + item.quantity * 29.99, 0)
    setSubtotal(calculatedSubtotal)

    const shippingCost = shippingMethod === 'express' ? 500 : 400
    setTotalPrice(calculatedSubtotal + shippingCost)
  }, [cartItems, shippingMethod])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      // Simulating an API call to process the order
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulated API call (commented out)
      /*
      const response = await fetch('/api/process-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          shippingMethod,
          totalPrice,
        }),
      })
      const data = await response.json()
      */

      // Clear the cart and redirect to the confirmation page
      clearCart()
      router.push('/order-confirmation')
    } catch (error) {
      console.error('Error processing order:', error)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 bg-white shadow-sm"
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/cart" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Обратно в корзину
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Оформление Заказа</h1>
        </div>
      </motion.header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Информация для доставки</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="firstName">Имя</Label>
                      <Input type="text" id="firstName" name="firstName" required />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="lastName">Фамилия</Label>
                      <Input type="text" id="lastName" name="lastName" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Адрес электронной почты</Label>
                    <Input type="email" id="email" name="email" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input type="tel" id="phone" name="phone" required />
                  </div>
                  <div>
                    <Label htmlFor="address">Адрес доставки</Label>
                    <Textarea id="address" name="address" required />
                  </div>
                  <div>
                    <Label>Метод доставки</Label>
                    <RadioGroup defaultValue="standard" onValueChange={setShippingMethod} className="flex flex-col space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Доставка по СПБ и Лен. Области (₽400)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex items-center">
                          <Zap className="w-4 h-4 mr-2" />
                          Доставка по РФ (₽500)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ваш заказ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{item.quantity}x Overthinker's Delight T-Shirt ({item.color}, {item.size})</span>
                      <span>₽{(item.quantity * 3400).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Предварительно:</span>
                    <span>₽{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Доставка:</span>
                    <span>₽{shippingMethod === 'express' ? '500.00' : '400.00'}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Сумма:</span>
                    <span>₽{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}