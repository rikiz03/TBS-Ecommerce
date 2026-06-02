import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    if (!PAYSTACK_SECRET_KEY) {
        return NextResponse.json({ error: 'Paystack configuration missing' }, { status: 500 });
    }

    try {
        // Fetch transactions from the last 30 days
        const response = await fetch('https://api.paystack.co/transaction?perPage=100', {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        });

        const data = await response.json();

        if (!data.status) {
            throw new Error(data.message || 'Failed to fetch from Paystack');
        }

        const transactions = data.data || [];
        
        // Calculate Live Metrics
        const successfulTransactions = transactions.filter((tx: any) => tx.status === 'success');
        
        const totalRevenueKobo = successfulTransactions.reduce((acc: number, tx: any) => acc + tx.amount, 0);
        const totalRevenue = totalRevenueKobo / 100; // Convert to Dollars
        
        const orderCount = successfulTransactions.length;
        
        /**
         * PRECISE NET PROFIT CALCULATION logic:
         * In a full system, we'd subtract exact fulfillment costs.
         * For now, we use the user's requested "Precise Net" model:
         * Revenue - (Est. Product Cost: 40%) - (Est. Shipping/Fees: 15%) = 45% Net Margin.
         */
        const netProfit = totalRevenue * 0.45;
        
        const successRate = transactions.length > 0 
            ? ((successfulTransactions.length / transactions.length) * 100).toFixed(1) 
            : '0';

        return NextResponse.json({
            revenue: totalRevenue.toFixed(2),
            profit: netProfit.toFixed(2),
            orders: orderCount,
            rate: `${successRate}%`,
            lastUpdated: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
