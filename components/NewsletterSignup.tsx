'use client';

import { useState } from 'react';
import { Send, CheckCircle2, Loader2, Leaf } from 'lucide-react';

export default function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setStatus('success');
            setEmail('');
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <section className="bg-[#0A432D] overflow-hidden relative border-y border-[#74D644]/20">
            {/* Decorative Patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-20 -left-20 w-80 h-80 border-[40px] border-[#74D644] rounded-full blur-2xl" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 border-[40px] border-emerald-500 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
                <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-[#74D644]/10 border border-[#74D644]/30 px-4 py-2 rounded-full text-[#74D644] text-xs font-black tracking-widest uppercase mb-6">
                            <Leaf className="w-4 h-4" />
                            Exclusive Deals & Offers
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 leading-tight">
                            Join the <span className="text-[#74D644]">Three Brothers</span> Family
                        </h2>
                        <p className="text-gray-300 text-lg">
                            Get early access to exclusive deals, new product drops, and 
                            <span className="text-white font-bold"> 10% OFF</span> your first order.
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        {status === 'success' ? (
                            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 animate-in zoom-in-95 duration-500 text-center shadow-2xl">
                                <CheckCircle2 className="w-16 h-16 text-[#74D644] mx-auto mb-4" />
                                <h3 className="text-2xl font-black text-white mb-2">Welcome to the family!</h3>
                                <p className="text-gray-300 font-medium">Check your inbox for your welcome discount code.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="relative group">
                                <div className="flex flex-col sm:flex-row gap-3 bg-white/5 p-2 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl">
                                    <div className="relative flex-grow">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="w-full bg-transparent px-5 py-4 text-white placeholder-gray-400 focus:outline-none text-base font-medium"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="bg-[#74D644] hover:bg-lime-400 disabled:bg-gray-600 text-[#0E5B3D] font-black px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                                    >
                                        {status === 'loading' ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Subscribe
                                                <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                                {status === 'error' && (
                                    <p className="text-red-400 text-sm mt-4 text-center font-bold animate-pulse">Oops! Something went wrong. Please try again.</p>
                                )}
                                <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-6 text-center font-bold">
                                    We respect your privacy. Unsubscribe at any time.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
