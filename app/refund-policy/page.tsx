export default function RefundPolicy() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Refund and Returns Policy</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">30-Day Returns Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    At Three Brothers' Stores, we want you to be completely satisfied with your purchase. 
                    We offer a **30-day return policy**, which means you have 30 days after receiving your item to request a return.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Returns Conditions</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    To be eligible for a return, your item must be in the same condition that you received it: unused, unworn, 
                    with tags, and in its original packaging. You will also need the receipt or proof of purchase.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Certain types of items cannot be returned, like perishable goods, custom products, and personal care goods.</li>
                    <li>Sale items or gift cards are not eligible for returns.</li>
                    <li>Items sent back to us without first requesting a return will not be accepted.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">How to Initiate a Return</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    To start a return, contact our support team at <a href="mailto:support@threebrothersstores.com" className="text-[#0E5B3D] hover:underline font-bold">support@threebrothersstores.com</a>. 
                    If your return is accepted, we will send you a return shipping label, as well as instructions on how and where to send your package. 
                    We have dedicated return centers in the **United States** and **Europe** to process returns quickly.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Refund Processing</h2>
                <p className="text-gray-700 leading-relaxed">
                    We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. 
                    If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take 
                    some time for your bank or credit card company to process and post the refund too.
                </p>
            </section>
        </div>
    );
}
