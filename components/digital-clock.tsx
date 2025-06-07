"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/contexts/theme-context"

export function DigitalClock() {
  const [time, setTime] = useState(new Date())
  const { theme } = useTheme()

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const isDark = theme === "dark"

  return (
    <div className={`text-5xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
      {time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </div>
  )
}
