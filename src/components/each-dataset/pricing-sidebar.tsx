'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export function PricingSidebar({ dataset }: { dataset: any }) {
  const [payMode, setPayMode] = useState<'full' | 'installment'>('full')
  const price = dataset.price ? Number(dataset.price) : 7500
  const monthlyPrice = Math.round(price / 5)

  return (
    <div className="sticky top-[80px] w-full">
      <div className="flex flex-col gap-6 rounded-xl border border-[#CBD5E1] bg-white p-6">
        {/* Title */}
        <div>
          <div className="mb-1 text-xs text-[#8C8C8C]">
            {dataset.datasetCode ? `${dataset.datasetCode} / ` : ''}{dataset.industry || dataset.category || ''}
          </div>
          <h3 className="text-base font-semibold text-[#181818]">{dataset.title}</h3>
        </div>

        {/* Payment Mode Toggle */}
        <div className="grid grid-cols-2 gap-0 rounded-xl border border-[#CBD5E1] overflow-hidden">
          <button
            onClick={() => setPayMode('full')}
            className={cn(
              'flex flex-col items-start px-4 py-3 text-left transition-colors border-r border-[#CBD5E1] relative',
              payMode === 'full' ? 'bg-[#EFF6FF]' : 'bg-white hover:bg-gray-50'
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-xs text-[#616161]">Pay in full</span>
              <div className={cn(
                'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                payMode === 'full' ? 'border-[#2563EB]' : 'border-[#CBD5E1]'
              )}>
                {payMode === 'full' && <div className="h-2 w-2 rounded-full bg-[#2563EB]"></div>}
              </div>
            </div>
            <span className="mt-1.5 text-2xl font-bold text-[#181818]">${price.toLocaleString()}</span>
            <span className="text-[11px] text-[#8C8C8C] mt-0.5">Full dataset · one-time purchase</span>
          </button>
          <button
            onClick={() => setPayMode('installment')}
            className={cn(
              'flex flex-col items-start px-4 py-3 text-left transition-colors relative',
              payMode === 'installment' ? 'bg-[#EFF6FF]' : 'bg-white hover:bg-gray-50'
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-xs text-[#616161]">Pay in installments</span>
              <div className={cn(
                'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                payMode === 'installment' ? 'border-[#2563EB]' : 'border-[#CBD5E1]'
              )}>
                {payMode === 'installment' && <div className="h-2 w-2 rounded-full bg-[#2563EB]"></div>}
              </div>
            </div>
            <span className="mt-1.5 text-2xl font-bold text-[#181818]">${monthlyPrice.toLocaleString()}<span className="text-sm font-normal text-[#8C8C8C]">/month</span></span>
            <span className="text-[11px] text-[#8C8C8C] mt-0.5">6 months · Total ${(monthlyPrice * 6).toLocaleString()}</span>
          </button>
        </div>

        {/* Feature List */}
        <ul className="flex flex-col gap-3">
          {[
            `Full ${dataset.recordCount ? formatCount(Number(dataset.recordCount)) : '1.8M'}-${dataset.recordUnit || 'scan'} dataset`,
            'Commercial license',
            'Secure portal download',
            'Lifetime access, no expiry',
            '12 months of free updates',
          ].map((feature, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-[#181818]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path d="M3 8l3.5 3.5L13 5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {/* Buy Button */}
        <button className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#2563EB] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]">
          <CartIcon />
          Buy now at ${payMode === 'full' ? price.toLocaleString() : `${monthlyPrice.toLocaleString()}/mo`}
        </button>

        {/* Links */}
        <div className="flex items-center justify-between">
          <a href="#" className="text-xs text-[#2563EB] hover:underline">Download sample first</a>
          <a href="#" className="text-xs text-[#2563EB] hover:underline">Refund policy</a>
          <a href="#" className="text-xs text-[#2563EB] hover:underline">Data licensing terms</a>
        </div>
      </div>
    </div>
  )
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toLocaleString()
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 1h2l1.5 8h8L14 4H4"></path>
      <circle cx="6" cy="13" r="1"></circle>
      <circle cx="12" cy="13" r="1"></circle>
    </svg>
  )
}
