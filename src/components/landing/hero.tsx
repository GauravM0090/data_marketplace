// components/landing/hero.tsx
// Landing hero: headline, supporting copy, and the two primary CTAs, centered
// over the decorative ribbon line-art in the top-left and bottom-right corners.

import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative flex min-h-[736px] items-center justify-center overflow-hidden bg-white px-6">
      {/* Decorative ribbons (transparent PNGs in /public/hero) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/wave-left.png"
        alt=""
        aria-hidden="true"
        className="
    pointer-events-none
    absolute
    -top-14
    -left-0
    w-[660px]
    max-w-none
    select-none
  "
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/wave-right.png"
        alt=""
        aria-hidden="true"
        className="
    absolute
    -bottom-14
    -right-15
    w-[650px]
    max-w-none
    pointer-events-none
    select-none
  "
      />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-[790px] flex-col items-center gap-12 text-center">
        <div className="flex flex-col items-center gap-[21px]">
          <h1 className="font-public-sans text-[64px] font-normal leading-[80px] text-[#181818]">
            Discover High-Quality{'   '}
            <br />
            <span className="text-[#2563EB]">AI Training data</span> at scale
          </h1>
          <p className="max-w-[790px] font-space-grotesk text-xl font-normal leading-7 text-[#444444]">
            Access curated datasets across text, image, audio, video, RLHF, and
            annotation-ready formats built for teams shipping AI at production
            speed.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/datasets"
            className="rounded-[10px] bg-[#2563EB] px-8 py-4 font-public-sans text-base font-semibold text-white shadow-[2px_2px_4px_rgba(37,99,235,0.25)] transition-colors hover:bg-[#1d4ed8]"
          >
            Explore marketplace
          </Link>
          <a
            href="#schedule"
            className="rounded-[10px] border border-[#DDDDDD] px-6 py-4 font-public-sans text-base font-semibold text-[#2563EB] transition-colors hover:border-[#2563EB]"
          >
            Schedule a Call
          </a>
        </div>
      </div>
    </section>
  )
}
