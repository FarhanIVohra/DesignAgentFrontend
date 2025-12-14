import React from 'react'

export default function ImageCard({ image, title = 'Title', description = 'Description', selectable = false, selected = false, onSelect }) {
  return (
  <div className={`relative card-bg rounded-xl shadow-sm hover:shadow-lg transform transition-all duration-200 ui-transition overflow-hidden`}>
      <div className="relative h-44 sm:h-48 lg:h-56 bg-gray-100 dark:bg-slate-800">
        {image ? (
          <img src={image.url || image} alt={title} className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">No image</div>
        )}

        {selectable && (
          <button
            onClick={onSelect}
            aria-pressed={selected}
            className={`absolute top-2 right-2 z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ring-1 ring-inset ${selected ? 'bg-blue-600 text-white ring-blue-600' : 'bg-white text-gray-700 ring-gray-200 dark:bg-slate-700 dark:ring-slate-600'}`}
            title={selected ? 'Selected' : 'Select to compare'}
          >
            {selected ? '✓' : '+'}
          </button>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-sm leading-5 truncate">{title}</h3>
  <p className="text-xs muted mt-1 truncate">{description}</p>
      </div>
    </div>
  )
}
