/** Static paths under `/public` — no remote Figma MCP URLs (they 404 outside authenticated export). */
export const figmaAssets = {
  hero: '/media/hero.png',
  heroPoster: '/media/hero.png',
  heroVideo: '/media/hero.mp4',
  treatments: {
    luminosidade: '/images/results/luminosidade-after.png',
    peeling: '/media/methodology.png',
    drenagem: '/media/hero.png',
    bioestimulacao: '/images/results/botox-after.png',
  },
  results: {
    luminosidade: {
      before: '/images/results/luminosidade-before.png',
      after: '/images/results/luminosidade-after.png',
    },
    botox: {
      before: '/images/results/botox-before.png',
      after: '/images/results/botox-after.png',
    },
  },
  professional: '/media/dr-valente.png',
  engineering: '/media/methodology.png',
  cta: '/media/hero.png',
  icons: {
    instagram: '/icons/instagram.svg',
    whatsapp: '/icons/whatsapp.svg',
  },
  drValente: '/media/dr-valente.png',
  testimonialCeo: '/media/testimonial-ceo.png',
  testimonialCfo: '/media/testimonial-cfo.png',
  testimonialHolding: '/media/testimonial-holding.png',
  methodology: '/media/methodology.png',
} as const
