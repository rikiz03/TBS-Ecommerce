'use client';

import { useCartStore, useSettingsStore } from '@/lib/store';
import { formatPrice, getCurrencyInfo } from '@/lib/geo';
import { useEffect, useState } from 'react';

interface PriceDisplayProps {
    price: number;
    className?: string;
    showOriginal?: boolean;
    originalPrice?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function PriceDisplay({ price, className, showOriginal, originalPrice, size = 'md' }: PriceDisplayProps) {
    const { currency } = useSettingsStore();
    const { currentExtraShipping, currentBasePrice } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Fallback to USD during hydration to avoid mismatch
        return <span className={className}>${price.toFixed(2)}</span>;
    }

    // Prioritize the live base price from the store (updated by BuyBox)
    const activeBasePrice = currentBasePrice > 0 ? currentBasePrice : price;
    const finalPrice = activeBasePrice + (currentExtraShipping || 0);
    
    // Adjust original price proportionally
    const finalOriginal = originalPrice ? (originalPrice + (activeBasePrice - price) + (currentExtraShipping || 0)) : undefined;

    const { symbol } = getCurrencyInfo(currency);
    const info = getCurrencyInfo(currency);
    const convertedPrice = finalPrice * info.rate;
    const formattedMain = convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const [whole, decimal] = formattedMain.split('.');

    if (size === 'xl') {
        return (
            <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                    <span className={`font-medium text-gray-900 dark:text-white symbol flex items-start ${className}`}>
                        <sup className="text-sm pt-1 mr-0.5">{symbol}</sup>
                        <span className="text-4xl">{whole}</span>
                        <sup className="text-sm pt-1">{decimal}</sup>
                    </span>
                </div>
                {showOriginal && finalOriginal && (
                    <div className="text-sm text-gray-500">
                        List Price: <span className="line-through">{formatPrice(finalOriginal, currency)}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <span className={className}>
            {formatPrice(finalPrice, currency)}
            {showOriginal && finalOriginal && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                    {formatPrice(finalOriginal, currency)}
                </span>
            )}
        </span>
    );
}
