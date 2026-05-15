'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useId, useState } from 'react'

const faqs = [
  {
    q: 'Quais documentos preciso para uma consulta?',
    a: 'Recomendamos reunir identificação civil, contratos ou peças relacionadas ao caso e cronologia dos fatos. Na confirmação do agendamento enviamos um checklist personalizado.',
  },
  {
    q: 'Quanto tempo demora um processo trabalhista?',
    a: 'O tempo varia conforme instância, complexidade e ritmo do juízo. Apresentamos projeções baseadas em jurimetria e mantemos relatórios periódicos de andamento.',
  },
  {
    q: 'Vocês atendem em outros estados?',
    a: 'Sim. Atuamos com infraestrutura digital segura e deslocamento estratégico quando a causa exige presença física.',
  },
  {
    q: 'Como funciona o pagamento dos honorários?',
    a: 'Estruturamos honorários alinhados ao escopo da demanda — consultivos, êxito ou híbridos — sempre com contrato transparente.',
  },
] as const

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)
  const baseId = useId()

  return (
    <section className="bg-ink-soft py-16">
      <div className="mx-auto max-w-[800px] px-4">
        <h2 className="text-center font-serif text-[clamp(2rem,8vw,3rem)] font-semibold leading-tight text-marble md:text-[48px] md:leading-[57.6px]">
          Dúvidas Frequentes
        </h2>
        <div className="mt-10 flex flex-col gap-4">
          {faqs.map((item, i) => {
            const id = `${baseId}-faq-${i}`
            const expanded = open === i
            return (
              <div
                key={item.q}
                className="glass-panel rounded-[2px] border border-white/[0.05] px-4 py-1 backdrop-blur-[10px]"
              >
                <button
                  type="button"
                  id={`${id}-btn`}
                  aria-expanded={expanded}
                  aria-controls={`${id}-panel`}
                  className="flex w-full items-start justify-between gap-4 py-4 text-left"
                  onClick={() => setOpen(expanded ? null : i)}
                >
                  <span className="font-serif text-[1.05rem] font-bold leading-snug text-marble md:text-lg">
                    {item.q}
                  </span>
                  <motion.span
                    aria-hidden
                    className="mt-1 inline-flex size-4 shrink-0 items-center justify-center text-gold"
                    animate={{ rotate: expanded ? 45 : 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <svg viewBox="0 0 14 14" width="14" height="14" fill="none">
                      <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.div
                      id={`${id}-panel`}
                      role="region"
                      aria-labelledby={`${id}-btn`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-2 text-sm leading-relaxed text-mist md:text-base">{item.a}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
