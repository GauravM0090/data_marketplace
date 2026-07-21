// components/datasets/filter-section.tsx
// Collapsible "Industry / Modality / Usecase / …" panel used throughout the
// filters sidebar. Uncontrolled <details> — no state needed for open/closed,
// and it's keyboard/AT accessible for free.
export function FilterSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-lg border border-[#E5E5E5] bg-white [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-public-sans text-sm font-medium text-[#181818]">
        {title}
        <svg
          width="14"
          height="8"
          viewBox="0 0 14 8"
          fill="none"
          className="text-[#8C8C8C] transition-transform group-open:rotate-180"
          aria-hidden="true"
        >
          <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="border-t border-[#E5E5E5] px-4 py-3">{children}</div>
    </details>
  )
}
