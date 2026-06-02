import { Review } from "./types";

/**
 * Professional Review Importer Logic
 * This module simulates the import of high-quality buyer reviews from CJDropshipping.
 * In a production environment, this would fetch from a dedicated review aggregator or 
 * the WooCommerce product reviews API if the user has a review import plugin.
 */

const REVIEW_AUTHORS = [
    "Sarah M.", "James L.", "Elena R.", "Michael B.", "Aaliyah W.", 
    "David K.", "Jessica T.", "Kevin P.", "Maria G.", "Robert J."
];

const COMMENTS = [
    "Absolutely amazing! The quality exceeded my expectations. Shipping was faster than expected.",
    "Very satisfied with this purchase. Looks exactly like the pictures. Great value for the price.",
    "I've been looking for something like this for a long time. Works perfectly and feels premium.",
    "Good product. The packaging was very secure and arrived in perfect condition.",
    "Highly recommend! I bought two and they both work great. Customer support was also helpful.",
    "Excellent quality. You can tell it's made from good materials. Will buy from this store again.",
    "Beautiful design and very functional. It has made my daily routine so much easier.",
    "Surprised by how well it works. I was skeptical at first but now I'm a believer!",
    "Five stars! Everything from the ordering process to the delivery was smooth.",
    "Great item. It arrived earlier than the estimated date. Very happy with the results."
];

export function generateMockReviews(productId: string, count: number = 5): Review[] {
    const reviews: Review[] = [];
    const seed = parseInt(productId.split('-')[0]) || 0;

    for (let i = 0; i < count; i++) {
        const authorIndex = (seed + i) % REVIEW_AUTHORS.length;
        const commentIndex = (seed * i + i) % COMMENTS.length;
        const rating = 4 + (seed + i) % 2; // Returns 4 or 5 stars
        
        // Use a consistent date format
        const date = new Date();
        date.setDate(date.getDate() - (seed % 30) - i);

        reviews.push({
            id: `rev-${productId}-${i}`,
            author: REVIEW_AUTHORS[authorIndex],
            rating: rating,
            date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            comment: COMMENTS[commentIndex],
            verified: true,
            // Generic high-quality product review images
            images: i % 2 === 0 ? [
                `https://picsum.photos/seed/${seed + i}/400/400`,
                `https://picsum.photos/seed/${seed * i}/400/400`
            ] : []
        });
    }

    return reviews;
}
