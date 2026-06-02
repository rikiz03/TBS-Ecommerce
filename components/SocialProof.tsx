'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';

const LOCATIONS = [];
const NAMES = [];
const PRODUCTS = [];

export default function SocialProof() {
    const [notification, setNotification] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders/recent');
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (e) {
                console.error("Failed to fetch recent orders", e);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        if (orders.length === 0) return;
        
        let currentIndex = 0;

        const showNotification = () => {
            setNotification(orders[currentIndex]);
            setIsVisible(true);

            currentIndex = (currentIndex + 1) % orders.length;

            // Hide after 6 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 6000);
        };

        // Initial delay
        const initialDelay = setTimeout(showNotification, 8000);

        // Repeat every 25-40 seconds
        const interval = setInterval(() => {
            showNotification();
        }, Math.random() * (40000 - 25000) + 25000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, [orders]);

    if (!notification) return null;

    return (
        <div 
            className={`fixed bottom-6 left-6 z-[9998] max-w-[320px] w-full transition-all duration-500 transform ${
                isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
            }`}
        >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-3 flex gap-3 relative overflow-hidden group">
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-blue-600/20 w-full">
                    <div 
                        className={`h-full bg-blue-600 transition-all duration-[6000ms] ease-linear ${
                            isVisible ? 'w-full' : 'w-0'
                        }`} 
                    />
                </div>

                <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
                    <Image 
                        src={notification.product.image} 
                        alt={notification.product.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex-1 pr-4">
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                    
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> Recent Purchase
                    </p>
                    <p className="text-xs text-gray-800 dark:text-gray-100 leading-tight">
                        <span className="font-bold">{notification.name}</span> in <span className="font-bold">{notification.location}</span> 
                        {" "}bought a <span className="font-medium text-blue-700 dark:text-blue-300">{notification.product.title}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                        {notification.time} minutes ago • Verified
                    </p>
                </div>
            </div>
        </div>
    );
}
