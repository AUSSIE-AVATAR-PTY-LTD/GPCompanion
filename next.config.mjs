/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      // gpccmp — فایل با فاصله در اسم؛ فاصله باید URL-encoded باشه (%20)
      {
        source: '/gpccmp',
        destination: '/gpccmp/GPCCMP%20and%20Review%20generator.html',
      },

      // مثال‌های دیگر — اگر اسم فایل‌ها در public دقیقاً همین باشن:
      {
        source: '/type-2-diabetes',
        destination: '/40-49DiabetesRiskAssessment.html',
      },
      {
        source: '/45-49-health',
        destination: '/45-49YearHealthCheck.html',
      },
      // دقت: اگر اسم فایل شامل "+" است، باید "+" را encode کنی به %2B
      {
        source: '/75-plus',
        destination: '/75%2BHealthAssessment.html',
      },
      {
        source: '/atsi-adult-15-54',
        destination: '/1554.html',
      },
      {
        source: '/atsi-child-under-15',
        destination: '/ATSIChild.html',
      },
      {
        source: '/atsi-older-55-plus',
        destination: '/ATSISenior.html',
      },
      {
        source: '/heart-health-check',
        destination: '/Hearthealthassessment.html',
      },
      {
        source: '/intellectual-disability',
        destination: '/ID.html',
      },
      {
        source: '/menopause-perimenopause',
        destination: '/MenopauseandPerimenopause.html',
      },
      {
        source: '/racf-aged-care',
        destination: '/AgedCare.html',
      },
      {
        source: '/refugee',
        destination: '/Refugee.html',
      },
      {
        source: '/former-serving-adf',
        destination: '/ADFVeteran.html',
      }
    ]
  },
}

export default nextConfig
