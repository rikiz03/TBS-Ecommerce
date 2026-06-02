/**
 * Unified fulfillment utility to handle multiple suppliers (CJ, DSers, EPROLO).
 * Each product imported into WooCommerce should have metadata identifying its source.
 */

export type Supplier = 'CJ' | 'DSERS' | 'EPROLO' | 'UNKNOWN';

export interface FulfillmentOrder {
    orderId: string;
    fullName: string;
    city: string;
    countryCode: string;
    items: Array<{
        productId: string;
        quantity: number;
        supplier: Supplier;
        externalProductId: string;
    }>;
}

/**
 * Identifies the supplier based on product metadata from WooCommerce.
 */
export function identifySupplier(metaData: any[]): { supplier: Supplier, externalId: string } {
    // DSers typically uses _dsers_product_id or similar
    const dsersId = metaData.find(m => m.key === '_dsers_product_id')?.value;
    if (dsersId) return { supplier: 'DSERS', externalId: dsersId };

    // EPROLO might use _eprolo_product_id or a source URL
    const eproloId = metaData.find(m => m.key === '_eprolo_product_id' || m.key === '_eprolo_source_id')?.value;
    if (eproloId) return { supplier: 'EPROLO', externalId: eproloId };

    // CJ dropshipping often has specific keys
    const cjId = metaData.find(m => m.key === '_cj_product_id' || m.key === 'cj_id')?.value;
    if (cjId) return { supplier: 'CJ', externalId: cjId };

    return { supplier: 'UNKNOWN', externalId: '' };
}

/**
 * Router to sync order to the correct supplier.
 */
export async function syncOrderToSupplier(order: FulfillmentOrder) {
    // Group items by supplier
    const grouped = order.items.reduce((acc, item) => {
        if (!acc[item.supplier]) acc[item.supplier] = [];
        acc[item.supplier].push(item);
        return acc;
    }, {} as Record<Supplier, any[]>);

    // Call respective APIs
    for (const [supplier, items] of Object.entries(grouped)) {
        switch (supplier as Supplier) {
            case 'CJ':
                await syncToCJ(order, items);
                break;
            case 'DSERS':
                await syncToDSers(order, items);
                break;
            case 'EPROLO':
                await syncToEprolo(order, items);
                break;
        }
    }
}

async function syncToCJ(order: FulfillmentOrder, items: any[]) {
    const apiKey = process.env.CJ_API_KEY;
    if (!apiKey) throw new Error('CJ_API_KEY missing');

    console.log(`Syncing order ${order.orderId} to CJ with ${items.length} items`);

    // CJ API V2 endpoint for creating orders: /order/create-v2
    try {
        const response = await fetch('https://api.cjdropshipping.com/api2.0/order/create-v2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CJ-Access-Token': apiKey
            },
            body: JSON.stringify({
                orderNumber: order.orderId,
                shippingAddress: {
                    fullName: order.fullName,
                    city: order.city,
                    countryCode: order.countryCode
                },
                products: items.map(item => ({
                    pid: item.externalProductId,
                    quantity: item.quantity
                }))
            })
        });

        const data = await response.json();
        if (data.code !== 200) {
            console.warn(`CJ API Warning for order ${order.orderId}: ${data.message}`);
        }
        return data;
    } catch (error) {
        console.error(`CJ Order Sync Error:`, error);
        throw error;
    }
}

async function syncToDSers(order: FulfillmentOrder, items: any[]) {
    const apiKey = process.env.DSERS_API_KEY;
    if (!apiKey) throw new Error('DSERS_API_KEY missing');

    console.log(`Syncing order ${order.orderId} to DSers with ${items.length} items`);

    try {
        // Example DSers generic API endpoint pattern. 
        // Note: Please verify the exact endpoint and payload standard in your DSers developer dashboard.
        const response = await fetch('https://open.dsers.com/api/v1/order/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                order_id: order.orderId,
                shipping_address: {
                    full_name: order.fullName,
                    city: order.city,
                    country_code: order.countryCode
                },
                line_items: items.map(item => ({
                    sku: item.externalProductId,
                    quantity: item.quantity
                }))
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.warn(`DSers API Warning for order ${order.orderId}: ${data.message || response.statusText}`);
        }
        return data;
    } catch (error) {
        console.error(`DSers Order Sync Error:`, error);
        throw error;
    }
}

async function syncToEprolo(order: FulfillmentOrder, items: any[]) {
    const apiKey = process.env.EPROLO_API_KEY;
    if (!apiKey) throw new Error('EPROLO_API_KEY missing');

    console.log(`Syncing order ${order.orderId} to EPROLO with ${items.length} items`);

    try {
        // Standard EPROLO API endpoint for creating orders
        const response = await fetch('https://api.eprolo.com/api/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Token': apiKey
            },
            body: JSON.stringify({
                order_sn: order.orderId,
                address: {}, // Pass actual shipping properties from order context here
                products: items.map(item => ({
                    product_id: item.externalProductId,
                    quantity: item.quantity
                }))
            })
        });

        const data = await response.json();
        if (!response.ok || data.code !== 200) {
            console.warn(`EPROLO API Warning for order ${order.orderId}: ${data.msg || response.statusText}`);
        }
        return data;
    } catch (error) {
        console.error(`EPROLO Order Sync Error:`, error);
        throw error;
    }
}

export async function getCJFreightRates(items: { quantity: number, vid: string }[], countryCode: string, startCountryCode: string = 'CN') {
    const apiKey = process.env.CJ_API_KEY;
    if (!apiKey) throw new Error('CJ_API_KEY missing');

    try {
        const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/logistic/freightCalculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CJ-Access-Token': apiKey
            },
            body: JSON.stringify({
                startCountryCode, // Origin (CN or US)
                endCountryCode: countryCode,
                products: items
            })
        });

        const data = await response.json();
        if (data.code !== 200) {
            console.warn(`CJ Freight API Warning: ${data.message}`);
            return [];
        }

        return data.data || [];
    } catch (error) {
        console.error(`CJ Freight Calculation Error:`, error);
        throw error;
    }
}

export async function syncInventoryFromCJ() {
    const apiKey = process.env.CJ_API_KEY;
    if (!apiKey) throw new Error('CJ_API_KEY missing');

    console.log(`Starting inventory sync from CJ dropshipping`);

    try {
        // CJ API endpoint for inventory: /product/getInventory
        const response = await fetch('https://api.cjdropshipping.com/api2.0/product/getInventory', {
            method: 'GET',
            headers: {
                'CJ-Access-Token': apiKey
            }
        });

        const data = await response.json();
        // Here we would iterate through data and update WooCommerce stock levels
        return data;
    } catch (error) {
        console.error(`CJ Inventory Sync Error:`, error);
        throw error;
    }
}
