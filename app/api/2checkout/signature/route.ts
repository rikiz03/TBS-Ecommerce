import { NextRequest, NextResponse } from 'next/server';
import { generate2CheckoutSignature } from '@/lib/2checkout';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { params } = body;

        if (!params) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const signature = generate2CheckoutSignature(params);

        return NextResponse.json({ signature });
    } catch (error: any) {
        console.error('2Checkout Signature Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
