export interface GeoInfo {
    countryCode: string;
    currency: string;
    locale: string;
    symbol: string;
    rate: number;
}

const COUNTRY_MAP: Record<string, { currency: string; locale: string; symbol: string; rate: number }> = {
    'US': { currency: 'USD', locale: 'en', symbol: '$', rate: 1.0 },
    'GB': { currency: 'GBP', locale: 'en', symbol: '£', rate: 0.8 },
    'ES': { currency: 'EUR', locale: 'es', symbol: '€', rate: 0.92 },
    'FR': { currency: 'EUR', locale: 'fr', symbol: '€', rate: 0.92 },
    'DE': { currency: 'EUR', locale: 'de', symbol: '€', rate: 0.92 },
    'CA': { currency: 'CAD', locale: 'en', symbol: 'C$', rate: 1.35 },
    'AU': { currency: 'AUD', locale: 'en', symbol: 'A$', rate: 1.52 },
    'NG': { currency: 'NGN', locale: 'en', symbol: '₦', rate: 1600 },
    'ZA': { currency: 'ZAR', locale: 'en', symbol: 'R', rate: 18.5 },
    'KE': { currency: 'KES', locale: 'en', symbol: 'KSh', rate: 130 },
    'GH': { currency: 'GHS', locale: 'en', symbol: 'GH₵', rate: 14 },
};

export async function detectUserLocation(): Promise<GeoInfo> {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code || 'US';
        const info = COUNTRY_MAP[countryCode] || COUNTRY_MAP['US'];

        // Fetch live exchange rate
        let liveRate = info.rate;
        try {
            const rateRes = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
            const rateData = await rateRes.json();
            if (rateData.rates && rateData.rates[info.currency]) {
                liveRate = rateData.rates[info.currency];
                console.log(`Live rate for ${info.currency}: ${liveRate}`);
            }
        } catch (e) {
            console.warn('Failed to fetch live rate, using fallback:', e);
        }

        return {
            countryCode,
            ...info,
            rate: liveRate
        };
    } catch (error) {
        console.error('Geolocation detection failed:', error);
        return {
            countryCode: 'US',
            ...COUNTRY_MAP['US']
        };
    }
}

export function getCurrencyInfo(currency: string): { symbol: string; rate: number } {
    const entry = Object.values(COUNTRY_MAP).find(c => c.currency === currency);
    return entry ? { symbol: entry.symbol, rate: entry.rate } : { symbol: '$', rate: 1.0 };
}

export function formatPrice(price: number, currency: string): string {
    const info = getCurrencyInfo(currency);
    const convertedPrice = price * info.rate;
    return `${info.symbol}${convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
