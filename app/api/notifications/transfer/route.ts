import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/notifications';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { orderId, amount, email, fullName, items } = data;

        // 1. Send Telegram Notification
        await sendTelegramNotification({
            orderId: `${orderId} (BANK TRANSFER PENDING)`,
            total: amount,
            fullName,
            city: 'DIRECT TRANSFER',
            countryCode: 'USD',
            items
        });

        // 2. Here you could also save to a database as "pending_transfer" status
        // For now, we rely on the Telegram alert.

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Transfer notification error:', error);
        return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }
}
