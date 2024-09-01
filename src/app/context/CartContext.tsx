"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import auth from '../../../token.json';

export interface Product {
    id: string;
    name: string;
    stock: number;
    shortDesc: string;
    price: number;
    imageSrc: string;
  }

export interface CartItem {
  id: string;
  amount: number;
  product: Product;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CartContextType {
  user: User | null;
  cart: Record<string, CartItem>;
  products: Product[];
  signup: (name: string, surname: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: Product, callback?: () => void) => void;
  addToCart: (cartItem: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  checkout: () => void;
  updateCart: (updatedCart: Record<string, CartItem>) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userJson = localStorage.getItem("user");
      const cartJson = localStorage.getItem("cart");

      const productsResponse = await axios.get('https://localhost:5000/data/products/get/', { headers: { 'Authorization': auth } });

      const user = userJson ? JSON.parse(userJson) as User : null;
      const cart = cartJson ? JSON.parse(cartJson) : {};

      setUser(user);
      setProducts(productsResponse.data);
      setCart(cart);
    };

    fetchData();
  }, []);

  const signup = async (name: string, surname: string, email: string, password: string) => {
    const res = await axios.post(
      'https://localhost:5000/data/users/create',
      { name, surname, email, password },
      { headers: { 'Authorization': auth } }
    );

    if (res.status === 200) {
      if (res.data === '10003') {
        return false; // user exists
      } else {
        return true;
      }
    } else {
      console.log(res.data);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const res = await axios.post(
      'https://localhost:5000/login',
      { email, password },
      { headers: { 'Authorization': auth } }
    );

    if (res.status === 200) {
      if (res.data === '10001') {
        return false; // user does not exist
      } else if (res.data === '10002') {
        return false; // wrong password
      } else {
        console.log(res.data);
        return true;
      }
    } else {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const addProduct = (product: Product, callback?: () => void) => {
    const newProducts = [...products, product];
    setProducts(newProducts);
    if (callback) callback();
  };

  const addToCart = (cartItem: CartItem) => {
    const newCart = { ...cart };
    if (newCart[cartItem.id]) {
      newCart[cartItem.id].amount += cartItem.amount;
    } else {
      newCart[cartItem.id] = cartItem;
    }
    if (newCart[cartItem.id].amount > newCart[cartItem.id].product.stock) {
      newCart[cartItem.id].amount = newCart[cartItem.id].product.stock;
    }
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };

  const updateCart = (updatedCart: Record<string, CartItem>) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (cartItemId: string) => {
    const newCart = { ...cart };
    delete newCart[cartItemId];
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart");
  };

  const checkout = () => {
    if (!user) {
      return; // Just return if there's no user; handle the redirect in the component
    }

    const newProducts = products.map((p) => {
      if (cart[p.id]) {
        p.stock -= cart[p.id].amount;

        axios.put(
          `http://localhost:3001/products/${p.id}`,
          { ...p }
        );
      }
      return p;
    });

    setProducts(newProducts);
    clearCart();
  };

  return (
    <CartContext.Provider
      value={{
        user,
        cart,
        products,
        signup,
        login,
        logout,
        addProduct,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
        updateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};