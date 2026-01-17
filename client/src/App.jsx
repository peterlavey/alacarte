import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home/Home'
import Debug from '@/pages/Debug/Debug'
import WhatsAppLinkRequest from '@/pages/WhatsAppLinkRequest/WhatsAppLinkRequest'
import Offline from '@/pages/Offline/Offline'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

export default function App() {
  const isOnline = useNetworkStatus()

  if (!isOnline) {
    return <Offline />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/whatsapp-link" element={<WhatsAppLinkRequest />} />
      </Routes>
    </Router>
  )
}