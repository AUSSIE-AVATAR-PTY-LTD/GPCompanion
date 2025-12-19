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
      {
        source: '/gpccmp',
        destination: '/gpccmp/GPCCMP%20and%20Review%20generator.html',
      },
      {
        source: '/type-2-diabetes',
        destination: '/40-49DiabetesRiskAssessment.html',
      },
      {
        source: '/45-49-health',
        destination: '/45-49YearHealthCheck.html',
      },
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
  
  // این خط مهمه - اگه نداری اضافه کن
  trailingSlash: false,
}

export default nextConfig