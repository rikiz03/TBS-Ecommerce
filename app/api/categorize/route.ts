import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/woocommerce";
import { FEATURED_CATEGORIES, isSemanticMatch } from "@/lib/data";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const dryRun = searchParams.get("dry_run") !== "false";
    const limit = parseInt(searchParams.get("limit") || "100");

    // Prevent build-time/page-data failures when required env vars are missing.
    const wcUrl = process.env.WOOCOMMERCE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    if (!wcUrl || !process.env.WOOCOMMERCE_CONSUMER_KEY || !process.env.WOOCOMMERCE_CONSUMER_SECRET) {
        return NextResponse.json(
            {
                error: "WooCommerce env vars are not configured (WOOCOMMERCE_URL / WOOCOMMERCE_CONSUMER_KEY / WOOCOMMERCE_CONSUMER_SECRET).",
            },
            { status: 500 }
        );
    }


    try {
        console.log("Fetching categories from WooCommerce...");
        const categoriesRes = await api.get("products/categories", { per_page: 100 });
        const realCategories = categoriesRes.data;

        const uncategorizedCat = realCategories.find((c: any) => c.slug === 'uncategorized');
        if (!uncategorizedCat) {
            return NextResponse.json({ 
                error: "Uncategorized category not found in WooCommerce. Please check your categories.",
                available: realCategories.map((c: any) => c.slug)
            }, { status: 404 });
        }

        console.log(`Fetching up to ${limit} uncategorized products (ID: ${uncategorizedCat.id})...`);
        const productsRes = await api.get("products", { 
            category: uncategorizedCat.id, 
            per_page: limit,
            status: 'publish'
        });
        const products = productsRes.data;

        if (!products || products.length === 0) {
            return NextResponse.json({ message: "No uncategorized products found. Great job!" });
        }

        const results: any[] = [];
        let updatedCount = 0;
        let skippedCount = 0;

        for (const p of products) {
            let matchedFeatCat: any = null;

            // Prepare product data for matching logic
            const mockProduct = {
                title: p.name,
                description: p.description || "",
                short_description: p.short_description || "",
                category: 'Uncategorized'
            };

            // 1. Try to find a match using SEMANTIC_CRITERIA
            for (const featCat of FEATURED_CATEGORIES) {
                if (isSemanticMatch(mockProduct, featCat.id)) {
                    matchedFeatCat = featCat;
                    break;
                }
            }

            if (matchedFeatCat) {
                // 2. Find the real WooCommerce category ID for this match
                const realCat = realCategories.find((c: any) => 
                    c.name.toLowerCase() === matchedFeatCat.name.toLowerCase() ||
                    c.slug.toLowerCase() === matchedFeatCat.slug.toLowerCase()
                );

                if (realCat) {
                    if (!dryRun) {
                        await api.put(`products/${p.id}`, {
                            categories: [{ id: realCat.id }]
                        });
                        updatedCount++;
                    }
                    results.push({
                        id: p.id,
                        name: p.name,
                        match_reason: `Matched semantic rule for '${matchedFeatCat.name}'`,
                        new_category: realCat.name,
                        new_category_id: realCat.id,
                        status: dryRun ? 'will_update' : 'updated'
                    });
                } else {
                    results.push({
                        id: p.id,
                        name: p.name,
                        match_reason: `Matched '${matchedFeatCat.name}' but real category not found in WC`,
                        status: 'error_missing_category'
                    });
                    skippedCount++;
                }
            } else {
                results.push({
                    id: p.id,
                    name: p.name,
                    match_reason: "No semantic rules matched",
                    status: 'skipped'
                });
                skippedCount++;
            }
        }

        return NextResponse.json({
            summary: {
                total_processed: products.length,
                updated: dryRun ? 0 : updatedCount,
                will_update: dryRun ? updatedCount : 0,
                skipped: skippedCount,
                dry_run: dryRun
            },
            results
        });

    } catch (error: any) {
        console.error("Categorization Error:", error.response?.data || error.message);
        return NextResponse.json({ 
            error: "Failed to process products", 
            details: error.response?.data || error.message 
        }, { status: 500 });
    }
}
