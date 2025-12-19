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

  // ❌ rewrites کلاً حذف شد
  // چون برای HTML static باعث حذف layout و script میشه

  async redirects() {
    return [
      {
        source: '/gpccmp',
        destination: '/GPCCMP%20and%20Review%20generator.html',
        permanent: false,
      },
      {
        source: '/type-2-diabetes',
        destination: '/40-49DiabetesRiskAssessment.html',
        permanent: false,
      },
      {
        source: '/45-49-health',
        destination: '/45-49YearHealthCheck.html',
        permanent: false,
      },
      {
        source: '/75-plus',
        destination: '/75%2BHealthAssessment.html',
        permanent: false,
      },
      {
        source: '/atsi-adult-15-54',
        destination: '/1554.html',
        permanent: false,
      },
      {
        source: '/atsi-child-under-15',
        destination: '/ATSIChild.html',
        permanent: false,
      },
      {
        source: '/atsi-older-55-plus',
        destination: '/ATSISenior.html',
        permanent: false,
      },
      {
        source: '/heart-health-check',
        destination: '/Hearthealthassessment.html',
        permanent: false,
      },
      {
        source: '/intellectual-disability',
        destination: '/ID.html',
        permanent: false,
      },
      {
        source: '/menopause-perimenopause',
        destination: '/MenopauseandPerimenopause.html',
        permanent: false,
      },
      {
        source: '/racf-aged-care',
        destination: '/AgedCare.html',
        permanent: false,
      },
      {
        source: '/refugee',
        destination: '/Refugee.html',
        permanent: false,
      },
      {
        source: '/former-serving-adf',
        destination: '/ADFVeteran.html',
        permanent: false,
      },
    ];
  },

  trailingSlash: false,
};

export default nextConfig;
