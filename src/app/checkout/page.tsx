"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const [promoCodes, setPromoCodes] = useState<string[]>([]);
  const [currentPromoCode, setCurrentPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [freeShipping, setFreeShipping] = useState(false);
  const [promoError, setPromoError] = useState("");

  // ADDED: Simple client-side validators
  function isEmailValid(email: string) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  }
  function isPhoneValid(phone: string) {
    return /^\+?\d{7,15}$/.test(phone);
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js";
    script.async = true;
    script.onload = () => {
      setPayLoaded(true);
    };
    script.onerror = () => {
      console.error("Не удалось загрузить скрипт оплаты");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const shippingCost = freeShipping
      ? 0
      : shippingMethod === "spb"
      ? 400
      : 500;
    const calculatedSubtotal = cartItems.reduce(
      (total, item) => total + item.quantity * 3400,
      0
    );

    const calculatedDiscount = (calculatedSubtotal * discount) / 100;
    const newTotalPrice =
      calculatedSubtotal - calculatedDiscount + shippingCost;

    setSubtotal(calculatedSubtotal);
    setTotalPrice(newTotalPrice);
  }, [cartItems, shippingMethod, discount, freeShipping]);

  const handleApplyPromo = async () => {
    const code = currentPromoCode.trim();

    if (!code) {
      setPromoError("Пожалуйста, введите промокод.");
      return;
    }

    if (promoCodes.length >= 2) {
      setPromoError("Можно применить только два промокода.");
      return;
    }

    if (promoCodes.includes(code.toLowerCase())) {
      setPromoError("Этот промокод уже применен.");
      return;
    }

    try {
      const response = await fetch("/api/promocodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codes: [code] }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setPromoCodes([...promoCodes, code.toLowerCase()]);
        setDiscount((prev) => prev + data.totalDiscountPercent);
        if (data.freeShipping) {
          setFreeShipping(true);
        }
        setPromoError("");
        setCurrentPromoCode("");
      } else {
        setPromoError(data.message || "Неверный промокод.");
      }
    } catch (error: any) {
      console.error("Ошибка при применении промокода:", error);
      setPromoError("Произошла ошибка при применении промокода.");
    }
  };

  const handleRemovePromoCode = async (codeToRemove: string) => {
    const updatedPromoCodes = promoCodes.filter(
      (c) => c !== codeToRemove.toLowerCase()
    );
    setPromoCodes(updatedPromoCodes);

    if (updatedPromoCodes.length === 0) {
      setDiscount(0);
      setFreeShipping(false);
      setPromoError("");
      return;
    }

    try {
      const response = await fetch("/api/promocodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codes: updatedPromoCodes }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        const totalDiscount = data.totalDiscountPercent;
        setDiscount(totalDiscount);
        setFreeShipping(data.freeShipping);
        setPromoError("");
      } else {
        setPromoError(data.message || "Ошибка при обновлении промокодов.");
      }
    } catch (error: any) {
      console.error("Ошибка при обновлении промокодов:", error);
      setPromoError("Произошла ошибка при обновлении промокодов.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (!isEmailValid(email)) {
        alert("Неверный формат email");
        setIsProcessing(false);
        return;
      }
      if (!isPhoneValid(phone)) {
        alert("Неверный формат телефона");
        setIsProcessing(false);
        return;
      }

      const newOrderNumber = "Order" + Date.now();

      const dbPayload = {
        orderNumber: newOrderNumber,
        firstName,
        lastName,
        email,
        phone,
        address,
        shippingMethod,
        cartItems,
        subtotal,
        totalPrice,
        coupons: promoCodes,
      };

      const dbResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbPayload),
      });

      const dbData = await dbResponse.json();
      if (!dbData.success) {
        alert("Ошибка создания заказа: " + dbData.error);
        setIsProcessing(false);
        return;
      }

      if (!payLoaded || typeof window.pay !== "function") {
        alert("Скрипт оплаты не загружен. Пожалуйста, попробуйте позже.");
        setIsProcessing(false);
        return;
      }

      const shippingCost = freeShipping
        ? 0
        : shippingMethod === "spb"
        ? 400
        : 500;
      const calculatedDiscount = (subtotal * discount) / 100;
      const discountedSubtotal = subtotal - calculatedDiscount;

      const cartItemsWithShipping: CartItemWithShipping[] = [
        ...cartItems,
        {
          color: null,
          size: null,
          quantity: 1,
          name:
            shippingMethod === "spb"
              ? "Доставка по СПБ и Ленинградской области"
              : "Доставка по России",
          price: shippingCost,
        },
      ];

      const items = cartItemsWithShipping.map((item) => {
        let priceInKopeks: number;
        let amountInKopeks: number;
        let itemName: string;
        let paymentObject: string;
        let tax = "none";
        let measurementUnit = "шт";

        if ("name" in item) {
          priceInKopeks = Math.round(item.price * 100);
          amountInKopeks = priceInKopeks * item.quantity;
          itemName = item.name;
          paymentObject = "service";
          tax = "none";
          measurementUnit = "шт";
        } else {
          const productPrice = 3400 * (1 - discount / 100);
          priceInKopeks = Math.round(productPrice * 100);
          amountInKopeks = priceInKopeks * item.quantity;
          itemName = `Overthinker's Delight T-Shirt (${item.color}, ${item.size})`;
          paymentObject = "commodity";
          tax = "none";
          measurementUnit = "шт";
        }

        return {
          Name: itemName,
          Price: priceInKopeks.toString(),
          Quantity: item.quantity.toString(),
          Amount: amountInKopeks.toString(),
          PaymentMethod: "full_prepayment",
          PaymentObject: paymentObject,
          Tax: tax,
          MeasurementUnit: measurementUnit,
        };
      });

      const totalAmountInKopeks = Math.round(
        (discountedSubtotal + shippingCost) * 100
      );

      const Receipt = {
        EmailCompany: "support@montnoir.ru",
        Taxation: "usn_income_outcome",
        FfdVersion: "1.2",
        Items: items,
      };

      const receiptJson = JSON.stringify(Receipt);

      const orderNumber = newOrderNumber;
      const fullName = `${firstName} ${lastName}`;
      const returnUrl = `${process.env.NEXT_PUBLIC_YOUR_DOMAIN}/confirmation?order=${orderNumber}`;
      const failUrl = `${process.env.NEXT_PUBLIC_YOUR_DOMAIN}/checkout?error=payment_failed`;

      const TPF = {
        terminalkey: process.env.NEXT_PUBLIC_TINKOFF_TERMINAL_KEY || "",
        frame: "false",
        language: "ru",
        amount: (totalAmountInKopeks / 100).toFixed(2),
        order: orderNumber,
        description: "Оплата заказа",
        name: fullName,
        email: email,
        phone: phone,
        receipt: receiptJson,
        SuccessURL: returnUrl,
        FailURL: failUrl,
      };

      const parsedAmount = parseFloat(TPF.amount);
      const expectedAmount = discountedSubtotal + shippingCost;
      if (Math.abs(parsedAmount - expectedAmount) > 0.01) {
        alert(
          "Произошла ошибка при обработке вашего платежа. Пожалуйста, попробуйте еще раз."
        );
        setIsProcessing(false);
        return;
      }

      const form = document.createElement("form");
      form.id = "payform-tbank";

      Object.entries(TPF).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      console.log("Payment Form:", form);

      window.pay(form);
    } catch (error: any) {
      alert("Произошла ошибка при обработке вашего платежа: " + error.message);
      console.error("Ошибка платежа:", error);
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
        className="flex-wrap top-0 left-0 right-0 z-50 p-4 bg-gray-100 shadow-sm"
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link
            href="/cart"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2 text-gray-700 text-xs" />
            Обратно в корзину
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 text-center mt-4">
          Оформление заказа
        </h1>
      </motion.header>
      <main className="container mx-auto px-4 py-4">
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
                      pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
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
                      pattern="^\+?\d{7,15}$"
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
                    <p className="text-gray-700 text-xs mb-4">
                      (доставим в ближайший пункт СДЭК)
                    </p>
                    <RadioGroup
                      defaultValue="russia"
                      onValueChange={setShippingMethod}
                      className="flex flex-col space-y-2 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="russia"
                          id="russia"
                          className="bg-white"
                        />
                        <Label htmlFor="russia" className="flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Отправка по России (₽500)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="spb"
                          id="spb"
                          className="bg-white"
                        />
                        <Label htmlFor="spb" className="flex items-center">
                          <Zap className="w-4 h-4 mr-2" />
                          Отправка по СПБ и Ленинградской области (₽400)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>Промокоды</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="Введите промокод"
                          value={currentPromoCode}
                          onChange={(e) => setCurrentPromoCode(e.target.value)}
                          disabled={promoCodes.length >= 2}
                        />
                        <Button
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={
                            currentPromoCode.trim() === "" ||
                            promoCodes.length >= 2
                          }
                        >
                          Применить
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {promoCodes.map((code, index) => (
                          <div
                            key={index}
                            className="flex items-centerbg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full shadow-sm mr-2 mb-2"
                          >
                            <span className="text-sm">
                              {code.toUpperCase()}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemovePromoCode(code)}
                              className="ml-2 text-blue-600 hover:text-blue-900 bg-transparent p-0 border-none focus:outline-none focus:ring-0 appearance-none"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      {promoCodes.length >= 2 && (
                        <p className="text-red-500 text-sm">
                          Можно применить только два промокода.
                        </p>
                      )}
                      {promoError && (
                        <p className="text-red-500 text-sm">{promoError}</p>
                      )}
                      {(discount > 0 || freeShipping) && (
                        <div className="mt-2">
                          {discount > 0 && (
                            <p className="text-green-500 text-sm">
                              Скидка: {discount}%
                            </p>
                          )}
                          {freeShipping && (
                            <p className="text-green-500 text-sm">
                              Бесплатная доставка
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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
                  <div className="flex justify-between items-center text-sm">
                    <span>
                      Доставка:{" "}
                      {freeShipping
                        ? "Бесплатная доставка"
                        : shippingMethod === "spb"
                        ? "СПБ и Ленинградская область"
                        : "По России"}
                    </span>
                    <span>
                      ₽
                      {freeShipping
                        ? "0.00"
                        : shippingMethod === "spb"
                        ? "400.00"
                        : "500.00"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Предварительная сумма:</span>
                    <span>₽{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span>Скидка ({discount}%):</span>
                      <span>-₽{((subtotal * discount) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span>Доставка:</span>
                    <span>
                      ₽
                      {freeShipping
                        ? "0.00"
                        : shippingMethod === "spb"
                        ? "400.00"
                        : "500.00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg py-4">
                    <span>К оплате:</span>
                    <span>₽{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center space-x-2 pb-4">
                      <Checkbox
                        id="agreeToPolicy"
                        checked={agreeToPolicy}
                        onCheckedChange={(checked: boolean) =>
                          setAgreeToPolicy(checked)
                        }
                      />
                      <Label htmlFor="agreeToPolicy" className="text-sm">
                        Я согласен с{" "}
                        <a
                          href="/policy.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-black"
                        >
                          Политикой Конфиденциальности
                        </a>
                      </Label>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
