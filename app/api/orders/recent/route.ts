import { NextResponse } from 'next/server';
import api from '@/lib/woocommerce';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
    try {
        if (!api) {
            return NextResponse.json([], { status: 200 });
        }

        const response = await api!.get('orders', {


            per_page: 5,
            status: ['completed', 'processing'],
            orderby: 'date',
            order: 'desc'
        });

        const orders = response.data.map((order: any) => {
            // Get the first item ordered
            const item = order.line_items?.[0];
            return {
                id: order.id,
                name: order.billing?.first_name || 'A customer',
                location: `${order.billing?.city || 'Someone'}, ${order.billing?.country || 'Worldwide'}`,
                product: {
                    title: item?.name || 'an item',
                    image: item?.image?.src || 'https://placehold.co/100x100/png?text=Item'
                },
                time: Math.floor((new Date().getTime() - new Date(order.date_created).getTime()) / 60000) // Minutes ago
            };
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching recent orders:", error);
        return NextResponse.json([], { status: 200 }); // Return empty array on failure so frontend doesn't break
    }
}
