import { NextRequest, NextResponse } from 'next/server';
import { syncInventoryFromCJ } from '@/lib/fulfillment';

export async function GET(req: NextRequest) {
    try {
        // In a real scenario, this would iterate through all suppliers
        // For now, we trigger the CJ inventory sync
        const cjData = await syncInventoryFromCJ();

        return NextResponse.json({
            success: true,
            message: 'Inventory synchronization completed',
            results: {
                cj: cjData
            }
        });

    } catch (error: any) {
        console.error('Inventory Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
