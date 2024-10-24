'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '../contexts/CartContext'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [color, setColor] = useState('black')
  const [size, setSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const { addToCart, cartItems } = useCart()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const features = [
    {
      title: "Thought-Provoking Design",
      description: "Each shirt features a unique, mind-bending graphic that's guaranteed to start conversations – mostly with yourself.",
      image: "./images/logo.jpg"
    },
    {
      title: "Premium Overthinking Material",
      description: "Made from 100% organic cotton, providing the perfect blend of comfort and existential crisis.",
      image: "./images/logo.jpg"
    },
    {
      title: "Paradoxical Comfort",
      description: "The more you overthink about how comfortable this shirt is, the more comfortable it becomes.",
      image: "./images/logo.jpg"
    }
  ]

  const handleAddToCart = () => {
    addToCart({ color, size, quantity })
  }

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
  }

  const handleSizeChange = (newSize: string) => {
    setSize(newSize)
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + change))
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-4 flex justify-between items-center bg-gray-100"
      >
        <h1 className="text-2xl font-bold">Moonson</h1>
        <div className="flex items-center gap-4">
          <img src="./images/logo.jpg" alt="Moonson" className="w-8 h-8" />
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </motion.header>
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4">Wear Your Thoughts</h2>
          <p className="text-xl md:text-2xl text-gray-600">Because simple ideas are just too mainstream</p>
        </motion.div>
        <div className="flex flex-col md:flex-row items-start justify-center gap-12 mb-16">
          <div className="flex flex-col items-center md:items-start gap-8 w-full md:w-auto">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="relative"
            >
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <motion.img
                  src="./images/logo.jpg"
                  alt="Overthinking T-Shirt"
                  className="w-48 h-48 md:w-64 md:h-64 object-cover"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                />
              </div>
              <motion.div
                className="absolute -top-4 -right-4 bg-gray-800 text-white font-bold py-2 px-4 rounded-full transform rotate-12"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1.5 }}
              >
                New!
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="bg-gray-100 p-6 rounded-lg w-full max-w-md"
            >
              <h4 className="font-bold text-xl mb-4">Perks of this T-shirt:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Increases your daily existential crises by 200%</li>
                <li>Doubles as a conversation starter and ender</li>
                <li>Comes with a free mental workout every time you wear it</li>
                <li>Scientifically proven to make decisions harder</li>
                <li>Enhances your ability to find problems in solutions</li>
                <li>Guaranteed to make simple tasks complex</li>
                <li>Boosts your capacity to create imaginary scenarios</li>
                <li>Comes with a built-in excuse generator for social events</li>
              </ul>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="max-w-md w-full"
          >
            <h3 className="text-3xl font-bold mb-4">The Overthinker&apos;s Delight</h3>
            <p className="text-lg mb-6">
              Dive into the depths of your psyche with our latest design. This shirt doesn&apos;t just make a statement;
              it starts a whole internal dialogue.
            </p>
            <div className="mb-6">
              <h4 className="font-bold mb-2">Color:</h4>
              <div className="flex gap-4">
                <button
                  onClick={() => handleColorChange('black')}
                  className={`w-8 h-8 rounded-full ${color === 'black' ? 'ring-2 ring-gray-500' : ''} bg-black`}
                  aria-label="Black"
                />
                <button
                  onClick={() => handleColorChange('white')}
                  className={`w-8 h-8 rounded-full ${color === 'white' ? 'ring-2 ring-gray-500' : ''} bg-white border border-gray-300`}
                  aria-label="White"
                />
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-bold mb-2">Size:</h4>
              <div className="flex gap-4">
                {['S', 'M', 'L', 'XL'].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSizeChange(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      size === s
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-bold mb-2">Quantity:</h4>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                >
                  -
                </button>
                <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="group inline-flex items-center justify-center px-8 py-3 w-full text-lg font-medium text-white bg-gray-900 rounded-full hover:bg-gray-700 transition-colors duration-300"
            >
              Overthink This Purchase
              <ShoppingCart className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 + index * 0.2 }}
              className="bg-gray-100 rounded-lg overflow-hidden"
            >
              <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 mr-4">Privacy Policy</Link>
          <Link href="/terms-conditions" className="text-gray-600 hover:text-gray-900">Terms & Conditions</Link>
        </div>
      </main>
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="text-center py-8 bg-gray-100 text-gray-700"
      >
        <p>&copy; 2023 Moonson. All rights reserved. Or are they?</p>
      </motion.footer>
    </div>
  )
}