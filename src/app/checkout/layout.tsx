// checkout/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title: 'Оформление заказа — Mont Noir',
  description: 'Введите необходимые данные, выберите способ доставки и оплаты, и ваш заказ будет обработан в кратчайшие сроки.',
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex-wrap top-0 left-0 right-0 z-50 p-4 bg-gray-100 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 text-center mt-4">Оформление заказа</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 pt-24">
        {children}
      </main>
    </div>
  );
}