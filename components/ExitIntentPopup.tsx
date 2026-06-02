'use client';

import { useState, useEffect } from 'react';
import { X, Gift, ArrowRight } from 'lucide-react';

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const shown = sessionStorage.getItem('exit_popup_shown');
        if (shown) {
            setHasShown(true);
            return;
        }

        const handleMouseOut = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasShown) {
                setIsVisible(true);
                setHasShown(true);
                sessionStorage.setItem('exit_popup_shown', 'true');
            }
        };

        document.addEventListener('mouseleave', handleMouseOut);
        return () => document.removeEventListener('mouseleave', handleMouseOut);
    }, [hasShown]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.includes('@')) {
            setIsSubmitted(true);
            // In a real app, you'd send this to your marketing API
            console.log('Collected email for 5% discount:', email);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative animate-in zoom-in-95 duration-300">
                <div className="aspect-video relative bg-gray-900 flex items-center justify-center p-8 overflow-hidden">
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 z-50 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#3b82f6_0%,_transparent_50%)]" />
                    </div>

                    <div className="relative text-center">
                        <div className="bg-white/10 p-4 rounded-full inline-block mb-4 backdrop-blur-md ring-1 ring-white/20">
                            <Gift className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white leading-tight">Wait! One Last Thing...</h2>
                    </div>
                </div>

                <div className="p-8">
                    {!isSubmitted ? (
                        <div className="text-center">
                            <p className="text-gray-600 mb-6 text-lg">
                                Unlock an exclusive <span className="font-bold text-gray-900">5% DISCOUNT</span> on your current order. Just tell us where to send your code!
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all text-center"
                                />
                                <button 
                                    type="submit"
                                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-gray-200"
                                >
                                    Reveal My Discount Code
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center animate-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ArrowRight className="w-8 h-8 text-green-600 rotate-90" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Discount Unlocked!</h3>
                                <p className="text-sm text-gray-500">Use this code at checkout to save 5%</p>
                            </div>

                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 mb-6">
                                <span className="text-4xl font-black text-gray-900 tracking-tighter">PV05</span>
                            </div>

                            <button 
                                onClick={() => setIsVisible(false)}
                                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg"
                            >
                                Shop with 5% Discount
                            </button>
                        </div>
                    )}

                    <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest font-medium text-center">
                        Secure SSL Encryption • We value your privacy
                    </p>
                </div>
            </div>
        </div>
    );
}
