"use client";

import Script from "next/script";

const GA_IDS = ["G-61RLS51ZH5", "G-XMPYXRQRH0"];

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_IDS[0]}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_IDS[0]}', {
              page_path: window.location.pathname,
            });
            gtag('config', '${GA_IDS[1]}', {
              page_path: window.location.pathname,
            });
            window.dispatchEvent(new Event('gtag-loaded'));
          `,
        }}
      />
    </>
  );
}
