// confirmation/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title: 'Спасибо за заказ! — Mont Noir',
  description: 'Ваш заказ будет доставлен в ближайшие сроки',
};

export default function ConfirmationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex-wrap top-0 left-0 right-0 z-50 p-4 bg-gray-100 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 text-center mt-4">Подтверждение заказа</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 pt-24">
        {children}
      </main>
    </div>
  );
}