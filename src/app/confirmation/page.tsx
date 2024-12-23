'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderConfirmation() {
  return (
    <div className="bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="flex justify-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>
          <CardTitle className="text-center mt-4">Заказ подтвержден!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Спасибо за покупку. Ваш заказ был успешно оформлен.</p>
          <p>Детали вашего заказа были направлены на адрес электронной почты.</p>
          <Button asChild>
            <Link href="/">На главную</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}