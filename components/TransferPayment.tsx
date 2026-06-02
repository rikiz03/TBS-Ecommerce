'use client';

import { useState } from 'react';
import { Landmark, Copy, Check, Send, AlertCircle, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/store';

interface TransferPaymentProps {
    orderId: string;
    amount: number;
    email: string;
    fullName: string;
}

export default function TransferPayment({ orderId, amount, email, fullName }: TransferPaymentProps) {
    const [copied, setCopied] = useState<string | null>(null);
    const [isNotifying, setIsNotifying] = useState(false);
    const [sent, setSent] = useState(false);
    const { items } = useCartStore();

    const accountDetails = {
        bankName: process.env.NEXT_PUBLIC_RAENEST_BANK_NAME || 'Wells Fargo',
        accountName: process.env.NEXT_PUBLIC_RAENEST_ACCOUNT_NAME || "Three Brothers' Stores",
        accountNumber: process.env.NEXT_PUBLIC_RAENEST_ACCOUNT_NUMBER || '40630267838276161',
        routingNumber: process.env.NEXT_PUBLIC_RAENEST_ROUTING_NUMBER || '021000021',
        swiftCode: process.env.NEXT_PUBLIC_RAENEST_SWIFT_CODE || 'WFBIUS6S',
        accountType: 'Checking'
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleNotify = async () => {
        setIsNotifying(true);
        try {
            const response = await fetch('/api/notifications/transfer', {
                method: 'POST',
                body: JSON.stringify({
                    orderId,
                    amount,
                    email,
                    fullName,
                    items: items.map(i => ({ title: i.title, quantity: i.quantity }))
                })
            });

            if (response.ok) {
                setSent(true);
            }
        } catch (error) {
            console.error('Failed to notify seller:', error);
        } finally {
            setIsNotifying(false);
        }
    };

    if (sent) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-green-800 dark:text-green-300 text-lg mb-2">Notification Sent!</h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                    We've notified the seller of your transfer. Your order will be processed once the funds are confirmed in our Raenest account.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <Landmark className="w-5 h-5 text-blue-600" />
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight">Direct Bank Transfer</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Global USD Payment via Raenest</p>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg flex items-start gap-3 border border-blue-100 dark:border-blue-900/30 mb-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                        Please transfer exactly <b>${amount.toFixed(2)}</b> to the account below. Use your Order ID <b>{orderId}</b> as the reference.
                    </p>
                </div>

                <div className="space-y-3">
                    {[
                        { label: 'Bank Name', value: accountDetails.bankName, field: 'bank' },
                        { label: 'Settlement Officer', value: accountDetails.accountName, field: 'name' },
                        { label: 'Account Number', value: accountDetails.accountNumber, field: 'number' },
                        { label: 'Routing Number', value: accountDetails.routingNumber, field: 'routing' },
                        { label: 'Swift Code', value: accountDetails.swiftCode, field: 'swift' }
                    ].map((item) => (
                        <div key={item.field} className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.label}</span>
                            <div className="flex items-center justify-between group">
                                <span className="text-sm font-mono text-gray-800 dark:text-gray-200">{item.value}</span>
                                <button 
                                    onClick={() => copyToClipboard(item.value, item.field)}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                >
                                    {copied === item.field ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleNotify}
                    disabled={isNotifying}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-70"
                >
                    {isNotifying ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            I have sent the payment
                        </>
                    )}
                </button>
                
                <p className="text-[10px] text-center text-gray-400">
                    Typically takes 1-3 business days for international wires.
                </p>
            </div>
        </div>
    );
}
