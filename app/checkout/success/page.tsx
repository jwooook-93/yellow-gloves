'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCartStore } from '@/lib/cartStore';

export default function PaymentSuccessPage() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <h2 className="text-xl font-bold text-gray-900">주문 및 결제 완료!</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          산지 생산자에게 주문 내역이 즉시 전달되었습니다.<br />
          당일 조업 후 신선하게 산소포장되어 발송됩니다.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}