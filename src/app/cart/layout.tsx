// cart/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title: 'Корзина — Mont Noir',
  description: 'Просмотрите корзину перед покупкой',
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="flex-wrap top-0 left-0 right-0 z-50 p-4 bg-gray-100 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 text-center mt-4">Ваша Корзина</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 pt-24">
        {children}
      </main>
    </div>
  );
}