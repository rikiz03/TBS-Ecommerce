import { NextRequest, NextResponse } from 'next/server';
import { syncOrderToSupplier } from '@/lib/fulfillment';

/**
 * Payoneer Checkout Webhook Handler
 * Payoneer sends notifications to this URL when a payment status changes.
 */
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        
        // Payoneer typically sends 'resultInfo' and 'status' in the response
        // Common statuses: 'SUCCESS', 'FAILED', 'PENDING'
        const { transactionId, status, resultInfo } = data;

        if (!transactionId) {
            return NextResponse.json({ error: 'Missing transactionId' }, { status: 400 });
        }

        console.log(`Payoneer Webhook Received: Order ${transactionId}, Status: ${status}`);

        if (status === 'SUCCESS') {
            console.log(`Payment confirmed for Order: ${transactionId}. Syncing to fulfillment...`);
            
            // Trigger fulfillment logic
            // Note: In production, you would fetch order details from your database using transactionId
            /*
            await syncOrderToSupplier({
                orderId: transactionId,
                status: 'paid',
                method: 'payoneer'
            });
            */
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Payoneer Webhook Processing Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
