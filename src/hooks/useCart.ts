import { useState, useEffect } from 'react'

type CartItem = {
  color: string
  size: string
  quantity: number
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        i => i.color === item.color && i.size === item.size
      )
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      }
      return [...prevItems, item]
    })
  }

  const removeFromCart = (index: number) => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index))
  }

  const updateQuantity = (index: number, newQuantity: number) => {
    setCartItems(prevItems => {
      const updatedItems = [...prevItems]
      updatedItems[index].quantity = newQuantity
      return updatedItems
    })
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  return { cartItems, addToCart, removeFromCart, updateQuantity, clearCart }
}