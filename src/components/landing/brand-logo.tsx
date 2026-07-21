// components/landing/brand-logo.tsx
// Upgence wordmark: a blue rounded tile holding a 2×2 grid of small squares
// (bottom-right tinted light blue), followed by the "Upgence" wordmark.

export function BrandLogo() {
  return (
    <div className="flex items-center gap-[5px] px-2 py-1">
      <span className="flex h-6 w-6 items-center justify-center rounded-[2.4px] bg-[#2563EB]">
        <span className="grid grid-cols-2 gap-[1.2px]">
          <span className="h-[6.6px] w-[6.6px] rounded-[0.6px] bg-white" />
          <span className="h-[6.6px] w-[6.6px] rounded-[0.6px] bg-white" />
          <span className="h-[6.6px] w-[6.6px] rounded-[0.6px] bg-white" />
          <span className="h-[6.6px] w-[6.6px] rounded-[0.6px] bg-[#DBEAFE]" />
        </span>
      </span>
      <span className="font-public-sans text-xl font-medium text-[#2563EB]">
        Upgence
      </span>
    </div>
  )
}
