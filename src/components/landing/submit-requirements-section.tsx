'use client'

import React, { useState } from 'react'

const FEATURES = [
  'Any language, dialect, or regional variant',
  'Custom annotation schemas and taxonomies',
  'Volumes from thousands to hundreds of millions',
  'IRB and GDPR compliance support',
  'Dedicated project manager and QA lead',
]

export function SubmitRequirementsSection() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        setSuccess(true)
        e.currentTarget.reset()
      } else {
        alert('Failed to send request. Please try again later.')
      }
    } catch (err) {
      alert('An error occurred while sending your request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section 
      className="w-full text-white"
      style={{
        background: 'radial-gradient(69.37% 177.6% at 50% 50%, #0F1427 57.35%, #36488D 100%)',
        padding: '80px 20px',
      }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
        
        {/* Left Side: Copy & Checks */}
        <div className="flex flex-1 flex-col pt-4 max-w-[500px]">
          <h2 
            className="mb-10 text-4xl font-semibold md:text-5xl"
            style={{ fontFamily: "'Public Sans', sans-serif", lineHeight: '1.2' }}
          >
            Need data that<br />doesn't exist yet?
          </h2>

          <div className="flex flex-col gap-4">
            {FEATURES.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[#0F1427]">
                  <CheckIcon />
                </div>
                <span className="text-lg text-white" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-xl md:p-8">
          <h3 className="mb-6 text-2xl font-semibold text-[#181818]" style={{ fontFamily: "'Public Sans', sans-serif" }}>
            Submit your requirements
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-[#444444]">Full name</label>
              <input 
                id="name"
                name="name"
                required
                type="text" 
                placeholder="E.g. Nitish Reddy"
                className="rounded-lg border border-[#DDDDDD] bg-white px-3 py-2.5 text-sm text-[#181818] outline-none placeholder:text-[#A0A0A0] focus:border-[#2563EB]"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-[#444444]">Email</label>
              <input 
                id="email"
                name="email"
                required
                type="email" 
                placeholder="E.g. Nitish Reddy"
                className="rounded-lg border border-[#DDDDDD] bg-white px-3 py-2.5 text-sm text-[#181818] outline-none placeholder:text-[#A0A0A0] focus:border-[#2563EB]"
              />
            </div>

            {/* Data Type */}
            <div className="flex flex-col gap-2">
              <label htmlFor="dataType" className="text-sm font-medium text-[#444444]">Data Type</label>
              <select 
                id="dataType"
                name="dataType"
                required
                className="appearance-none rounded-lg border border-[#DDDDDD] bg-white px-3 py-2.5 text-sm text-[#A0A0A0] outline-none focus:border-[#2563EB] focus:text-[#181818]"
                defaultValue=""
              >
                <option value="" disabled>Select data type</option>
                <option value="text">Text/NLP</option>
                <option value="image">Image/Computer Vision</option>
                <option value="audio">Audio/Speech</option>
                <option value="video">Video</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Project Description */}
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-medium text-[#444444]">Project Description</label>
              <textarea 
                id="description"
                name="description"
                required
                rows={3}
                placeholder="Describe the AI use case you are building and what data you need..."
                className="resize-none rounded-lg border border-[#DDDDDD] bg-white px-3 py-2.5 text-sm text-[#181818] outline-none placeholder:text-[#A0A0A0] focus:border-[#2563EB]"
              ></textarea>
            </div>

            {/* Estimated Budget */}
            <div className="flex flex-col gap-2">
              <label htmlFor="budget" className="text-sm font-medium text-[#444444]">Estimated Budget</label>
              <select 
                id="budget"
                name="budget"
                required
                className="appearance-none rounded-lg border border-[#DDDDDD] bg-white px-3 py-2.5 text-sm text-[#A0A0A0] outline-none focus:border-[#2563EB] focus:text-[#181818]"
                defaultValue=""
              >
                <option value="" disabled>Select Budget range</option>
                <option value="<5k">&lt; $5,000</option>
                <option value="5k-25k">$5,000 - $25,000</option>
                <option value="25k-100k">$25,000 - $100,000</option>
                <option value="100k+">$100,000+</option>
              </select>
            </div>

            {/* Submit */}
            <div className="mt-2 flex flex-col gap-3">
              <button 
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#2563EB] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-70"
              >
                {loading ? 'Submitting...' : 'Submit your requirements'}
              </button>
              
              {success && (
                <p className="text-center text-sm font-medium text-green-600">Request submitted successfully!</p>
              )}
              
              <p className="text-center text-xs text-[#616161]">
                We respond within 1 business day. No commitment required.
              </p>
            </div>

          </form>
        </div>
      </div>
    </section>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
}
