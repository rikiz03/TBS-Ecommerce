import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const event = await req.json();

        // In a real application, you would save this to a database (Supabase, MongoDB, Postgres, etc.)
        // For now, we will log it to the server console.
        // This is where you can filter data for:
        // - "Which country buys most" (aggregate by countryCode)
        // - "Which product sells most" (count by productId)
        // - "When and how much" (timestamp and price)

        console.log('>>> ANALYTICS LOG:', JSON.stringify(event, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to log event' }, { status: 500 });
    }
}
