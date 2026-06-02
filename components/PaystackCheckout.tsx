'use client';

import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import { useSettingsStore } from '../lib/store';
import { getCurrencyInfo } from '../lib/geo';

interface PaystackCheckoutProps {
    email: string;
    amount: number;
    metadata?: any;
    onSuccess: (reference: any) => void;
    onClose: () => void;
    onPaymentClosed?: () => void;
}

export default function PaystackCheckout({ email, amount, metadata, onSuccess, onClose, onPaymentClosed }: PaystackCheckoutProps) {
    const { currency } = useSettingsStore();
    const { rate, symbol } = getCurrencyInfo(currency);
    
    // Paystack supported currencies
    const supportedCurrencies = ['NGN', 'USD', 'GHS', 'ZAR', 'KES'];
    const isSupported = supportedCurrencies.includes(currency);
    
    // Use the user's currency if supported, otherwise fallback to USD for global customers
    const chargeCurrency = isSupported ? currency : 'USD';
    
    // Convert USD amount to the target currency using live rate
    const finalChargeAmount = isSupported ? (amount * rate) : amount;
    
    const config = {
        reference: (new Date()).getTime().toString(),
        email: email,
        amount: Math.round(finalChargeAmount * 100), // Paystack expects amount in minor units
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        currency: chargeCurrency,
        label: "Three Brothers' Stores",
        metadata: {
            custom_fields: [
                {
                    display_name: "Business",
                    variable_name: "business",
                    value: "Three Brothers' Stores"
                }
            ],
            ...metadata
        },
    };

    const initializePayment = usePaystackPayment(config);

    return (
        <div className="w-full">
            <button
                onClick={() => {
                    initializePayment({
                        onSuccess: (reference: any) => onSuccess(reference),
                        onClose: () => {
                            onClose();
                            if (onPaymentClosed) onPaymentClosed();
                        }
                    });
                }}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
                Pay {chargeCurrency === 'USD' ? '$' : (chargeCurrency === 'NGN' ? '₦' : symbol)}{finalChargeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} with Card, Apple Pay or Google Pay
            </button>
        </div>
    );
}
