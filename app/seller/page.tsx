'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Product {
  id: string;
  seller_id: string;
  title: string;
  origin: string;
  category: string;
  price: number;
  stock: number;
  is_active: boolean;
  thumbnail_url: string;
}

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('국내산(통영)');
  const [category, setCategory] = useState('선어/횟감');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currentSellerId = '11111111-1111-1111-1111-111111111111';

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', currentSellerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('상품 목록 조회 실패:', error);
    } else if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !stock) {
      alert('상품명, 가격, 재고를 모두 입력해주세요.');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('products').insert([
      {
        seller_id: currentSellerId,
        title,
        origin,
        category,
        price: Number(price),
        stock: Number(stock),
        thumbnail_url:
          thumbnailUrl.trim() ||
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
        is_active: true,
      },
    ]);

    setSubmitting(false);

    if (error) {
      alert('상품 등록 실패: ' + error.message);
    } else {
      alert('새로운 산지직송 상품이 등록되었습니다!');
      setTitle('');
      setPrice('');
      setStock('');
      setThumbnailUrl('');
      fetchProducts();
    }
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    if (newStock < 0) return;
    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', id);

    if (!error) {
      setProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, stock: newStock } : item))
      );
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_active: !currentStatus } : item
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* 상단 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded">
                🧤 노란장갑 파트너 센터
              </span>
              <span className="text-xs font-bold text-slate-700">통영바다수산 (김선장)</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              산지직송 상품 & 재고 관리
            </h1>
          </div>
          <Link
            href="/"
            className="text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl transition text-center shadow-sm"
          >
            &larr; 소비자 쇼핑몰 화면 보기
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 신규 수산물 등록 폼 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-1.5 border-b pb-3">
              ➕ 당일 조업 수산물 등록
            </h2>
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-800 font-bold mb-1">상품명</label>
                <input
                  type="text"
                  placeholder="예: [당일조업] 자연산 볼락 1kg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg p-2.5 font-medium text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">카테고리</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900 bg-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="선어/횟감">선어/횟감</option>
                    <option value="패류/조개">패류/조개</option>
                    <option value="새우/갑각류">새우/갑각류</option>
                    <option value="건어물">건어물</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">원산지</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">판매가격 (원)</label>
                  <input
                    type="number"
                    placeholder="35000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full border-2 border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">재고 수량</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={stock}
                    onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full border-2 border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">이미지 URL (선택)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg p-2.5 font-medium text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
                />
                <span className="text-[11px] font-medium text-slate-500 mt-1 block">
                  * 비워둘 경우 기본 신선 수산물 이미지가 자동 적용됩니다.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3 rounded-xl transition text-sm active:scale-[0.99] disabled:bg-slate-300 shadow-md cursor-pointer"
              >
                {submitting ? '등록 중...' : '상품 즉시 등록'}
              </button>
            </form>
          </div>

          {/* 우측: 출하 목록 */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                📦 출하 가능 수산물 목록 ({products.length}종)
              </h2>
              <button
                onClick={fetchProducts}
                className="text-xs font-bold text-amber-600 hover:text-amber-800 cursor-pointer"
              >
                🔄 새로고침
              </button>
            </div>

            {loading ? (
              <div className="text-center py-16 text-slate-500 font-bold text-sm">불러오는 중...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-bold text-sm">등록된 상품이 없습니다.</div>
            ) : (
              <div className="divide-y divide-slate-200">
                {products.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <span className="text-[11px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">
                          {item.category}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-sm truncate mt-1">
                          {item.title}
                        </h3>
                        <p className="text-amber-600 font-black text-sm mt-0.5">
                          {item.price.toLocaleString()}원
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-2 border-2 border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50">
                        <span className="text-xs font-bold text-slate-700">재고</span>
                        <button
                          onClick={() => handleUpdateStock(item.id, item.stock - 1)}
                          className="w-6 h-6 bg-white hover:bg-slate-200 border border-slate-300 font-bold text-slate-800 rounded flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                        >
                          -
                        </button>
                        <span className="font-black text-base w-8 text-center text-slate-900">
                          {item.stock}
                        </span>
                        <button
                          onClick={() => handleUpdateStock(item.id, item.stock + 1)}
                          className="w-6 h-6 bg-white hover:bg-slate-200 border border-slate-300 font-bold text-slate-800 rounded flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleToggleActive(item.id, item.is_active)}
                        className={`px-3 py-2 rounded-lg font-black text-xs transition cursor-pointer shadow-xs ${
                          item.is_active
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-rose-600 text-white hover:bg-rose-700'
                        }`}
                      >
                        {item.is_active ? '판매중' : '품절(숨김)'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}