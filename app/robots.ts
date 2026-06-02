import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/checkout/', '/admin/', '/checkout/success'],
        },
        sitemap: 'https://premiumvaluemarket.com/sitemap.xml',
    }
}
