import { NextRequest, NextResponse } from 'next/server';
import { verify2CheckoutINS } from '@/lib/2checkout';
import { syncOrderToSupplier } from '@/lib/fulfillment';

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature') || '';

    // 1. Verify Request Authenticity
    const isValid = await verify2CheckoutINS(rawBody, signature);
    if (!isValid) {
        console.error('Invalid 2Checkout Webhook Signature');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = JSON.parse(rawBody);

        // 2Checkout INS event types: 'ORDER_CREATED', 'PAYMENT_RECEIVED', etc.
        // We look for successful payment
        if (data.message_type === 'ORDER_CREATED' || data.message_type === 'PAYMENT_RECEIVED') {
            const orderId = data.external_reference; // Your internal Order ID passed in buy-link

            console.log(`2Checkout Payment Received for Order: ${orderId}`);

            // 2. Trigger Fulfillment Sync
            // In a real app, you'd fetch the order details from your DB here
            // For now, we assume the fulfillment logic is handled based on the Order ID
            // await syncOrderToSupplier({ orderId, items: [] }); 
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('2Checkout Webhook Processing Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
