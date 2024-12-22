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
  const [flipped, setFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleCircleClick = () => {
    setFlipped(!flipped);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

	useEffect(() => {
	  const text = "кликни кликни кликни кликни кликни кликни кликни";
	  const mainCircleRadius = 185; // Radius of the main circle
	  const words = text.split(" "); // Split the text into words
	  const wordAngle = 360 / words.length; // Angle for each word

	  const circularTextContainer = document.getElementById("circular-text");
	  if (!circularTextContainer) {
		return;
	  }
	  circularTextContainer.innerHTML = ""; // Clear previous content

	  words.forEach((word, index) => {
		const wordDiv = document.createElement("div");
		wordDiv.style.position = "absolute";
		wordDiv.style.left = "50%";
		wordDiv.style.top = "50%";
		wordDiv.style.transformOrigin = "0 0"; // Set the origin for rotation
		const wordRotation = wordAngle * index + 90; // Calculate rotation for each word
		wordDiv.style.transform = `rotate(${wordRotation}deg)`;

		// Add the infinite rotation animation with a unique starting position
		const animationDelay = (-wordRotation / 360) * 40; // Calculate delay based on wordRotation
		wordDiv.style.animation = `rotate 40s linear infinite`;
		wordDiv.style.animationDelay = `${animationDelay}s`; // Apply the delay

		// Split the word into individual letters
		const letters = word.split("");
		letters.push(" ");
		const letterAngle = wordAngle / letters.length; // Angle between each letter

		letters.forEach((letter, letterIndex) => {
		  const letterSpan = document.createElement("span");
		  letterSpan.innerText = letter;
		  letterSpan.style.position = "absolute";
		  letterSpan.style.left = "50%";
		  letterSpan.style.top = "50%";
		  letterSpan.style.transformOrigin = "0 0";

		  // Calculate the position of each letter along the arc
		  const letterRotation = letterAngle * letterIndex - 90; // Adjust rotation to align letters correctly
		  const letterRadius = mainCircleRadius; // Adjust this value to control the inner radius of the arc
		  letterSpan.style.transform = `rotate(${letterRotation}deg) translate(${letterRadius}px) rotate(90deg)`;

		  wordDiv.appendChild(letterSpan);
		});

		circularTextContainer.appendChild(wordDiv);
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
      title: "Качество в каждой детали",
      description:
        "Плохая оболочка убивает содержимое. Продукт поставляется в дизайнерских коробках, сочетающих элегантность и функциональность.",
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
    <div className="min-h-screen bg-gray-900 text-white background-image">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-gray-900"
        style={{ height: "80px" }} // Set a fixed height for the header
      >
        <div className="flex items-center relative">
          <div className="flex items-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mr-4 jomo-font">
              Mont
            </h1>
            <div className="logo-circle sm:w-32 sm:h-32 bg-gray-900 rounded-full shadow-lg flex items-center justify-center sm:mt-8">
              {" "}
              {/* margin to protrude the logo */}
              <img
                src="./images/logo-black.png"
                alt="Mont Noir"
                className="logo-img sm:w-24 sm:h-24"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white ml-4 jomo-font">
              Noir
            </h1>
          </div>
        </div>

        <div className="absolute right-4 flex items-center">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-8 h-8 sm:w-12 sm:h-12 sm:mr-8 text-gray-100" />{" "}
            {/* Increased size of cart icon */}
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-12 pt-28 sm:pt-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-extrabold mb-4">Носи свои мысли</h2>
          <p className="text-xl text-gray-400">
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
              <div className="relative w-80 h-80">
                <div id="circular-text" className="absolute inset-0"></div>
                <div
                  className={`circle ${flipped ? "flipped" : ""}`}
                  onClick={handleCircleClick}
                >
                  <div className="front">
                    <motion.img
                      src="./images/circle-front.jpg"
                      alt="Overthinking T-Shirt"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="back">
                    <motion.img
                      src="./images/circle-back.jpg"
                      alt="Overthinking T-Shirt"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="bg-gray-100 mt-6 p-6 rounded-lg w-full max-w-md"
            >
              <h4 className="font-bold text-gray-900 text-xl mb-4">
                Парадокс Тесея: Переосмысляя вечность
              </h4>
              <p className="text-lg space-y-2 mb-2 text-gray-700">
                Мы предлагаем вам погрузиться в захватывающий парадокс, который
                уже на протяжении веков вдохновляет философов и мыслителей. Это
                история о легендарном Тесее, герое, который одержал победу над
                свирепым Минотавром и освободил Афины от ужасной дани.
              </p>
              {isExpanded && (
                <>
                  <p className="text-lg space-y-2 mb-2 text-gray-700">
                    Что, если мы скажем, что корабль Тесея, на котором он
                    вернулся домой, стал предметом одного из самых интригующих
                    философских вопросов? Согласно историческим данным, корабль
                    Тесея ежегодно отправлялся со священным посольством на Делос
                    на протяжении многих лет после подвига. Перед каждым
                    плаванием корабль ремонтировали, заменяя часть досок, и со
                    временем все доски были заменены, что породило среди
                    философов спор: остался ли корабль тем же самым или уже стал
                    совершенно новым? Кроме того, если бы все заменённые доски
                    сохранили и построили из них другой корабль, то какой из
                    этих двух кораблей являлся бы настоящим?
                  </p>
                  <p className="text-lg space-y-2 mb-2 text-gray-700">
                    Остался ли корабль Тесея прежним кораблем? Этот вопрос
                    заставляет нас задуматься о том, что значит быть &quot;тем
                    же самым&quot; с течением времни. Но, что более важно,
                    остаемся ли и мы самими собой на протяжении своей жизни?
                    Ведь если даже корабль, который мы считаем неизменным, на
                    самом деле меняется буквально в каждой детали, то что можно
                    сказать о нашей собственной идентичности?
                  </p>
                </>
              )}
              {!isExpanded && (
                <p className="text-lg mt-2 text-gray-400">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default anchor behavior
                      toggleExpand();
                    }}
                    className="text-gray-400 text-base hover:text-gray-500"
                  >
                    Читать еще
                  </a>
                </p>
              )}
              {isExpanded && (
                <p className="text-lg mt-2 text-gray-400">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default anchor behavior
                      toggleExpand();
                    }}
                    className="text-gray-400 text-base hover:text-gray-500"
                  >
                    Скрыть
                  </a>
                </p>
              )}
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="max-w-md w-full mx-auto md:mx-0"
          >
            <p className="text-lg mb-6">
              Разработанные и произведенные с любовью в России, эти футболки
              предлагают вам индивидуальный дизайн и невероятный опыт ношения,
              благодаря высококачественной ткани и тщательно разработанным
              кроем. невероятно мягка и нежна к коже, обеспечивая свободу
              движений и комфорт на протяжении всего дня.
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>95% чистый хлопок, 5% изысканная лайкра</li>
              <li>Невероятно мягкая и нежная ткань</li>
              <li>Гарантирует свободу движений и максимальный комфорт</li>
              <li>Разработаны и произведены в России</li>
              <li>Доставка от 3 рабочих дней</li>
            </ul>
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
                        color === c
                          ? "ring-2 ring-gray-500 color-picker"
                          : "color-picker"
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
                <h3 className="text-xl text-gray-700 font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <section className="bg-gray-1000 py-2 mt-2">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-semibold text-gray-200 text-center mb-4">
              Свяжитесь с нами
            </h3>
            <p className="text-base text-gray-400 text-center mb-6">
              Мы всегда готовы помочь вам! Свяжитесь с нами по электронной почте
              или через наш Telegram-бот.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <a
                href="mailto:support@montnoir.com"
                className="flex items-center text-gray-100 hover:text-gray-400 transition-colors duration-200"
                aria-label="Email support@montnoir.com"
              >
                <MdEmail className="w-6 h-6 mr-2" />
                support@montnoir.com
              </a>

              <a
                href="https://t.me/MontNoirBot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-100 hover:text-gray-400 transition-colors duration-200"
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
        className="text-center py-6 bg-black text-gray-700"
      >
        <div className="text-center mb-4">
          <a
            href="/policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-800 underline mr-4"
          >
            Политика Конфиденциальности
          </a>
          <a
            href="/oferta.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-800 underline"
          >
            Оферта
          </a>
        </div>
        <p className="text-gray-600">
          &copy; 2024 Mont Noir. Все права защищены. Или нет?
        </p>
        <img
          src="./images/tbank.png"
          alt="Т-Банк"
          className="w-23 h-9 mx-auto mt-4 border-2 border-white bg-white rounded-lg shadow-lg"
        />
      </motion.footer>
    </div>
  );
}
