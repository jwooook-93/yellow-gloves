'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/lib/cartStore';
import CartDrawer from '@/components/CartDrawer';
import Link from 'next/link';

interface Product {
  id: string;
  seller_id: string;
  title: string;
  origin: string;
  category: string;
  price: number;
  thumbnail_url: string;
}

const CATEGORIES = ['전체', '선어/횟감', '패류/조개', '새우/갑각류', '건어물'];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { addItem, openCart, items } = useCartStore();

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('상품 불러오기 실패:', error);
      } else if (data) {
        setProducts(data);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === '전체' || item.category === selectedCategory;
      const matchesKeyword =
        item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.origin.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchesCategory && matchesKeyword;
    });
  }, [products, selectedCategory, searchKeyword]);

  const totalCartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <CartDrawer />

      {/* 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-lg shadow-inner group-hover:scale-105 transition-transform">
              🧤
            </span>
            <span className="text-xl font-black text-slate-950 tracking-tight">
              노란<span className="text-amber-500">장갑</span>
            </span>
          </Link>
          <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400 border-l border-slate-200 pl-3">
            산지직송 1차 수산마켓
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/seller"
            className="flex items-center gap-1.5 text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-400 hover:text-black px-3 py-2 rounded-xl transition shadow-xs"
          >
            <span>⚓</span>
            <span>생산자 파트너 센터</span>
          </Link>

          <button
            onClick={openCart}
            className="relative px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <span>🛒</span>
            <span>장바구니</span>
            {totalCartCount > 0 && (
              <span className="bg-rose-600 text-white text-[11px] font-black min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 메인 배너 */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white px-4 py-8 text-center border-b border-slate-800">
        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          Direct from Fishery
        </span>
        <h2 className="text-2xl sm:text-3xl font-black mt-2.5 text-white">
          바다에서 갓 건져 올린 신선함
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
          새벽 위판 직송 · 유통 거품 없는 선장 직거래
        </p>
      </section>

      {/* 검색창 및 카테고리 탭 영역 */}
      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="찾으시는 어종이나 원산지를 검색해보세요 (예: 가리비, 통영, 볼락)"
            className="w-full bg-white border-2 border-slate-300 focus:border-amber-500 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none transition"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">
            🔍
          </span>
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 출하 목록 요약 */}
        <div className="flex items-center justify-between pt-2 border-b border-slate-200 pb-2">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <span>🔥 실시간 출하 목록</span>
            <span className="text-xs font-bold text-amber-600">({filteredProducts.length}개)</span>
          </h3>
          {(selectedCategory !== '전체' || searchKeyword) && (
            <button
              onClick={() => {
                setSelectedCategory('전체');
                setSearchKeyword('');
              }}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* 상품 카드 목록 */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold text-sm">
            수산물 목록을 불러오는 중...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs font-bold space-y-2">
            <p className="text-2xl">🐟</p>
            <p>검색 조건에 맞는 수산물이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-black px-2 py-0.5 rounded shadow">
                    {item.origin}
                  </span>
                </div>

                <div className="p-3.5">
                  <span className="text-[10px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2 mt-1.5 leading-snug">
                    {item.title}
                  </h4>
                  <div className="mt-3 flex items-baseline justify-between border-t border-slate-100 pt-2.5">
                    <span className="text-sm sm:text-base font-black text-slate-950">
                      {item.price.toLocaleString()}원
                    </span>
                    <button
                      onClick={() =>
                        addItem({
                          id: item.id,
                          seller_id: item.seller_id,
                          title: item.title,
                          origin: item.origin,
                          price: item.price,
                          thumbnail_url: item.thumbnail_url,
                        })
                      }
                      className="text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg font-black transition cursor-pointer shadow-xs active:scale-95"
                    >
                      담기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}