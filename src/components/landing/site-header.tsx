// components/landing/site-header.tsx
// Landing-page top navigation: brand wordmark, centered nav links, and the
// primary "Get started" CTA which opens the auth modal in place.
'use client'

import { useAuthModal } from '@/stores/auth-modal.store'
import { BrandLogo } from './brand-logo'

const NAV_LINKS = [
  { label: 'Browse Datasets', href: '/datasets', hasMenu: true },
  { label: 'How it works', href: '#how-it-works', hasMenu: false },
  { label: 'Customize Dataset', href: '#customize', hasMenu: false },
  { label: 'Resources', href: '#resources', hasMenu: true },
] as const

function Chevron() {
  return (
    <svg width="12.5" height="6.25" viewBox="0 0 13 7" fill="none" aria-hidden="true">
      <path d="M1 1l5.25 5L11.5 1" stroke="#616161" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SiteHeader() {
  const { open } = useAuthModal()

  return (
    <header className="flex h-16 items-center justify-between bg-white px-[44px] py-3">
      <BrandLogo />

      <nav className="flex items-center gap-5">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center gap-1 rounded px-2 py-1 font-public-sans text-sm font-medium text-[#616161] transition-colors hover:text-[#2563EB]"
          >
            {link.label}
            {link.hasMenu && <Chevron />}
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => open('sign-up')}
        className="rounded-lg bg-[#2563EB] px-7 py-2 font-public-sans text-base font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
      >
        Get started
      </button>
    </header>
  )
}
