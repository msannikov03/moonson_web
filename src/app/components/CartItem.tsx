"use client";

import React, { useEffect } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import StaggeredDropDown from "./StaggeredDropdown";

interface CartItemProps {
  cartItem: {
    amount: number;
    product: {
      id: string;
      name: string;
      shortDesc: string;
      price: number;
      stock: number;
      imageSrc: string;
    };
  };
  cartKey: string;
  updateAmount: (cartKey: string, newAmount: number) => void;
  removeFromCart: (cartKey: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  cartItem,
  cartKey,
  updateAmount,
  removeFromCart,
}) => {
  useEffect(() => {
    updateAmount(cartKey, cartItem.amount);
  }, [cartItem.amount, cartKey, updateAmount]);

  return (
    <div className="w-full mb-4">
      <div className="border p-4 rounded">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <img
              className="h-16 w-16 object-cover"
              src="https://bulma.io/images/placeholders/128x128.png"
              alt={cartItem.product.shortDesc}
            />
          </div>
          <div className="flex-grow">
            <h5 className="font-semibold capitalize">
              {cartItem.product.name}{" "}
              <span className="inline-block bg-black text-white px-2 py-1 rounded">
                ${cartItem.product.price}
              </span>
            </h5>
            <p>{cartItem.product.shortDesc}</p>
            <div className="flex items-center mt-2">
              <button
                className="w-9 h-9 rounded-full border-2 border-dashed border-black bg-white flex items-center justify-center font-semibold text-xs text-black transition-transform duration-300 hover:translate-x-[-1.5px] hover:translate-y-[-1.5px] hover:shadow-[1.5px_1.5px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none"
                onClick={() =>
                  updateAmount(cartKey, Math.max(cartItem.amount - 1, 1))
                }
                aria-label="Decrease quantity"
              >
                <FiMinus size={20} />
              </button>
              <span className="mx-4">{`${cartItem.amount} in cart`}</span>
              <button
                className="w-9 h-9 rounded-full border-2 border-dashed border-black bg-white flex items-center justify-center font-semibold text-xs text-black transition-transform duration-300 hover:translate-x-[-1.5px] hover:translate-y-[-1.5px] hover:shadow-[1.5px_1.5px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none"
                onClick={() => updateAmount(cartKey, cartItem.amount + 1)}
                aria-label="Increase quantity"
              >
                <FiPlus size={20} />
              </button>
              <StaggeredDropDown />
            </div>
          </div>
          <button className="ml-4" onClick={() => removeFromCart(cartKey)}>
            <span className="text-red-500 hover:text-red-700">✖️</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
