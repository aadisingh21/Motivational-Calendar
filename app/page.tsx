"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DigitalClock } from "@/components/digital-clock"
import { AnalogClock } from "@/components/analog-clock"
import { QuoteModal } from "@/components/quote-modal"
import { EnhancedCalendar } from "@/components/enhanced-calendar"
import { EnhancedSettings } from "@/components/enhanced-settings"
import { QuoteManager } from "@/components/quote-manager"
import { AestheticBackground } from "@/components/aesthetic-background"
import { ThemeProvider, useTheme } from "@/contexts/theme-context"
import { quotes } from "@/lib/quotes"
import { motion } from "framer-motion"

function MotivationalCalendarContent() {
  const [clockType, setClockType] = useState<"digital" | "analog">("digital")
  const [selectedQuote, setSelectedQuote] = useState("")
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [customQuotes, setCustomQuotes] = useState<Record<string, string>>({})
  const [backgroundType, setBackgroundType] = useState("default")
  const [viewingQuotes, setViewingQuotes] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const savedQuotes = localStorage.getItem("customQuotes")
    if (savedQuotes) {
      setCustomQuotes(JSON.parse(savedQuotes))
    }

    const savedBackground = localStorage.getItem("backgroundPreference")
    if (savedBackground) {
      setBackgroundType(savedBackground)
    }
  }, [])

  const handleDateClick = (date: Date) => {
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

    let quote = customQuotes[dateKey]
    if (!quote) {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      quote = quotes[randomIndex]
    }

    setSelectedQuote(quote)
    setIsQuoteModalOpen(true)
  }

  const handleBackgroundChange = (bg: string) => {
    setBackgroundType(bg)
    localStorage.setItem("backgroundPreference", bg)
  }

  const handleSaveCustomQuote = (date: string, quote: string) => {
    const updatedQuotes = { ...customQuotes, [date]: quote }
    setCustomQuotes(updatedQuotes)
    localStorage.setItem("customQuotes", JSON.stringify(updatedQuotes))
  }

  const isDark = theme === "dark"

  return (
    <>
      <AestheticBackground type={backgroundType} />

      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div
              className={`inline-block ${
                isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
              } backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-4 border`}
            >
              {clockType === "digital" ? <DigitalClock /> : <AnalogClock />}
            </div>
            <div>
              <Button
                onClick={() => setClockType(clockType === "digital" ? "analog" : "digital")}
                variant="outline"
                className={`${
                  isDark
                    ? "bg-gray-800/80 border-gray-700 hover:bg-gray-700/80 text-white"
                    : "bg-white/80 hover:bg-white/90"
                } backdrop-blur-sm`}
              >
                Switch to {clockType === "digital" ? "Analog" : "Digital"}
              </Button>
            </div>
          </motion.header>

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <EnhancedCalendar onDateClick={handleDateClick} customQuotes={customQuotes} />
          </motion.main>

          <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} quote={selectedQuote} />
          <QuoteManager customQuotes={customQuotes} onSaveQuote={handleSaveCustomQuote} />
          <EnhancedSettings onBackgroundChange={handleBackgroundChange} onViewQuotes={() => setViewingQuotes(true)} />
        </div>
      </div>
    </>
  )
}

export default function MotivationalCalendar() {
  return (
    <ThemeProvider>
      <MotivationalCalendarContent />
    </ThemeProvider>
  )
}
