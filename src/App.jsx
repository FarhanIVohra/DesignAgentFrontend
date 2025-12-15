import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Upload from './pages/Upload'
import Processing from './pages/Processing'
import Compare from './pages/Compare'
import ImageGenerator from './components/ImageGenerator.jsx';
import History from './pages/History'
import Variants from './pages/Variants.jsx'
import EditImage from './pages/EditImage.jsx'


export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>

          <Route path="/" element={<Navigate to="/generate-image" replace />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/processing" element={<Processing />} />
          {/* <Route path="/compare" element={<Compare />} /> */}
          <Route path="/history" element={<History />} />

          {/* ✅ Add this new route */}
          <Route path="/image-generator" element={<ImageGenerator />} />
          <Route path="/generate" element={<ImageGenerator />} />
          <Route path="/generate-image" element={<ImageGenerator />} />

          <Route path="*" element={<Navigate to="/generate-image" replace />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/variants" element={<Variants />} />
          <Route path="/edit" element={<EditImage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
