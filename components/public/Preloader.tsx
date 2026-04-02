'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Preloader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('preloader_shown')
    if (hasVisited) {
      setIsVisible(false)
      return
    }
    const timer = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('preloader_shown', '1')
    }, 3200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F0D0A]"
        >
          <div className="flex flex-col items-center gap-8">
            {/* Beer glass SVG animation */}
            <div className="relative w-20 h-28">
              <svg
                viewBox="0 0 80 110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Glass outline */}
                <path
                  d="M15 10 L8 100 Q8 106 14 106 L66 106 Q72 106 72 100 L65 10 Z"
                  stroke="#4D4438"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Handle */}
                <path
                  d="M65 30 Q82 30 82 50 Q82 70 65 70"
                  stroke="#4D4438"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Beer fill — animated */}
                <clipPath id="glass-clip">
                  <path d="M16 11 L9 100 Q9 105 14 105 L66 105 Q71 105 71 100 L64 11 Z" />
                </clipPath>
                <motion.rect
                  x="9"
                  y="0"
                  width="62"
                  height="105"
                  fill="#C8873A"
                  clipPath="url(#glass-clip)"
                  initial={{ y: 105 }}
                  animate={{ y: 22 }}
                  transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
                  opacity={0.9}
                />
                {/* Bubbles */}
                {[20, 35, 50].map((x, i) => (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={90}
                    r={2.5}
                    fill="rgba(232,168,85,0.6)"
                    clipPath="url(#glass-clip)"
                    initial={{ cy: 90, opacity: 0 }}
                    animate={{ cy: 30, opacity: [0, 0.7, 0] }}
                    transition={{
                      duration: 1.5,
                      delay: 1.2 + i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 0.5 + i * 0.3,
                    }}
                  />
                ))}
                {/* Foam */}
                <motion.ellipse
                  cx="40"
                  cy="22"
                  rx="28"
                  ry="10"
                  fill="#F5EFE6"
                  clipPath="url(#glass-clip)"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 2.0 }}
                />
              </svg>
            </div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="text-center"
            >
              <p className="font-display text-[#F5EFE6] text-xl tracking-[0.3em] uppercase">
                Дербентская
              </p>
              <p className="font-display text-[#C8873A] text-sm tracking-[0.5em] uppercase mt-1">
                Пивоварня
              </p>
            </motion.div>

            {/* Loading bar */}
            <motion.div className="w-32 h-[2px] bg-[#2E2820] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C8873A] to-[#E8A855]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.8, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
