export default function ShippingInfo() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Shipping Information</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Free Worldwide Shipping</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    We are proud to offer <b>Free Worldwide Shipping</b> on all orders! To ensure the best balance of speed and availability, we utilize a global fulfillment network.
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                    <li><b>USA Orders:</b> Dispatched from our local USA Warehouse for rapid delivery (3-8 business days).</li>
                    <li><b>USA-Exclusive Items:</b> Certain premium items are stocked exclusively in our USA Warehouse. These items are clearly marked in the Buy Box and are only available for delivery to clients within the United States.</li>
                    <li><b>International Orders:</b> Dispatched from our Global Hub in China, allowing us to reach clients in over 200 countries with tracked delivery.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Estimated Shipping Times</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Depending on your location and the warehouse used, these are our estimated delivery windows:
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 border">Destination</th>
                                <th className="p-3 border">Origin</th>
                                <th className="p-3 border">Estimated Time*</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-3 border font-medium">United States</td>
                                <td className="p-3 border text-sm">USA Warehouse</td>
                                <td className="p-3 border font-bold text-green-700">3-8 Business Days</td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">United Kingdom & Europe</td>
                                <td className="p-3 border text-sm">Global Hub</td>
                                <td className="p-3 border font-bold text-blue-700">7-15 Business Days</td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Canada & Australia</td>
                                <td className="p-3 border text-sm">Global Hub</td>
                                <td className="p-3 border font-bold text-blue-700">7-15 Business Days</td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Rest of the World</td>
                                <td className="p-3 border text-sm">Global Hub</td>
                                <td className="p-3 border font-bold">10-18 Business Days</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-gray-500 mt-3">*Processing time of 1-2 business days is added to the above estimates.</p>
            </section>

            <section className="mb-8 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                <h2 className="text-xl font-semibold mb-2 text-blue-900">Real-Time Delivery Estimates</h2>
                <p className="text-sm text-blue-800">
                    For the most accurate estimate, please check the <b>Buy Box</b> on any specific product page. We calculate real-time shipping speed based on your current location and the specific item's availability.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Tracking Information</h2>
                <p className="text-gray-700 leading-relaxed">
                    You will receive an email with a tracking number once your order is shipped.
                    For logistical reasons, items in the same purchase may be sent in separate packages
                    even if you've specified combined shipping.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Customs & Duties</h2>
                <p className="text-gray-700 leading-relaxed">
                    While we provide free shipping, we are not responsible for any custom fees once the items have shipped.
                    By purchasing our products, you consent that one or more packages may be shipped
                    to you and may incur custom fees when they arrive in your country.
                </p>
            </section>
        </div>
    );
}
