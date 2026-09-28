'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = items.length === 0 ? 0 : itemsTotal >= 50000 ? 0 : 4000;
  const grandTotal = itemsTotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        {/* 상단 헤더 */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            장바구니 <span className="text-blue-600 text-sm font-semibold">({items.length})</span>
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2 py-1 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* 생산자별 묶음 배송 안내 */}
        <div className="bg-blue-50 px-4 py-2.5 text-xs text-blue-700 border-b border-blue-100 flex justify-between items-center">
          <span>📦 <strong>통영바다수산</strong> 묶음배송</span>
          <span>
            {itemsTotal >= 50000
              ? '무료배송 달성!'
              : `${(50000 - itemsTotal).toLocaleString()}원 더 담으면 무료배송`}
          </span>
        </div>

        {/* 장바구니 상품 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">장바구니가 비어 있습니다.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-3 items-center">
                <img src={item.thumbnail_url} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-800 truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.price.toLocaleString()}원</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 border border-gray-300 rounded text-xs flex items-center justify-center text-gray-600 active:bg-gray-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 border border-gray-300 rounded text-xs flex items-center justify-center text-gray-600 active:bg-gray-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900">
                    {(item.price * item.quantity).toLocaleString()}원
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[11px] text-red-400 hover:text-red-600 mt-2 cursor-pointer"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 하단 결제 요약 및 주문 버튼 */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>상품 금액</span>
            <span>{itemsTotal.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>산지 직송 배송비</span>
            <span>{shippingFee === 0 ? '무료' : `+${shippingFee.toLocaleString()}원`}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>총 결제 예상 금액</span>
            <span className="text-base text-blue-600">{grandTotal.toLocaleString()}원</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => {
              closeCart();
              router.push('/checkout');
            }}
            className="w-full mt-3 bg-blue-600 text-white font-bold py-3 rounded-xl disabled:bg-gray-300 hover:bg-blue-700 transition cursor-pointer"
          >
            주문하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}