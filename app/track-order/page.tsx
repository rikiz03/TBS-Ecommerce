'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, AlertCircle, Clock, MapPin, ChevronRight, Globe, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/geo';
import { useSettingsStore } from '@/lib/store';

export default function TrackOrderPage() {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [trackingData, setTrackingData] = useState<any>(null);
    const { currency } = useSettingsStore();

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingNumber.trim()) return;

        setLoading(true);
        setError('');
        setTrackingData(null);

        try {
            const res = await fetch(`/api/fulfillment/track?number=${encodeURIComponent(trackingNumber.trim())}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Tracking number not recognized by our global logistics network.');

            setTrackingData(data);
        } catch (err: any) {
            setError(err.message || 'Tracking number not found. Please note it may take 24-48 hours for new orders to appear in the system.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow bg-gray-50 dark:bg-[#0a0a0a] min-h-screen">
            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <Globe className="w-96 h-96 absolute -right-20 -bottom-20 text-white" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-blue-400 mb-6 border border-white/10">
                        <ShieldCheck className="w-4 h-4" /> Global Logistics Tracking
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Track Your International Order</h1>
                    <p className="text-gray-400 text-lg md:text-xl">
                        Monitor your shipment's journey from our global hubs to your doorstep with real-time updates.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 pb-20 max-w-4xl relative z-20">
                {/* Search Bar */}
                <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-4 md:p-8 mb-12 border border-gray-100 dark:border-gray-800">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Package className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Enter Order or Tracking Number (e.g. CJ...)"
                                className="w-full pl-16 pr-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 outline-none text-lg transition-all dark:text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 disabled:opacity-70 active:scale-95"
                        >
                            {loading ? (
                                <Clock className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Locate Shipment
                                </>
                            )}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-xs text-gray-400 font-medium">
                        Secure SSL Tracking • Data provided by Global Fulfillment Partners
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 p-8 rounded-3xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-lg mb-1">Search Error</h3>
                            <p className="text-sm opacity-90">{error}</p>
                        </div>
                    </div>
                )}

                {/* Tracking Results */}
                {trackingData ? (
                    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                        {/* Status Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Current Status</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-xl font-bold dark:text-white">{trackingData.status || 'In Transit'}</span>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Estimated Arrival</p>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    <span className="text-xl font-bold dark:text-white">{trackingData.estimatedDelivery || 'Calculated Soon'}</span>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Carrier Partner</p>
                                <div className="flex items-center gap-3">
                                    <Truck className="w-5 h-5 text-gray-400" />
                                    <span className="text-xl font-bold dark:text-white">{trackingData.courier || 'Global Express'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Timeline Card */}
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-8 md:p-12">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-10 flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                    Journey Details
                                </h3>

                                <div className="relative space-y-12 ml-4 md:ml-8">
                                    {/* Vertical Line */}
                                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-600 via-blue-200 to-transparent opacity-30" />

                                    {trackingData.steps?.map((step: any, idx: number) => (
                                        <div key={idx} className="relative pl-10 group">
                                            {/* Dot */}
                                            <div className={`absolute left-[-5px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 transition-all group-hover:scale-150 ${idx === 0 ? 'bg-blue-600 ring-4 ring-blue-500/20' : 'bg-gray-300 dark:bg-gray-700'}`} />
                                            
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                                <h4 className={`font-bold ${idx === 0 ? 'text-gray-900 dark:text-white text-lg' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {step.location || 'Logistics Hub'}
                                                </h4>
                                                <time className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full whitespace-nowrap">
                                                    {step.time || 'Update Pending'}
                                                </time>
                                            </div>
                                            <p className={`text-sm leading-relaxed ${idx === 0 ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}>
                                                {step.description}
                                            </p>
                                        </div>
                                    ))}

                                    {(!trackingData.steps || trackingData.steps.length === 0) && (
                                        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                                            <Package className="w-16 h-16 mx-auto mb-6 text-gray-300 animate-bounce" />
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">Tracking data is being synchronized with our logistics partners...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Protection Footer */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-blue-600/20">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-10 h-10" />
                            </div>
                            <div className="text-center md:text-left">
                                <h4 className="text-2xl font-black mb-2">Premium Buyer Protection</h4>
                                <p className="text-blue-100 opacity-90 max-w-md">
                                    Your shipment is fully insured. If anything happens during transit, we'll send a replacement at no extra cost.
                                </p>
                            </div>
                            <div className="md:ml-auto">
                                <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg active:scale-95">
                                    Help Center <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : !loading && (
                    <div className="text-center py-20 opacity-40">
                        <Package className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                        <p className="text-gray-500 font-medium">Enter your tracking number above to see updates</p>
                    </div>
                )}
            </div>
        </main>
    );
}
