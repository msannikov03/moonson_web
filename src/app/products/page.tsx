"use client";

import React from "react";
import ProductItem from "../components/ProductItem";
import withContext from "../context/withContext";
import { CartContextType } from "../context/CartContext";

interface ProductListProps {
  context: CartContextType;
}

const ProductList: React.FC<ProductListProps> = ({ context }) => {
  const { products } = context;

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const el = event.target as HTMLElement;
      if (el && el.children[0]) {
        const childElement = el.children[0] as HTMLElement;
        if (childElement.classList.contains("popup-container") && el.nodeName === "DIV") {
          el.parentElement?.parentElement?.setAttribute("hidden", "true");
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <div className="bg-black">
        <div className="container mx-auto py-6">
          <h4 className="text-white font-bold text-xl">Our Products</h4>
        </div>
      </div>
      <div className="my-4"></div> {/* Equivalent to <br /> */}
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products && products.length ? (
            products.map((product, index) => (
              <ProductItem
                product={product}
                key={index}
                addToCart={context.addToCart}
              />
            ))
          ) : (
            <div className="text-center w-full">
              <span className="text-lg text-gray-400">No products found!</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withContext(ProductList);