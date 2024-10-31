"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { MdEmail } from "react-icons/md";
import { SiTelegram } from "react-icons/si";
import { useCart } from "../contexts/CartContext";
import { InventoryItem } from "../lib/db";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [color, setColor] = useState("black");
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItems } = useCart();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    setIsLoaded(true);
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched inventory data:", data);
        setInventory(data);
      })
      .catch((error) => {
        console.error("Error fetching inventory:", error);
      });
  }, []);

  const inventoryItem = inventory.find(
    (item) => item.color === color && item.size === size
  );

  const cartItem = cartItems.find(
    (item) => item.color === color && item.size === size
  );

  const totalCartQuantity = cartItem ? cartItem.quantity : 0;

  const maxAvailableQuantity = inventoryItem
    ? inventoryItem.quantity - totalCartQuantity
    : 0;

  const maxAvailableQuantitySafe = Math.max(0, maxAvailableQuantity);

  const features = [
    {
      title: "Дизайн, наводящий на мысли...",
      description:
        "Дизайн для каждой футболки был отрисован вручную известным дизайнером. Идея дизайна - корабль Тесея.",
      image: "./images/box.jpg",
      yShift: -95,
    },
    {
      title: "Индивидуальный дизайн",
      description:
        "Каждая футболка имеет индивидуальный и рисунок на обратной стороне, вы никогда не найдете такую же.",
      image: "./images/ship.png",
      yShift: -25,
    },
    {
      title: "Парадоксальный комфорт",
      description:
        "Чем больше вы думаете о том, насколько удобна эта футболка, тем удобнее она становится.",
      image: "./images/comfort.png",
      yShift: 0,
    },
  ];

  const handleAddToCart = () => {
    if (!inventoryItem || maxAvailableQuantitySafe <= 0) {
      alert("Selected item is out of stock.");
      return;
    }

    if (quantity > maxAvailableQuantitySafe) {
      alert(
        `Cannot add more than ${maxAvailableQuantitySafe} items of this product to the cart.`
      );
      return;
    }

    addToCart({ color, size, quantity });
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    const sizesAvailable = inventory
      .filter((item) => item.color === newColor && item.quantity > 0)
      .map((item) => item.size);

    if (!sizesAvailable.includes(size)) {
      setSize(sizesAvailable.length > 0 ? sizesAvailable[0] : "");
    }
  };

  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + change;
      if (newQuantity < 1) return 1;
      if (inventoryItem && newQuantity > maxAvailableQuantitySafe) {
        return maxAvailableQuantitySafe;
      }
      return newQuantity;
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-4 flex justify-between items-center bg-gray-100"
      >
        <h1 className="text-2xl font-bold">Mont Noir</h1>
        <div className="flex items-center gap-4">
          <img src="./images/logo.png" alt="Mont Noir" className="w-12 h-8" />
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
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4">
            Носи свои мысли
          </h2>
          <p className="text-xl md:text-2xl text-gray-600">
            Восторг для тех, кто много думает о многом
          </p>
        </motion.div>
        <div className="flex flex-col md:flex-row items-start justify-center gap-12 mb-16">
          <div className="flex flex-col items-center md:items-start gap-8 w-full md:w-auto">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="relative"
            >
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <motion.img
                  src="./images/circle.jpg"
                  alt="Overthinking T-Shirt"
                  className="w-full h-auto object-cover"
                  style={{ objectPosition: "center 70px" }}
                />
              </div>
              <motion.div
                className="absolute -top-4 -right-4 bg-gray-800 text-white font-bold py-2 px-4 rounded-full transform rotate-12"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1.5 }}
              >
                Новая коллекция!
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="bg-gray-100 p-6 rounded-lg w-full max-w-md"
            >
              <h4 className="font-bold text-xl mb-4">Главные фишки:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>+20 к экзистенциальному кризису</li>
                <li>День мозга каждый раз когда вы ее надеваете</li>
                <li>Научно доказано, что делает принятие решений сложнее</li>
                <li>
                  Улучшает вашу способность находить проблемы, для которых
                  придумываете гениальные решения
                </li>
                <li>Гарантированно делает простые задачи сложными</li>
                <li>
                  Повышает вашу способность создавать воображаемые сценарии
                </li>
                <li>
                  Поставляется со встроенным генератором оправданий для
                  общественных мероприятий
                </li>
              </ul>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="max-w-md w-full"
          >
            <h3 className="text-3xl font-bold mb-4">
              Для любителей переосмыслений
            </h3>
            <p className="text-lg mb-6">
              Погрузитесь в глубины своей психики с нашим последним дизайном.
              Эта футболка не просто заявляет о себе; она запускает целый
              внутренний диалог о том, кто ты на самом деле.
            </p>
            <p className="text-lg mb-6">95% хлопок, 5% лайкра</p>
            <p className="text-lg mb-6">Сделано в России</p>
            <div className="mb-6">
              <h4 className="font-bold mb-2">Color:</h4>
              <div className="flex gap-4">
                {["black", "white"].map((c) => {
                  const hasStock = inventory.some(
                    (item) => item.color === c && item.quantity > 0
                  );

                  return (
                    <button
                      key={c}
                      onClick={() => handleColorChange(c)}
                      disabled={!hasStock}
                      className={`w-8 h-8 rounded-full ${
                        color === c ? "ring-2 ring-gray-500" : ""
                      } ${
                        c === "black"
                          ? "bg-black"
                          : "bg-white border border-gray-300"
                      } ${!hasStock ? "opacity-50 cursor-not-allowed" : ""}`}
                      aria-label={c}
                    />
                  );
                })}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-bold mb-2">Size:</h4>
              <div className="flex gap-4">
                {["S", "M", "L", "XL"].map((s) => {
                  const inventoryItemSize = inventory.find(
                    (item) => item.color === color && item.size === s
                  );
                  const isOutOfStock =
                    !inventoryItemSize || inventoryItemSize.quantity <= 0;

                  return (
                    <button
                      key={s}
                      onClick={() => handleSizeChange(s)}
                      disabled={isOutOfStock}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                        size === s
                          ? "bg-gray-800 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {s} {isOutOfStock && "(Sold out)"}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-bold mb-2">Quantity:</h4>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-xl font-medium w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                  disabled={quantity >= maxAvailableQuantitySafe}
                >
                  +
                </button>
              </div>
              {inventoryItem && (
                <p className="text-sm text-gray-500 mt-2">
                  В наличии: {inventoryItem.quantity} шт., доступно:{" "}
                  {maxAvailableQuantitySafe} шт.
                </p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="group inline-flex items-center justify-center px-8 py-3 w-full text-lg font-medium text-white bg-gray-900 rounded-full hover:bg-gray-700 transition-colors duration-300"
              disabled={maxAvailableQuantitySafe <= 0}
            >
              {maxAvailableQuantitySafe <= 0
                ? "Нет в наличии"
                : "Переосмыслить эту покупку"}
              {maxAvailableQuantitySafe > 0 && (
                <ShoppingCart className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              )}
            </button>
          </motion.div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 + index * 0.2 }}
              className="bg-gray-100 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className={`w-full h-full object-cover [object-position:center_calc(50%_+_${feature.yShift}px)]`}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <a
            href="/policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 underline mr-4"
          >
            Политика Конфиденциальности
          </a>
          <a
            href="/oferta.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 underline"
          >
            Оферта
          </a>
        </div>
        <section className="bg-gray-50 py-8 mt-8 rounded-lg shadow-inner">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">
              Свяжитесь с нами
            </h3>
            <p className="text-base text-gray-600 text-center mb-6">
              Мы всегда готовы помочь вам! Свяжитесь с нами по электронной почте
              или через наш Telegram-бот.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <a
                href="mailto:support@montnoir.com"
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
                aria-label="Email support@montnoir.com"
              >
                <MdEmail className="w-6 h-6 mr-2" />
                support@montnoir.com
              </a>

              <a
                href="https://t.me/MontNoirBot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
                aria-label="Chat with our Telegram bot @MontNoirBot"
              >
                <SiTelegram className="w-6 h-6 mr-2" />
                @MontNoirBot
              </a>
            </div>
          </div>
        </section>
      </main>
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="text-center py-8 bg-gray-100 text-gray-700"
      >
        <p>&copy; 2024 Mont Noir. Все права защищены. Или нет?</p>
        <img
          src="./images/tbank.png"
          alt="Т-Банк"
          className="w-23 h-9 mx-auto mt-4"
        />
      </motion.footer>
    </div>
  );
}