// components/landing/site-header.tsx
// Landing-page top navigation: brand wordmark, centered nav links, and the
// primary "Get started" CTA which opens the auth modal in place.
'use client'

import { useState } from 'react'
import { useAuthModal } from '@/stores/auth-modal.store'
import { BrandLogo } from '../landing/brand-logo'
import Link from 'next/link'

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

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white" />
    </svg>
  )
}

export function SiteHeader() {
  const { open } = useAuthModal()
  // Mock logged in state to display the "My profile" badge as requested.
  const [isLoggedIn] = useState(true)

  return (
    <header className="flex h-16 items-center justify-between bg-white px-[44px] py-3">
        <Link href={'/'}>
      <BrandLogo />

      </Link>
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

      {isLoggedIn ? (
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-[#EBF1FF] py-1.5 pl-1.5 pr-4 transition-colors hover:bg-blue-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F1B3D]">
            <UserIcon />
          </div>
          <span className="font-public-sans text-sm font-semibold text-[#2563EB]">
            My profile
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => open('sign-up')}
          className="rounded-lg bg-[#2563EB] px-7 py-2 font-public-sans text-base font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
        >
          Get started
        </button>
      )}
    </header>
  )
}
