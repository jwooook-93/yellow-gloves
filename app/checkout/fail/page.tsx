'use client';

import Link from 'next/link';

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ✕
        </div>
        <h2 className="text-xl font-bold text-gray-900">결제에 실패하였습니다</h2>
        <p className="text-sm text-gray-500">
          사용자가 결제를 취소했거나 승인 과정에서 오류가 발생했습니다.
        </p>
        <div className="pt-4 flex gap-3">
          <Link
            href="/checkout"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition text-center"
          >
            다시 시도
          </Link>
          <Link
            href="/"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-center"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}