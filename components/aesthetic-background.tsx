"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"

interface AestheticBackgroundProps {
  type: string
}

export function AestheticBackground({ type }: AestheticBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  switch (type) {
    case "gradient":
      return (
        <div
          className={`fixed inset-0 -z-10 ${
            isDark
              ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
              : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
          }`}
        />
      )

    case "particles":
      return (
        <div
          className={`fixed inset-0 -z-10 ${
            isDark ? "bg-gradient-to-br from-gray-900 to-black" : "bg-gradient-to-br from-slate-900 to-indigo-900"
          }`}
        >
          <ParticlesBackground isDark={isDark} />
        </div>
      )

    case "waves":
      return (
        <div
          className={`fixed inset-0 -z-10 ${
            isDark ? "bg-gradient-to-br from-gray-900 to-slate-900" : "bg-gradient-to-br from-blue-900 to-indigo-900"
          }`}
        >
          <WavesBackground isDark={isDark} />
        </div>
      )

    case "geometric":
      return (
        <div
          className={`fixed inset-0 -z-10 ${
            isDark ? "bg-gradient-to-br from-black to-gray-900" : "bg-gradient-to-br from-gray-900 to-gray-800"
          }`}
        >
          <GeometricBackground isDark={isDark} />
        </div>
      )

    default:
      return (
        <div
          className={`fixed inset-0 -z-10 ${
            isDark ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-blue-50 to-blue-200"
          }`}
        />
      )
  }
}

function ParticlesBackground({ isDark }: { isDark: boolean }) {
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
  }))

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${isDark ? "bg-white opacity-30" : "bg-white opacity-70"}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: ["0%", "100%", "0%"],
            opacity: isDark ? [0.1, 0.4, 0.1] : [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  )
}

function WavesBackground({ isDark }: { isDark: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={`absolute bottom-0 left-0 right-0 h-64 ${isDark ? "bg-white/5" : "bg-white/10"}`}
          style={{
            borderRadius: "50% 50% 0 0",
            transform: "scaleX(1.5)",
            bottom: `${-20 * i}px`,
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 5 + i,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  )
}

function GeometricBackground({ isDark }: { isDark: boolean }) {
  const shapes = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    size: Math.random() * 100 + 50,
    type: Math.floor(Math.random() * 3),
  }))

  return (
    <>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute ${isDark ? "opacity-5" : "opacity-10"}`}
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            borderRadius: shape.type === 0 ? "0%" : shape.type === 1 ? "50%" : "30%",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)"}`,
            transform: `rotate(${shape.rotation}deg)`,
          }}
          animate={{
            rotate: [shape.rotation, shape.rotation + 360],
          }}
          transition={{
            duration: 50 + shape.id,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </>
  )
}
