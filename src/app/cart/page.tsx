"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "../../contexts/CartContext";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { InventoryItem } from "../../lib/db";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        setInventory(data);
      })
      .catch((error) => {
        console.error("Error fetching inventory:", error);
      });
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * 3400,
    0
  );

  const handleCheckout = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-gray-100"
      >
        <Link
          href="/"
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Обратно в магазин
        </Link>
        <h1 className="text-2xl font-bold">Ваша Корзина</h1>
      </motion.header>
      <main className="container mx-auto px-4 py-12 pt-24">
        {cartItems.length === 0 ? (
          <p className="text-center text-xl">
            Ваша корзина пуста. Переосмыслите ваши покупки!
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              {cartItems.map((item, index) => {
                const inventoryItem = inventory.find(
                  (invItem) =>
                    invItem.color === item.color && invItem.size === item.size
                );
                const maxAvailableQuantity = inventoryItem
                  ? inventoryItem.quantity
                  : 0;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between border-b border-gray-200 py-4"
                  >
                    <div>
                      <h3 className="font-bold">
                        Футболка Overthinker&apos;s Delight T-Shirt
                      </h3>
                      <p className="text-gray-600">
                        Цвет: {item.color}, Размер: {item.size}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              index,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="px-2 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => {
                            const newQuantity = item.quantity + 1;
                            if (newQuantity <= maxAvailableQuantity) {
                              updateQuantity(index, newQuantity);
                            } else {
                              alert(
                                `К сожалению, доступно только ${maxAvailableQuantity} шт. данного товара.`
                              );
                            }
                          }}
                          className="px-2 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                          disabled={item.quantity >= maxAvailableQuantity}
                        >
                          +
                        </button>
                      </div>
                      <p className="font-bold">
                        ₽{(item.quantity * 3400).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-100 p-6 rounded-lg"
              >
                <h2 className="text-2xl font-bold mb-4">Ваш Заказ</h2>
                <div className="flex justify-between mb-2">
                  <span>Суммарно:</span>
                  <span>₽{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Доставка:</span>
                  <span>Высчитывается позже</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Сумма:</span>
                  <span>₽{totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full mt-6 px-6 py-3 text-lg font-medium text-white bg-gray-900 rounded-full hover:bg-gray-700 transition-colors duration-300 disabled:bg-gray-400"
                >
                  {isProcessing ? "Обработка..." : "Перейти к оформлению"}
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
