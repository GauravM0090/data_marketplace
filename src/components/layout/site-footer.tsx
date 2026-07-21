// components/layout/site-footer.tsx
// Dark site-wide footer — brand blurb + SERVICES / SOLUTIONS / COMPANY link
// columns, and a bottom copyright bar. Static content for now (no CMS yet).
import { BrandLogo } from '@/components/landing'

const COLUMNS: { heading: string; links: string[] }[] = [
  {
    heading: 'SERVICES',
    links: ['Custom Data Sourcing', 'Data Annotations / Enhancements', 'Localization', 'Crowd as a service', 'Content Moderation'],
  },
  {
    heading: 'SOLUTIONS',
    links: [
      'Computer Vision',
      'Data Annotations / Enhancements',
      'Conversational AI',
      'Neutral Language Processing',
      'Document AI',
      'Generative AI',
      'Healthcare',
      'ADAS',
    ],
  },
  {
    heading: 'COMPANY',
    links: ['About Macgence', 'Become a provider', 'Careers', 'Contact', 'In the media', 'JOB'],
  },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0B1220] px-[120px] pb-8 pt-14 text-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <BrandLogo variant="dark" />
          <p className="mt-3 max-w-xs font-public-sans text-sm leading-6 text-white/60">
            The marketplace for high-quality AI training data. Built for teams that ship.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <h3 className="font-public-sans text-xs font-semibold tracking-wide text-white/50">
              {column.heading}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link}>
                  <a href="#" className="font-public-sans text-sm text-white/80 hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-[1200px] flex-col gap-3 border-t border-white/10 pt-6 font-public-sans text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <span>COPYRIGHT@{year} - MACGENCE</span>
        <span className="flex items-center gap-4">
          <a href="#" className="hover:text-white">Privacy</a>
          <span aria-hidden="true">·</span>
          <a href="#" className="hover:text-white">Terms</a>
        </span>
      </div>
    </footer>
  )
}
