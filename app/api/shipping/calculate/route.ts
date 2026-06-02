import { NextRequest, NextResponse } from 'next/server';
import { getCJFreightRates } from '@/lib/fulfillment';

const EU_COUNTRIES = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 
    'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

const FREE_SHIPPING_COUNTRIES = ['US', ...EU_COUNTRIES];

export async function POST(req: NextRequest) {
    try {
        const { items, countryCode } = await req.json();

        // 1. Determine Origin Warehouse
        // If target is US, we use US warehouse. Otherwise, we use CN warehouse (Global).
        const startCountryCode = countryCode === 'US' ? 'US' : 'CN';

        // 2. Prepare CJ items (vid is externalId)
        const cjItems = items
            .filter((item: any) => item.supplier === 'CJ')
            .map((item: any) => ({
                vid: item.externalId,
                quantity: item.quantity
            }));

        if (cjItems.length === 0) {
            return NextResponse.json({ fee: items.length > 0 ? 10 : 0, strategy: 'FALLBACK_FLAT', shippingTime: '5-12' });
        }

        // 3. Fetch Rates for Target Country from optimal warehouse
        const rates = await getCJFreightRates(cjItems, countryCode, startCountryCode);
        
        if (rates.length === 0) {
            return NextResponse.json({ 
                error: 'PRODUCT_NOT_AVAILABLE', 
                message: `This product is not available for shipping to ${countryCode} from our ${startCountryCode === 'US' ? 'USA' : 'China'} warehouse.` 
            }, { status: 404 });
        }

        // Find the cheapest/best rate
        const bestRate = rates.reduce((prev: any, curr: any) => 
            (prev.logisticPrice < curr.logisticPrice) ? prev : curr
        );

        return NextResponse.json({ 
            fee: parseFloat(bestRate.logisticPrice.toFixed(2)),
            strategy: 'WAREHOUSE_OPTIMIZED',
            origin: startCountryCode,
            shippingTime: bestRate.shippingTime || '7-15'
        });

    } catch (error: any) {
        console.error('Shipping calculation error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
