/**
 * Sanitizes and renders descriptions that might contain a mix of HTML and Markdown.
 * Specifically handles common CJdropshipping / WooCommerce import quirks like **bold** text.
 */
export function formatDescription(text: string): string {
    if (!text) return "";

    let formatted = text;

    // 1. Convert Bold Markdown (**text** or __text__) to HTML
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // 2. Convert Italic Markdown (*text* or _text_) to HTML
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');

    // 3. Handle line breaks if the source is plain text
    // Only apply if it doesn't look like it already has HTML paragraph tags
    if (!formatted.includes('<p>') && !formatted.includes('<br')) {
        formatted = formatted.replace(/\n/g, '<br />');
    }

    return formatted;
}
