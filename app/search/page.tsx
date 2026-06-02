import { getProducts } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: true,
    },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; ai?: string }> }) {
    const { q, ai } = await searchParams;
    const query = q || '';
    const isAi = ai === 'true';

    let products: Product[] = [];
    if (query) {
        products = await getProducts({ search: query, per_page: 20 });
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className={`mb-8 border-b border-gray-100 pb-6 ${isAi ? 'bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl border-none shadow-sm' : ''}`}>
                {isAi && (
                    <div className="flex items-center gap-2 text-blue-600 font-bold mb-3 uppercase tracking-widest text-[10px]">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        AI Search Intelligence Active
                    </div>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {isAi 
                        ? `AI Match: Best finds for "${query}"`
                        : (query ? `Search results for "${query}"` : 'Search our products')
                    }
                </h1>
                <p className="text-gray-500">{products.length} curated matches found for you.</p>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <h2 className="text-xl font-medium text-gray-600 mb-2">No results found</h2>
                    <p className="text-gray-400">Try searching for something else or browse our categories.</p>
                </div>
            )}
        </div>
    );
}
