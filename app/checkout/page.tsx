'use client';

import { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import { useCartStore } from '@/lib/cartStore';
import Link from 'next/link';

// 토스 공식 테스트 클라이언트 키
const clientKey = 'test_ck_D5GePWvyJqK4W7Pq0nk8N7LzAnGq';
const customerKey = 'customer_' + Math.random().toString(36).substring(2, 11);

export default function CheckoutPage() {
  const { items } = useCartStore();
  const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<any>(null);

  const [buyerName, setBuyerName] = useState('홍길동');
  const [buyerPhone, setBuyerPhone] = useState('010-1234-5678');
  const [buyerAddress, setBuyerAddress] = useState('경남 통영시 중앙시장길 10');

  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = items.length === 0 ? 0 : itemsTotal >= 50000 ? 0 : 4000;
  const grandTotal = itemsTotal + shippingFee;

  useEffect(() => {
    (async () => {
      try {
        const widget = await loadPaymentWidget(clientKey, customerKey);

        const methodsWidget = widget.renderPaymentMethods(
          '#payment-widget',
          { value: grandTotal },
          { variantKey: 'DEFAULT' }
        );

        widget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' });

        setPaymentWidget(widget);
        paymentMethodsWidgetRef.current = methodsWidget;
      } catch (err) {
        console.error('토스페이먼츠 위젯 로딩 실패:', err);
      }
    })();
  }, [grandTotal]);

  const executePayment = async (easyPayProvider?: 'KAKAOPAY' | 'NAVERPAY') => {
    if (!paymentWidget) {
      alert('결제 모듈을 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    const orderId = 'ORDER_' + Date.now();
    const orderName =
      items.length === 1
        ? items[0].title
        : `${items[0]?.title} 외 ${items.length - 1}건`;

    const paymentParams: any = {
      orderId: orderId,
      orderName: orderName,
      customerName: buyerName,
      customerMobilePhone: buyerPhone.replace(/[^0-9]/g, ''),
      successUrl: `${window.location.origin}/checkout/success`,
      failUrl: `${window.location.origin}/checkout/fail`,
    };

    if (easyPayProvider) {
      paymentParams.easyPay = easyPayProvider;
    }

    try {
      await paymentWidget.requestPayment(paymentParams);
    } catch (error) {
      console.error('결제 요청 중단 또는 오류:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4 text-sm font-medium">장바구니에 담긴 상품이 없습니다.</p>
        <Link
          href="/"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          수산물 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-gray-800">
            &larr; 쇼핑 계속하기
          </Link>
          <h1 className="text-lg font-extrabold text-gray-900">주문서 작성 / 결제</h1>
          <span className="w-16"></span>
        </div>

        {/* 1. 배송지 정보 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
            📍 배송지 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-500 mb-1 font-medium">받는 분</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 focus:outline-blue-500 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1 font-medium">연락처</label>
              <input
                type="text"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 focus:outline-blue-500 text-gray-800"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-500 mb-1 font-medium">배송 주소</label>
              <input
                type="text"
                value={buyerAddress}
                onChange={(e) => setBuyerAddress(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 focus:outline-blue-500 text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* 2. 주문 상품 내역 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-gray-800 flex items-center justify-between">
            <span>🛒 주문 상품 ({items.length}개)</span>
            <span className="text-[11px] font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              통영바다수산 산지직송
            </span>
          </h2>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate max-w-[320px]">
                  <img src={item.thumbnail_url} alt={item.title} className="w-10 h-10 rounded-md object-cover" />
                  <div className="truncate">
                    <p className="font-semibold text-gray-800 truncate">{item.title}</p>
                    <p className="text-gray-400 text-[11px]">수량: {item.quantity}개</p>
                  </div>
                </div>
                <span className="font-bold text-gray-900">
                  {(item.price * item.quantity).toLocaleString()}원
                </span>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs text-gray-600 border border-gray-100">
            <div className="flex justify-between">
              <span>상품 금액</span>
              <span>{itemsTotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span>산지직송 묶음 배송비</span>
              <span>{shippingFee === 0 ? '무료' : `+${shippingFee.toLocaleString()}원`}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-200">
              <span>최종 결제 금액</span>
              <span className="text-blue-600">{grandTotal.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 3. 카카오페이 / 네이버페이 퀵 간편결제 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-gray-800">⚡ 간편결제 바로하기</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => executePayment('KAKAOPAY')}
              className="w-full bg-[#FEE500] hover:bg-[#fada0a] text-[#191919] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm text-sm active:scale-[0.99] cursor-pointer"
            >
              <span className="bg-[#191919] text-[#FEE500] text-[10px] font-black px-1.5 py-0.5 rounded">
                pay
              </span>
              <span>카카오페이 결제</span>
            </button>

            <button
              onClick={() => executePayment('NAVERPAY')}
              className="w-full bg-[#03C75A] hover:bg-[#02b350] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm text-sm active:scale-[0.99] cursor-pointer"
            >
              <span className="bg-white text-[#03C75A] text-[10px] font-black px-1.5 py-0.5 rounded">
                NPay
              </span>
              <span>네이버페이 결제</span>
            </button>
          </div>
        </div>

        {/* 4. 일반 결제 위젯 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 mb-2">💳 일반 결제 / 카드 결제</h2>
          <div id="payment-widget" className="w-full" />
          <div id="agreement" className="w-full mt-2" />

          <button
            onClick={() => executePayment()}
            className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/20 active:scale-[0.99] cursor-pointer"
          >
            {grandTotal.toLocaleString()}원 일반 결제하기
          </button>
        </div>

      </div>
    </div>
  );
}