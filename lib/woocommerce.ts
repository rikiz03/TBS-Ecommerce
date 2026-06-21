import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const wcUrl = process.env.WOOCOMMERCE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;

// IMPORTANT:
// Don't instantiate WooCommerceRestApi with missing env vars during build.
// Creating it with an empty url throws: "Options Error: url is required".
export function getWooCommerceClient() {
    if (!wcUrl) return null;
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
    if (!consumerKey || !consumerSecret) return null;

    return new WooCommerceRestApi({
        url: wcUrl,
        consumerKey,
        consumerSecret,
        version: "wc/v3",
    });
}

// Backwards compatibility for existing imports.
// Default export may be null when WooCommerce env vars are not configured.
const api = getWooCommerceClient();

export default api;



export interface WooProduct {
    id: number;
    name: string;
    slug: string;
    price: string;
    regular_price: string;
    sale_price: string;
    images: { src: string }[];
    average_rating: string;
    rating_count: number;
    categories: { name: string }[];
    description: string;
    short_description: string;
    stock_status: string;
    type: "simple" | "variable";
    attributes: {
        name: string;
        options: string[];
    }[];
    variations: number[];
}

export interface WooCategory {
    id: number;
    name: string;
    slug: string;
    image: { src: string } | null;
}
