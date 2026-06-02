'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Product } from '@/lib/types';

export default function ProductTracker({ product }: { product: Product }) {
    useEffect(() => {
        if (product) {
            trackEvent({
                type: 'view_product',
                productId: product.id,
                productName: product.title,
                price: product.price,
                category: product.category,
            });
        }
    }, [product]);

    return null; // This component doesn't render anything
}
