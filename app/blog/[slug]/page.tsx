import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { Calendar, Clock, ChevronLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

export default async function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // In a real app, we would fetch data based on the slug
    // Here we'll show a high-end static template
    const post = {
        title: 'Top 10 Trending Products to Scale Your Business in 2026',
        date: 'April 15, 2026',
        readTime: '6 min read',
        category: 'Market Insights',
        image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1200'
    };

    return (
        <article className="min-h-screen bg-white">
            {/* Post Header */}
            <header className="pt-32 pb-16 bg-gray-50 border-b border-gray-100">
                <div className="container mx-auto px-4 max-w-3xl">
                    <Link 
                        href="/blog" 
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 font-bold"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Insights
                    </Link>
                    
                    <div className="flex gap-3 mb-6">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {post.category}
                        </span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
                        {post.title}
                    </h1>
                    
                    <div className="flex items-center justify-between border-t border-gray-200 pt-8 mt-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-400">
                                PV
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">PremiumMarket Editorial</div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest">{post.date} • {post.readTime}</div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Facebook className="w-5 h-5 text-gray-400" /></button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Twitter className="w-5 h-5 text-gray-400" /></button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Share2 className="w-5 h-5 text-gray-400" /></button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Post Content */}
            <div className="container mx-auto px-4 max-w-3xl py-20">
                <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full rounded-3xl mb-12 shadow-2xl shadow-gray-200"
                />
                
                <div className="prose prose-lg prose-gray max-w-none">
                    <p className="text-xl text-gray-600 font-medium mb-8 leading-relaxed">
                        The global e-commerce landscape is shifting faster than ever. As we look at the data from early 2026, 
                        the winners are those who focus on niche differentiation and superior customer experience.
                    </p>

                    <h2 className="text-3xl font-black text-gray-900 mt-12 mb-6 tracking-tight">1. Smart Home Automation 2.0</h2>
                    <p className="mb-8 leading-relaxed">
                        It’s no longer enough to just sell a smart lightbulb. Customers now crave integrated ecosystems. 
                        We’re seeing a 140% YOY growth in locally hosted automation hubs that prioritize privacy—a key 
                        buying trigger for the 2026 demographic.
                    </p>

                    <h2 className="text-3xl font-black text-gray-900 mt-12 mb-6 tracking-tight">2. Bio-Hacking & Personal Wellness</h2>
                    <p className="mb-8 leading-relaxed">
                        The wellness industry has moved from general fitness to targeted bio-hacking tools. Portable 
                        cold-plunges, localized muscle therapists, and advanced sleep-optimization products are 
                        consistently seeing top sales velocity on platforms like CJ Dropshipping.
                    </p>

                    <blockquote className="bg-gray-50 border-l-4 border-orange-500 p-8 my-12 rounded-r-2xl italic text-2xl text-gray-700 leading-relaxed font-serif">
                        “The secret to scaling in 2026 is moving from a ‘store’ to a ‘source’—becoming the trusted authority for your category.”
                    </blockquote>

                    <p className="mb-8 leading-relaxed">
                        In conclusion, the merchants who win in 2026 will be those who curate with care. High volume is 
                        noise; high value is signal. Focus on products that solve complex problems or provide significant 
                        emotional releases.
                    </p>
                </div>

                {/* Internal Link CTA */}
                <div className="mt-20 p-8 bg-blue-600 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-black mb-2">Ready to scale?</h3>
                        <p className="text-blue-100">Explore our curated collections of trending products.</p>
                    </div>
                    <Link 
                        href="/" 
                        className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                    >
                        Browse Collections
                    </Link>
                </div>
            </div>
        </article>
    );
}
