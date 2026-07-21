'use client'

import React from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

const FAQS = [
  {
    q: 'What licensing options do you offer?',
    a: 'We offer research, commercial, and enterprise licensing tiers. Research licenses restrict commercial use; commercial licenses cover production deployment; enterprise licenses include redistribution rights and SLAs. Full terms are available in our Terms of Service before purchase.'
  },
  {
    q: 'What licensing options do you offer?',
    a: 'We offer research, commercial, and enterprise licensing tiers. Research licenses restrict commercial use; commercial licenses cover production deployment; enterprise licenses include redistribution rights and SLAs. Full terms are available in our Terms of Service before purchase.'
  },
  {
    q: 'What licensing options do you offer?',
    a: 'We offer research, commercial, and enterprise licensing tiers. Research licenses restrict commercial use; commercial licenses cover production deployment; enterprise licenses include redistribution rights and SLAs. Full terms are available in our Terms of Service before purchase.'
  },
  {
    q: 'What licensing options do you offer?',
    a: 'We offer research, commercial, and enterprise licensing tiers. Research licenses restrict commercial use; commercial licenses cover production deployment; enterprise licenses include redistribution rights and SLAs. Full terms are available in our Terms of Service before purchase.'
  },
  {
    q: 'What licensing options do you offer?',
    a: 'We offer research, commercial, and enterprise licensing tiers. Research licenses restrict commercial use; commercial licenses cover production deployment; enterprise licenses include redistribution rights and SLAs. Full terms are available in our Terms of Service before purchase.'
  }
]

export function FAQSection() {
  return (
    <div id="faq" className="scroll-mt-32 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#181818]">Questions before you buy</h2>
        <p className="text-sm text-[#616161] leading-5">
          Answers to what buyers ask most. Can&apos;t find yours? Reach out and our team will get back within a day.
        </p>
      </div>

      <Accordion defaultValue="item-0" className="w-full flex flex-col gap-3">
        {FAQS.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-[#CBD5E1] bg-white px-5">
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
