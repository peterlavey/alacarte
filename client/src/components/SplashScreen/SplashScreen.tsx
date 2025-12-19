import React, { useEffect, useState } from 'react'
import styles from './SplashScreen.module.css'

interface SplashScreenProps {
  onAnimationEnd?: () => void
  fadeOut?: boolean
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationEnd, fadeOut = false }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => {
        setVisible(false)
        if (onAnimationEnd) onAnimationEnd()
      }, 500) // Match the transition duration in CSS
      return () => clearTimeout(timer)
    }
  }, [fadeOut, onAnimationEnd])

  if (!visible && fadeOut) return null

  return (
    <div className={`${styles.splashScreen} ${fadeOut ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <h1 className={styles.logo}>Alacarte</h1>
      </div>
    </div>
  )
}

export default SplashScreen
