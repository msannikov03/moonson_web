'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCart } from '../../contexts/CartContext'
import { ArrowLeft, Trash2 } from 'lucide-react'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * 29.99, 0)

  const handleCheckout = async () => {
    setIsProcessing(true)
    // Simulating an API call to a payment provider
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    window.location.href = '/checkout'
  }

  return  (
    <div className="min-h-screen bg-white text-gray-900">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 flex justify-between items-center bg-gray-100"
      >
        <Link href="/" className="flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Shop
        </Link>
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </motion.header>
      <main className="container mx-auto px-4 py-12">
        {cartItems.length === 0 ? (
          <p className="text-center text-xl">Your cart is empty. Start overthinking your purchases!</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              {cartItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between border-b border-gray-200 py-4"
                >
                  <div>
                    <h3 className="font-bold">Overthinker&apos;s Delight T-Shirt</h3>
                    <p className="text-gray-600">Color: {item.color}, Size: {item.size}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="px-2 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold">${(item.quantity * 29.99).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-100 p-6 rounded-lg"
              >
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full mt-6 px-6 py-3 text-lg font-medium text-white bg-gray-900 rounded-full hover:bg-gray-700 transition-colors duration-300 disabled:bg-gray-400"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}