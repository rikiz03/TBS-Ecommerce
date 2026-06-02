'use client';

import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';

import { useCartStore } from '@/lib/store';

interface TwoCheckoutButtonProps {
    orderId: string;
    amount: number;
    email: string;
    fullName: string;
    city: string;
}

export default function TwoCheckoutButton({ orderId, amount, email, fullName, city }: TwoCheckoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const setCheckoutDetails = useCartStore(state => state.setCheckoutDetails);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            // Save details to store for when user returns
            setCheckoutDetails({ email, fullName, city, orderId, gateway: '2checkout' });

            // 1. In a real production app, you might want to create a pending order in your DB first

            // 2. Generate the Secure Checkout URL via our API
            const response = await fetch('/api/2checkout/signature', {
                method: 'POST',
                body: JSON.stringify({
                    params: {
                        'external-reference': orderId,
                        'currency': 'USD',
                        'prod': `Order #${orderId}`,
                        'price': amount.toString(),
                        'qty': '1',
                        'type': 'PRODUCT',
                        'return-type': 'redirect',
                        'return-url': window.location.origin + '/checkout/success'
                    }
                })
            });

            const { signature } = await response.json();
            const merchantCode = process.env.NEXT_PUBLIC_TWO_CHECKOUT_MERCHANT_CODE || '254581452145'; // Placeholder if not in env

            const queryParams = new URLSearchParams({
                'merchant': merchantCode,
                'external-reference': orderId,
                'currency': 'USD',
                'prod': `Order #${orderId}`,
                'price': amount.toString(),
                'qty': '1',
                'type': 'PRODUCT',
                'signature': signature,
                'return-type': 'redirect',
                'return-url': window.location.origin + '/checkout/success'
            });

            // 3. Redirect to 2Checkout Hosted Checkout
            window.location.href = `https://secure.2checkout.com/checkout/buy?${queryParams.toString()}`;

        } catch (error) {
            console.error('2Checkout Checkout Error:', error);
            alert('Failed to initiate checkout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    <CreditCard className="w-5 h-5" />
                    Pay with Credit Card (2Checkout)
                </>
            )}
        </button>
    );
}
