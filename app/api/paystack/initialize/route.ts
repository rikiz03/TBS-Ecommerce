import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { error: 'Paystack integration removed. Stripe will replace it later.' },
    { status: 410 }
  );
}
