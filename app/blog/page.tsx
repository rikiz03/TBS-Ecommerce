import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';

const posts = [
    {
        title: 'Top 10 Trending Products to Scale Your Business in 2026',
        excerpt: 'Discover the hottest categories and high-margin products that are dominating the global marketplace this year...',
        date: 'April 15, 2026',
        readTime: '6 min read',
        slug: 'trending-products-2026',
        category: 'Market Insights',
        image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Why Premium Packaging is the Secret to Brand Loyalty',
        excerpt: 'In the world of dropshipping, the unboxing experience is your only physical touchpoint with your customers. Here is how to nail it...',
        date: 'April 10, 2026',
        readTime: '4 min read',
        slug: 'premium-packaging-guide',
        category: 'Branding',
        image: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&q=80&w=800'
    }
];

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <header className="bg-gray-50 pt-32 pb-20 border-b border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        <BookOpen className="w-3 h-3" />
                        Premium Insights
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Knowledge for the <span className="text-orange-500 underline decoration-4 underline-offset-8">Global Merchant</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        Industry trends, product deep-dives, and strategic guides to help you build a lasting e-commerce brand.
                    </p>
                </div>
            </header>

            {/* Featured Posts */}
            <main className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {posts.map((post) => (
                        <Link 
                            key={post.slug} 
                            href={`/blog/${post.slug}`}
                            className="group block"
                        >
                            <div className="overflow-hidden rounded-3xl mb-6 relative">
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-gray-900 shadow-sm uppercase tracking-wider">
                                    {post.category}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4 font-medium uppercase tracking-widest">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {post.date}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {post.readTime}
                                </span>
                            </div>
                            
                            <h2 className="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-gray-500 leading-relaxed mb-6 line-clamp-2">
                                {post.excerpt}
                            </p>
                            
                            <div className="flex items-center gap-2 font-bold text-gray-900 group-hover:gap-4 transition-all">
                                Read Full Article
                                <ArrowRight className="w-5 h-5 text-blue-600" />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            {/* Newsletter Integration for Blog */}
            <section className="bg-gray-50 py-20 border-t border-gray-100">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Never miss a deep-dive.</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Join 2,500+ other merchants receiving our weekly newsletter on scaling and product selection.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input 
                            type="email" 
                            placeholder="Your email address" 
                            className="px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full max-w-sm shadow-sm"
                        />
                        <button className="bg-gray-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-black transition-all shadow-lg active:scale-95">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
