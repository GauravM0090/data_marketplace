'use client'

import React from 'react'

export function SavedDatasets() {
  return (
    <div className="mt-12">
      <h2 className="mb-2 text-xl font-semibold text-gray-900">Wishlist</h2>
      <p className="mb-6 text-sm text-gray-500">Review and manage the datasets you've saved</p>

      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white/50 p-12 text-center">
        <h3 className="mb-1 text-base font-semibold text-gray-900">No saved datasets yet</h3>
        <p className="mb-6 text-sm text-gray-500">Explore the marketplace to save datasets you're interested in.</p>
        
        <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Explore datasets
        </button>
      </div>
    </div>
  )
}
