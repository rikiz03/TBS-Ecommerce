'use client';

import { useCartStore } from '@/lib/store';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SyncedProductImageProps {
    fallbackImage: string;
    alt: string;
}

export default function SyncedProductImage({ fallbackImage, alt }: SyncedProductImageProps) {
    const { currentProductImage } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const displayImage = (mounted && currentProductImage) ? currentProductImage : fallbackImage;

    return (
        <div className="relative aspect-square w-full">
            <Image
                src={displayImage}
                alt={alt}
                fill
                unoptimized
                className="object-contain p-4 transition-all duration-300"
                priority
            />
        </div>
    );
}
