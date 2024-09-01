"use client";

import React from "react";

interface ProductItemProps {
  product: {
    id: string;
    name: string;
    shortDesc: string;
    price: number;
    stock: number;
    imageSrc: string;
  };
  addToCart: (item: { id: string; product: ProductItemProps["product"]; amount: number }) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, addToCart }) => {
  return (
    <div className="bg-white group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <img
          src={product.imageSrc}
          alt={product.shortDesc}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="p-4">
        <h3 className="my-2 text-lg font-medium text-gray-900 capitalize">
          {product.name}
        </h3>
        <p className="mt-1 mb-2 text-sm text-gray-500">{product.shortDesc}</p>
        <p className="text-lg font-medium text-gray-900">{product.price} ₽</p>
        {product.stock > 0 ? (
          <button
            className="button is-small is-outlined is-black"
            onClick={() =>
              addToCart({
                id: product.id,
                product,
                amount: 1
              })
            }
          >
            Add to Cart
          </button>
        ) : (
          <small className="has-text-danger">Out Of Stock</small>
        )}
      </div>
    </div>
  );
};

export default ProductItem;