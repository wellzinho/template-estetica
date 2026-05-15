import Link from 'next/link'
import { IconMail, IconPhone, IconPin } from '@/components/landing/icons'

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-gold bg-ink-soft pb-12 pt-14 md:pb-14 md:pt-[4.125rem]">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto_auto] lg:gap-12">
          <div className="flex max-w-xs flex-col gap-6">
            <div>
              <p className="font-serif text-2xl font-bold tracking-tight text-gold">VALENTE</p>
            </div>
            <p className="text-sm leading-relaxed text-mist">
              Advocacia de resultados focada na proteção de patrimônio e direitos fundamentais.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[13px] font-bold uppercase tracking-label text-marble">Contato</h3>
            <ul className="flex flex-col gap-4 text-sm text-mist">
              <li className="flex items-center gap-2">
                <IconMail className="size-3 shrink-0 text-gold" />
                <a href="mailto:contato@valente.adv.br" className="transition hover:text-gold">
                  contato@valente.adv.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <IconPhone className="size-3 shrink-0 text-gold" />
                <a href="tel:+5541999999999" className="transition hover:text-gold">
                  (41) 99999-9999
                </a>
              </li>
              <li className="flex items-start gap-2">
                <IconPin className="mt-0.5 size-3 shrink-0 text-gold" />
                <span>
                  Curitiba, PR —
                  <br />
                  Brasil
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[13px] font-bold uppercase tracking-label text-marble">Navegação</h3>
            <ul className="flex flex-col gap-3 text-sm text-mist">
              <li>
                <Link href="#areas" className="transition hover:text-gold">
                  Áreas de Atuação
                </Link>
              </li>
              <li>
                <Link href="#sobre" className="transition hover:text-gold">
                  Sobre o Dr. Eduardo
                </Link>
              </li>
              <li>
                <Link href="#contato" className="transition hover:text-gold">
                  Agendar Consulta
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="rounded-[2px] border border-gold-line bg-gold-wash px-4 py-4">
              <p className="text-[10px] font-normal uppercase leading-snug text-gold">Registro profissional</p>
              <p className="mt-1 font-sans text-base font-bold leading-snug text-marble">
                OAB/PR
                <br />
                123.456
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-rule pt-6 text-center">
          <p id="privacidade" className="sr-only">
            Política de privacidade
          </p>
          <p id="termos" className="sr-only">
            Termos de uso
          </p>
          <p className="text-[11px] uppercase leading-relaxed text-mist">
            © {new Date().getFullYear()} Eduardo Valente Advocacia Estratégica. Todos os direitos reservados.
          </p>
          <div className="mt-3 flex justify-center gap-6 text-[11px] uppercase text-mist">
            <Link href="#privacidade" className="transition hover:text-gold">
              Privacidade
            </Link>
            <Link href="#termos" className="transition hover:text-gold">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
