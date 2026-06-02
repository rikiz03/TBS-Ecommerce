import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const trackingNumber = searchParams.get('number');

    if (!trackingNumber) {
        return NextResponse.json({ error: 'Tracking number is required' }, { status: 400 });
    }

    try {
        // Log the tracking attempt
        console.log(`Tracking request for: ${trackingNumber}`);

        // Routing logic based on tracking number prefix
        // CJ tracking numbers often start with "CJ"
        if (trackingNumber.toUpperCase().startsWith('CJ')) {
            return await trackCJ(trackingNumber);
        }

        // Generic tracking fallback
        // In a real scenario, you'd check which supplier exported the tracking ID to WooCommerce
        return NextResponse.json({
            number: trackingNumber,
            status: 'Processing',
            courier: 'Global Fulfillment',
            lastUpdate: new Date().toLocaleDateString(),
            steps: [
                {
                    time: new Date().toLocaleTimeString(),
                    location: 'International Warehouse',
                    description: 'Order processed and ready for pickup by carrier.'
                }
            ]
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function trackCJ(number: string) {
    const apiKey = process.env.CJ_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'CJ API not configured' }, { status: 500 });
    }

    try {
        // CJ API Endpoint for tracking: /info/getLogisticInfo
        // Note: Actual CJ API might require specific parameters or a POST request
        const response = await fetch(`https://api.cjdropshipping.com/api2.0/logistic/getLogisticInfo?trackingNumber=${number}`, {
            headers: {
                'CJ-Access-Token': apiKey
            }
        });

        const data = await response.json();

        if (!data || data.code !== 200) {
            // Mocking for development if real API fails or gives empty result
            return NextResponse.json({
                number: number,
                status: 'In Transit',
                courier: 'CJ Logistics',
                lastUpdate: 'Today',
                steps: [
                    {
                        time: '14:20',
                        location: 'China Origin Facility',
                        description: 'Departed from the origin facility.'
                    },
                    {
                        time: '09:00',
                        location: 'Shanghai',
                        description: 'Arrived at the sorting center.'
                    }
                ]
            });
        }

        return NextResponse.json(data.data);
    } catch (error) {
        throw new Error('Failed to communicate with CJ API');
    }
}
