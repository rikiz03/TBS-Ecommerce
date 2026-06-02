export type AnalyticsEvent = {
    type: 'view_product' | 'add_to_cart' | 'purchase';
    productId?: string;
    productName?: string;
    category?: string;
    price?: number;
    currency?: string;
    countryCode?: string;
    orderId?: string;
    timestamp: string;
};

export async function trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>) {
    const fullEvent: AnalyticsEvent = {
        ...event,
        timestamp: new Date().toISOString(),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log(' [Analytics Event] ', fullEvent);
    }

    try {
        await fetch('/api/analytics', {
            method: 'POST',
            body: JSON.stringify(fullEvent),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Failed to send analytics event:', error);
    }
}
