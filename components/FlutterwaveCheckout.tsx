'use client';

import React from 'react';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import { useSettingsStore } from '../lib/store';
import { getCurrencyInfo } from '../lib/geo';

interface FlutterwaveCheckoutProps {
    email: string;
    amount: number;
    onSuccess: (reference: any) => void;
    onClose: () => void;
}

export default function FlutterwaveCheckout({ email, amount, onSuccess, onClose }: FlutterwaveCheckoutProps) {
    const { currency } = useSettingsStore();
    const { rate, symbol } = getCurrencyInfo(currency);
    
    // Flutterwave supports many currencies, but we'll use the user's current currency
    // or fallback to USD for global transactions.
    const chargeCurrency = currency;
    const finalChargeAmount = amount * rate;

    const config = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
        tx_ref: Date.now().toString(),
        amount: finalChargeAmount,
        currency: chargeCurrency,
        payment_options: 'card,applepay,googlepay,ussd',
        customer: {
            email: email,
            phone_number: '',
            name: 'Customer',
        },
        customizations: {
            title: "Three Brothers' Stores",
            description: 'Payment for order',
            logo: 'https://threebrothersstores.com/mylogo1.png',
        },
    };

    const fwConfig = {
        ...config,
        text: `Pay ${symbol}${finalChargeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} with Alternative (Apple/Google Pay)`,
        callback: (response: any) => {
            console.log(response);
            if (response.status === 'successful') {
                onSuccess(response);
            }
            closePaymentModal();
        },
        onClose: () => {
            onClose();
        },
    };

    return (
        <div className="w-full">
            <FlutterWaveButton
                {...fwConfig}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
            />
        </div>
    );
}
