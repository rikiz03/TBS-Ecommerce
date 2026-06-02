'use client';

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/geo";
import { useSettingsStore } from "@/lib/store";

interface SpecialOfferGridProps {
    title: string;
    products: Product[];
    linkHref: string;
}

export default function SpecialOfferGrid({ title, products, linkHref }: SpecialOfferGridProps) {
    const addItem = useCartStore(state => state.addItem);
    const currency = useSettingsStore(state => state.currency);
    
    if (products.length === 0) return null;

    // Group products by 4 for the special cards
    const quadProducts = products.slice(0, 4);
    const remainingProducts = products.slice(4);

    return (
        <div className="mb-12">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{title}</h2>
                    <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                </div>
                <Link href={linkHref} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold flex items-center hover:bg-blue-100 transition-colors group flex-shrink-0 whitespace-nowrap">
                    View All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* The Special Quad Card */}
                <div className="lg:col-span-1 bg-white dark:bg-[#0a0a0a] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col group hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">Must-Have Deals</h3>

                    <div className="grid grid-cols-2 gap-3 flex-grow">
                        {quadProducts.map((p) => (
                            <Link key={p.id} href={`/product/${p.id}`} className="flex flex-col group/item">
                                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 mb-2 border border-gray-100 dark:border-gray-800">

                                    <Image
                                        src={p.image}
                                        alt={p.title}
                                        fill
                                        className="object-cover group-hover/item:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase truncate">
                                    {p.category !== 'Uncategorized' ? p.category.replace(/&amp;/g, '&').replace(/&#038;/g, '&') : 'Premium Deals'}
                                </p>
                                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate mt-1">{p.title}</p>
                                <p className="text-sm font-black text-blue-600 mt-0.5">{formatPrice(p.price, currency)}</p>
                            </Link>
                        ))}
                    </div>
                    <Link href={linkHref} className="mt-4 text-blue-600 text-xs font-bold hover:text-blue-700 transition-colors inline-flex items-center gap-1">
                        Shop all offers
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" /></svg>
                    </Link>
                </div>

                {/* Remaining products in standard cards */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
                    {remainingProducts.slice(0, 6).map((product) => (
                        <div key={product.id} className="bg-white dark:bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 group flex flex-col h-full">
                            <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900">

                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg uppercase tracking-tighter">
                                    Special Offer
                                </div>
                            </Link>
                            <div className="p-4 flex flex-col flex-grow">
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
                                    {product.category !== 'Uncategorized' ? product.category.replace(/&amp;/g, '&').replace(/&#038;/g, '&') : 'Special Deal'}
                                </p>

                                <Link href={`/product/${product.id}`} className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                                    {product.title}
                                </Link>
                                <div className="mt-auto flex items-center justify-between gap-2">
                                    <div>
                                        <span className="text-lg font-black text-gray-900 dark:text-white">{formatPrice(product.price, currency)}</span>
                                        {product.originalPrice && (
                                            <span className="ml-2 text-xs text-gray-400 line-through">{formatPrice(product.originalPrice, currency)}</span>
                                        )}
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addItem(product);
                                        }}
                                        className="bg-gray-900 text-white p-2 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-10"
                                        aria-label="Add to cart"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
