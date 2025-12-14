import React, { createContext, useState, useContext, useCallback } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [jobId, setJobId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState([])
  const [selectedImages, setSelectedImages] = useState([])

  const selectImage = useCallback((image) => {
    setSelectedImages((prev) => {
      if (prev.find((i) => i.id === image.id)) return prev.filter((i) => i.id !== image.id)
      return [...prev, image].slice(0, 2)
    })
  }, [])

  const clearSelection = useCallback(() => setSelectedImages([]), [])

  const value = {
    jobId,
    setJobId,
    uploading,
    setUploading,
    processing,
    setProcessing,
    results,
    setResults,
    selectedImages,
    setSelectedImages,
    selectImage,
    clearSelection
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
