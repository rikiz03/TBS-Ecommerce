'use client';

import { Review } from '@/lib/types';
import { Star, CheckCircle2, User, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface BuyerReviewsProps {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

export default function BuyerReviews({ reviews, averageRating, totalReviews }: BuyerReviewsProps) {
    return (
        <section className="mt-4">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Verified Customer Feedback</h2>
                <div className="flex flex-wrap items-center gap-3 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col">
                        <div className="flex text-yellow-400 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} 
                                />
                            ))}
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</span>
                            <span className="text-[10px] text-gray-500 font-medium">/ 5.0</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{totalReviews}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Total Reviews</span>
                    </div>
                    <div className="ml-auto flex -space-x-2">
                        {reviews.slice(0, 3).map((rev) => (
                            <div key={rev.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-[#121212] rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                        {review.author}
                                        {review.verified && (
                                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                                        )}
                                    </div>
                                    <div className="text-[10px] text-gray-400">{review.date}</div>
                                </div>
                            </div>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} 
                                    />
                                ))}
                            </div>
                        </div>

                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic">
                            "{review.comment}"
                        </p>

                        {review.images && review.images.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {review.images.map((img, idx) => (
                                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                                        <Image 
                                            src={img} 
                                            alt="Review photo"
                                            fill
                                            className="object-cover"
                                            unoptimized // For picsum photos during dev
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-8 text-center">
                <button className="text-xs text-blue-600 font-bold hover:underline">
                    Read all {totalReviews} reviews
                </button>
            </div>
        </section>
    );
}
