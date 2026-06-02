import { NextRequest, NextResponse } from 'next/server';
import { syncOrderToSupplier } from '@/lib/fulfillment';
import { sendTelegramNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId, items, fullName, city, countryCode, total } = body;

        if (!orderId || !items || items.length === 0) {
            return NextResponse.json({ error: 'Order ID and items are required' }, { status: 400 });
        }

        // 1. Send Instant Telegram Notification (to Store Owner)
        // We don't await this to keep the response fast
        sendTelegramNotification({
            orderId,
            items,
            fullName: fullName || 'Guest',
            city: city || 'Unknown City',
            countryCode: countryCode || 'US',
            total: total || 0
        }).catch(err => console.error('Notification log failed:', err));

        // 2. Trigger the asynchronous sync process to suppliers
        await syncOrderToSupplier({ orderId, items, fullName, city, countryCode });

        return NextResponse.json({ success: true, message: 'Fulfillment synchronization initiated' });

    } catch (error: any) {
        console.error('Fulfillment Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
