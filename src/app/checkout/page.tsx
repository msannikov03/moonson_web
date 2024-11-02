"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useCart } from "../../contexts/CartContext";
import { ArrowLeft, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const router = useRouter();

  const [subtotal, setSubtotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce(
      (total, item) => total + item.quantity * 3400,
      0
    );
    setSubtotal(calculatedSubtotal);

    const shippingCost = shippingMethod === "express" ? 500 : 400;
    setTotalPrice(calculatedSubtotal + shippingCost);
  }, [cartItems, shippingMethod]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch("/api/update-inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update inventory");
      }
      clearCart();
      router.push("/order-confirmation");
    } catch (error: any) {
      console.error("Error processing order:", error);
      alert("There was an error processing your order: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 p-4 bg-white shadow-sm"
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link
            href="/cart"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Обратно в корзину
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Оформление заказа
          </h1>
        </div>
      </motion.header>
      <main className="container mx-auto px-4 py-8 pt-24">
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
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="lastName">Фамилия</Label>
                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                      />
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
                    <Label>Метод отправления</Label>
                    <RadioGroup
                      defaultValue="standard"
                      onValueChange={setShippingMethod}
                      className="flex flex-col space-y-2 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Отправка по России (₽500)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex items-center">
                          <Zap className="w-4 h-4 mr-2" />
                          Отправка по СПБ и Ленинградской области (₽400)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToPolicy"
                        checked={agreeToPolicy}
                        onCheckedChange={(checked: boolean) =>
                          setAgreeToPolicy(checked)
                        }
                      />
                      <Label htmlFor="agreeToPolicy" className="text-sm">
                        Я согласен с Политикой Конфиденциальности
                      </Label>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isProcessing || !agreeToPolicy}
                    className={`w-full ${
                      !agreeToPolicy ? "bg-gray-400 hover:bg-gray-400" : ""
                    }`}
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Оплатить ₽${totalPrice.toFixed(2)}`}
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
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>
                        {item.quantity}x Overthinker&apos;s Delight T-Shirt (
                        {item.color}, {item.size})
                      </span>
                      <span>₽{(item.quantity * 3400).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Предварительная сумма:</span>
                    <span>₽{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Доставка:</span>
                    <span>
                      ₽{shippingMethod === "express" ? "400.00" : "500.00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>К оплате:</span>
                    <span>₽{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
