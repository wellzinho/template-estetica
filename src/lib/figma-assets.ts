/**
 * Paths under `/public` exported from Figma (file `mwWYv5QKXF6T7pte2GGWBV`, página Estética).
 * Ícones sociais: nodes 68:597 / 68:602. Tratamentos: 65:2332. Hero poster: 60:1462. CTA: 68:556.
 * Sobre (retrato): 123:2 → `dr-valente.png`.
 */
export const figmaAssets = {
  hero: '/media/hero.png',
  heroPoster: '/media/hero.png',
  heroVideo: '/media/hero.mp4',
  treatments: {
    luminosidade: '/media/treatments/luminosidade.png',
    peeling: '/media/treatments/peeling.png',
    drenagem: '/media/treatments/drenagem.png',
    bioestimulacao: '/media/treatments/bioestimulacao.png',
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
  cta: '/media/cta-bg.jpg',
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
