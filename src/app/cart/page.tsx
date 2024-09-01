"use client";

import React from "react";
import withContext from "../context/withContext";
import CartItem from "../components/CartItem";
import { CartContextType, CartItem as CartItemType } from "../context/CartContext";

interface CartProps {
  context: CartContextType;
}

const Cart: React.FC<CartProps> = ({ context }) => {
  const { cart, updateCart } = context;
  const cartKeys = Object.keys(cart || {});

  const updateAmount = (cartKey: string, newAmount: number) => {
    const updatedCart = { ...cart };
    updatedCart[cartKey].amount = newAmount;
    updateCart(updatedCart);
  };

  return (
    <>
      <div className="bg-black text-center py-8">
        <h4 className="text-xl font-semibold text-white">My Cart</h4>
      </div>
      <br />
      <div className="container mx-auto px-4">
        {cartKeys.length ? (
          <div className="flex flex-wrap -m-2">
            {cartKeys.map((key) => (
              <div className="w-full lg:w-1/2 p-2" key={key}>
                <CartItem
                  cartKey={key}
                  cartItem={cart[key]}
                  removeFromCart={context.removeFromCart}
                  updateAmount={updateAmount}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-400">No item in cart!</div>
          </div>
        )}
      </div>
    </>
  );
};

export default withContext(Cart);