/**
 * Utility to send instant purchase notifications to the store owner via Telegram.
 */

export async function sendTelegramNotification(data: {
    orderId: string;
    total: number;
    fullName: string;
    city: string;
    countryCode: string;
    items: Array<{ title: string; quantity: number }>;
}) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.warn('Telegram notifications skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing.');
        return;
    }

    const itemsList = data.items.map(item => `- ${item.title} (x${item.quantity})`).join('\n');
    
    const message = `
🚀 *New Order Received!*

💰 *Total:* $${data.total.toFixed(2)}
🆔 *Order ID:* \`${data.orderId}\`

👤 *Customer:* ${data.fullName}
📍 *Location:* ${data.city}, ${data.countryCode}

📦 *Items:*
${itemsList}

💂‍♂️ _PremiumMarket Fulfillment Bot_
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            console.error('Telegram notification failed:', errData);
        }
    } catch (error) {
        console.error('Telegram request error:', error);
    }
}
