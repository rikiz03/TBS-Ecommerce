'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, MessageSquare, Search } from 'lucide-react';

interface AISearchSectionProps {
    placeholder: string;
    buttonText: string;
}

const SUGGESTIONS = [
    "Find a gift for a tech lover under $50",
    "Show me the best selling smart watches",
    "I need a premium wireless earbud with noise cancellation",
    "Find me a luxury leather wallet in black"
];

export default function AISearchSection({ placeholder, buttonText }: AISearchSectionProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isFocused && !query) {
                setSuggestionIndex((prev) => (prev + 1) % SUGGESTIONS.length);
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [isFocused, query]);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}&ai=true`);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className={`relative group transition-all duration-500 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
                {/* Background Glow */}
                <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 ${isFocused ? 'opacity-50' : ''}`} />
                
                <form 
                    onSubmit={handleSearch} 
                    className="relative bg-white dark:bg-gray-900 p-3 rounded-[2.5rem] shadow-2xl flex items-center gap-2 border border-white/20"
                >
                    <div className="pl-6 text-blue-600 dark:text-blue-400">
                        <Sparkles className={`w-6 h-6 ${isFocused ? 'animate-pulse' : ''}`} />
                    </div>
                    
                    <input 
                        type="text" 
                        aria-label="Ask AI to find products" 
                        value={query}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder} 
                        className="flex-1 px-4 py-4 text-lg outline-none bg-transparent text-gray-800 dark:text-white placeholder-gray-400 font-medium" 
                    />

                    <button 
                        type="submit"
                        className="bg-gray-900 dark:bg-white dark:text-black text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-black dark:hover:bg-gray-200 transition-all flex items-center gap-2 shadow-xl shadow-gray-200 dark:shadow-none active:scale-95"
                    >
                        {buttonText}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>

            {/* AI Prompt Suggestions */}
            {!query && (
                <div className="mt-12 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-700">
                    <p className="w-full text-center text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Try asking me
                    </p>
                    {SUGGESTIONS.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setQuery(s);
                                // Small delay to let user see it's filled before searching
                                setTimeout(() => {
                                    router.push(`/search?q=${encodeURIComponent(s)}&ai=true`);
                                }, 300);
                            }}
                            className={`text-[11px] font-bold px-4 py-2 rounded-full border transition-all ${
                                i === suggestionIndex 
                                ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm scale-105' 
                                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200'
                            }`}
                        >
                            "{s}"
                        </button>
                    ))}
                </div>
            )}
            
            {/* Real-time feedback */}
            {query && (
                <div className="mt-4 text-center animate-pulse">
                    <p className="text-xs text-blue-600 font-bold flex items-center justify-center gap-2">
                        <Search className="w-3 h-3" /> AI is ready to find the best matches for you...
                    </p>
                </div>
            )}
        </div>
    );
}
