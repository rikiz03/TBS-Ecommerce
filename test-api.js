const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
    url: "https://dev-premiumvaluemarketbackend.pantheonsite.io",
    consumerKey: "ck_6e4bb4047616a7a2472e070801eda330dc9b974a",
    consumerSecret: "cs_a3ba5e58914e69d82c45a103777d33f43f92a007",
    version: "wc/v3"
});

console.log("Testing WooCommerce API connection...");

api.get("products", { per_page: 1 })
    .then((response) => {
        console.log("SUCCESS: Connected to WooCommerce!");
        console.log("Product count found:", response.data.length);
        if (response.data.length > 0) {
            console.log("Sample product title:", response.data[0].name);
        } else {
            console.log("No products found in the store yet, but connection is valid.");
        }
        process.exit(0);
    })
    .catch((error) => {
        console.error("ERROR: Failed to connect to WooCommerce.");
        console.error("Status:", error.response?.status);
        console.error("Message:", error.response?.data?.message || error.message);
        process.exit(1);
    });
