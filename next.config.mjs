/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://api.stripe.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
              "frame-src https://js.stripe.com https://hooks.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },

  async redirects() {
    return [
      { source: '/gpccmp',                destination: '/api/tools?tool=gpccmp',                permanent: false },
      { source: '/type-2-diabetes',        destination: '/api/tools?tool=diabetes-risk',          permanent: false },
      { source: '/45-49-health',           destination: '/api/tools?tool=health-check-45',        permanent: false },
      { source: '/75-plus',               destination: '/api/tools?tool=health-assessment-75',    permanent: false },
      { source: '/atsi-adult-15-54',      destination: '/api/tools?tool=1554',                   permanent: false },
      { source: '/atsi-child-under-15',   destination: '/api/tools?tool=atsi-child',             permanent: false },
      { source: '/atsi-older-55-plus',    destination: '/api/tools?tool=atsi-senior',            permanent: false },
      { source: '/heart-health-check',    destination: '/api/tools?tool=heart-health',           permanent: false },
      { source: '/intellectual-disability', destination: '/api/tools?tool=id',                   permanent: false },
      { source: '/menopause-perimenopause', destination: '/api/tools?tool=menopause',            permanent: false },
      { source: '/racf-aged-care',        destination: '/api/tools?tool=aged-care',              permanent: false },
      { source: '/refugee',              destination: '/api/tools?tool=refugee',                  permanent: false },
      { source: '/former-serving-adf',   destination: '/api/tools?tool=adf-veteran',             permanent: false },
    ]
  },

  trailingSlash: false,
}

export default nextConfig
