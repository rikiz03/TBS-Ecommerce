'use client';

import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';

import { useCartStore } from '@/lib/store';

interface PayoneerButtonProps {
    orderId: string;
    amount: number;
    email: string;
    fullName: string;
    city: string;
}

export default function PayoneerButton({ orderId, amount, email, fullName, city }: PayoneerButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const setCheckoutDetails = useCartStore(state => state.setCheckoutDetails);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            // Save details to store for when user returns
            setCheckoutDetails({ email, fullName, city, orderId, gateway: 'payoneer' });

            // 1. Initialize Payoneer Session
            const response = await fetch('/api/payoneer/create-session', {
                method: 'POST',
                body: JSON.stringify({
                    orderId,
                    amount,
                    email
                })
            });

            const data = await response.json();

            if (data.redirectUrl) {
                // 2. Redirect to Payoneer Hosted Checkout
                window.location.href = data.redirectUrl;
            } else {
                throw new Error(data.error || 'Failed to get checkout URL');
            }

        } catch (error) {
            console.error('Payoneer Checkout Error:', error);
            alert('Payoneer Checkout failed to initialize. Please use our Standard option above.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 active:scale-95"
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    <CreditCard className="w-5 h-5" />
                    Pay with Card (Alternative Global)
                </>
            )}
        </button>
    );
}
