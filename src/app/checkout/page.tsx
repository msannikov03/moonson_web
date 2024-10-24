'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCart } from '../../contexts/CartContext'
import { ArrowLeft } from 'lucide-react'

export default function Checkout() {
  const { cartItems } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingMethod, setShippingMethod] = useState('standard')

  const subtotal = cartItems.reduce((total, item) => total + item.quantity * 29.99, 0)
  const shippingCost = shippingMethod === 'express' ? 15 : 5
  const totalPrice = subtotal + shippingCost

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulating an API call to process the order
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    alert('Order placed successfully!')
    // Here you would typically redirect to a confirmation page or clear the cart
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 flex justify-between items-center bg-gray-100"
      >
        <Link href="/cart" className="flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Cart
        </Link>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </motion.header>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Order</h2>
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <span>{item.quantity}x Overthinker's Delight T-Shirt ({item.color}, {item.size})</span>
                <span>${(item.quantity * 29.99).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Shipping:</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" name="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" id="phone" name="phone" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Shipping Address</label>
                <textarea id="address" name="address" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"></textarea>
              </div>
              <div>
                <label htmlFor="shipping" className="block text-sm font-medium text-gray-700">Shipping Method</label>
                <select
                  id="shipping"
                  name="shipping"
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                >
                  <option value="standard">Standard Shipping ($5)</option>
                  <option value="express">Express Shipping ($15)</option>
                </select>
              </div>
              <div>
                <label htmlFor="card" className="block text-sm font-medium text-gray-700">Card Number</label>
                <input type="text" id="card" name="card" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" />
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full px-6 py-3 text-lg font-medium text-white bg-gray-900 rounded-full hover:bg-gray-700 transition-colors duration-300 disabled:bg-gray-400"
              >
                {isProcessing ? 'Processing...' : `Place Order - $${totalPrice.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}