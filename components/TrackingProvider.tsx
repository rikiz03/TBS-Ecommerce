'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function TrackingProvider() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Environment Variables
    const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
    const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

    useEffect(() => {
        if (!GA_ID) return;
        // Tracking page views on GA4
        window.gtag?.('config', GA_ID, {
            page_path: pathname + searchParams.toString(),
        });
    }, [pathname, searchParams, GA_ID]);

    return (
        <>
            {/* Google Analytics 4 */}
            {GA_ID && (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${GA_ID}', {
                                page_path: window.location.pathname,
                            });
                        `}
                    </Script>
                </>
            )}

            {/* Microsoft Clarity */}
            {CLARITY_ID && (
                <Script id="microsoft-clarity" strategy="afterInteractive">
                    {`
                        (function(c,l,a,r,i,t,y){
                            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window, document, "clarity", "script", "${CLARITY_ID}");
                    `}
                </Script>
            )}

            {/* Facebook Pixel */}
            {FB_PIXEL_ID && (
                <Script id="facebook-pixel" strategy="afterInteractive">
                    {`
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${FB_PIXEL_ID}');
                        fbq('track', 'PageView');
                    `}
                </Script>
            )}

            {/* TikTok Pixel */}
            {TIKTOK_PIXEL_ID && (
                <Script id="tiktok-pixel" strategy="afterInteractive">
                    {`
                        !function (w, d, t) {
                            w.Tawk_Ads_Object = t;
                            var ttq = w[t] = w[t] || [];
                            ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "trackV2", "trackSingleV2", "setOption"];
                            ttq.instance = function (t) {
                                for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setOption(e, ttq.methods[n]);
                                return e
                            };
                            ttq.load = function (e, n) {
                                var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
                                ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = i, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {};
                                n = document.createElement("script");
                                n.type = "text/javascript", n.async = !0, n.src = i;
                                i = document.getElementsByTagName("script")[0];
                                i.parentNode.insertBefore(n, i)
                            };
                            ttq.load('${TIKTOK_PIXEL_ID}');
                            ttq.page();
                        }(window, document, 'ttq');
                    `}
                </Script>
            )}
        </>
    );
}

// Add TypeScript definitions for window global objects
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
        fbq?: (...args: any[]) => void;
        ttq?: any;
    }
}
