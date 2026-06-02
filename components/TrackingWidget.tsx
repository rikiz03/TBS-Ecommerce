'use client';

import { useState } from 'react';
import { Search, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TrackingWidget() {
    const [trackingNumber, setTrackingNumber] = useState('');

    return (
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-500" />
                Track Your Order
            </h4>
            <div className="relative mb-4">
                <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Tracking Number"
                    className="w-full bg-gray-900 border-none rounded-xl py-3 pl-4 pr-10 text-sm text-gray-300 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
                <button
                    onClick={() => {
                        if (trackingNumber.trim()) {
                            window.location.href = `/track-order?number=${encodeURIComponent(trackingNumber.trim())}`;
                        }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 transition-colors"
                >
                    <Search className="w-4 h-4" />
                </button>
            </div>
            <Link
                href="/track-order"
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
                View full tracking details <ArrowRight className="w-3 h-3" />
            </Link>
        </div>
    );
}
