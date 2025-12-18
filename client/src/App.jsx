import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home/Home'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/debug" element={<Home />} />
      </Routes>
    </Router>
  )
}