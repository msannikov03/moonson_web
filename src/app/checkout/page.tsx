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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

declare global {
  interface Window {
    pay: (form: HTMLFormElement) => void;
  }
}

interface CartItem {
  color: string;
  size: string;
  quantity: number;
}

interface ShippingItem {
  color: null;
  size: null;
  quantity: number;
  name: string;
  price: number;
}

type CartItemWithShipping = CartItem | ShippingItem;

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("russia");
  const router = useRouter();

  const [subtotal, setSubtotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payLoaded, setPayLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js";
    script.onload = () => {
      setPayLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load payment script");
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const shippingCost = shippingMethod === "spb" ? 400 : 500;
    const calculatedSubtotal = cartItems.reduce(
      (total, item) => total + item.quantity * 3400,
      0
    );
    setSubtotal(calculatedSubtotal);
    setTotalPrice(calculatedSubtotal + shippingCost);
  }, [cartItems, shippingMethod]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (!payLoaded || typeof window.pay !== "function") {
        alert("Payment script not loaded. Please try again later.");
        setIsProcessing(false);
        return;
      }

      const orderNumber = "Order" + Date.now();
      const fullName = `${firstName} ${lastName}`;
      const shippingCost = shippingMethod === "spb" ? 400 : 500;

      const cartItemsWithShipping: CartItemWithShipping[] = [
        ...cartItems,
        {
          color: null,
          size: null,
          quantity: 1,
          name:
            shippingMethod === "spb"
              ? "Shipping to SPB and Leningrad Region"
              : "Shipping within Russia",
          price: shippingCost,
        },
      ];

      const items = cartItemsWithShipping.map((item) => {
        let priceInKopeks: number;
        let amountInKopeks: number;
        let itemName: string;
        let paymentObject: string;
        let tax: string;

        if ("name" in item) {
          priceInKopeks = Math.round(item.price * 100);
          amountInKopeks = priceInKopeks * item.quantity;
          itemName = item.name;
          paymentObject = "service";
          tax = "none";
        } else {
          const productPrice = 3400;
          priceInKopeks = Math.round(productPrice * 100);
          amountInKopeks = priceInKopeks * item.quantity;
          itemName = `Overthinker's Delight T-Shirt (${item.color}, ${item.size})`;
          paymentObject = "commodity";
          tax = "none";
        }

        return {
          Name: itemName,
          Price: priceInKopeks.toString(),
          Quantity: item.quantity.toString(),
          Amount: amountInKopeks.toString(),
          PaymentMethod: "full_prepayment",
          PaymentObject: paymentObject,
          Tax: tax,
        };
      });

      const totalAmountInKopeks = items.reduce(
        (sum, item) => sum + parseInt(item.Amount),
        0
      );

      const totalAmountInRubles = totalAmountInKopeks / 100;

      const receipt = {
        Email: email,
        Phone: phone,
        EmailCompany: "support@montnoir.ru",
        Taxation: "usn_income_outcome",
        FfdVersion: "1.2",
        Items: items,
        Customer: {
          Contact: fullName,
          DeliveryInfo: {
            Address: address,
          },
        },
      };

      const receiptJson = JSON.stringify(receipt);

      const TPF = {
        terminalkey: "1730402391966DEMO",
        frame: "false",
        language: "ru",
        amount: totalAmountInRubles.toFixed(2),
        order: orderNumber,
        description: "Оплата заказа",
        name: fullName,
        email: email,
        phone: phone,
        Receipt: encodeURIComponent(receiptJson),
        successurl: "https://montnoir.ru/confirmation",
        failurl: "https://montnoir.ru/not-found",
      };

      // Validate amounts
      if (parseFloat(TPF.amount) !== totalAmountInRubles) {
        alert("There was an error processing your payment. Please try again.");
        setIsProcessing(false);
        return;
      }

      const form = document.createElement("form");

      Object.entries(TPF).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      window.pay(form);
    } catch (error: any) {
      alert("There was an error processing your payment: " + error.message);
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
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="lastName">Фамилия</Label>
                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Адрес электронной почты</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Адрес доставки</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Метод отправления</Label>
                    <RadioGroup
                      defaultValue="russia"
                      onValueChange={setShippingMethod}
                      className="flex flex-col space-y-2 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="russia" id="russia" />
                        <Label htmlFor="russia" className="flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Отправка по России (₽500)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="spb" id="spb" />
                        <Label htmlFor="spb" className="flex items-center">
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
                      ? "Обработка..."
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
                        {item.quantity}x Overthinker's Delight T-Shirt (
                        {item.color}, {item.size})
                      </span>
                      <span>₽{(item.quantity * 3400).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm">
                    <span>
                      Доставка:{" "}
                      {shippingMethod === "spb"
                        ? "СПБ и Ленинградская область"
                        : "По России"}
                    </span>
                    <span>
                      ₽
                      {shippingMethod === "spb" ? "400.00" : "500.00"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Предварительная сумма:</span>
                    <span>₽{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Доставка:</span>
                    <span>
                      ₽{shippingMethod === "spb" ? "400.00" : "500.00"}
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