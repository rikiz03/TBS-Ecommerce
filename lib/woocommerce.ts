import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "",
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || "",
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || "",
    version: "wc/v3"
});

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
