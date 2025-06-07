"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"

interface EnhancedCalendarProps {
  onDateClick: (date: Date) => void
  customQuotes: Record<string, string>
}

export function EnhancedCalendar({ onDateClick, customQuotes }: EnhancedCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [animation, setAnimation] = useState<"slideLeft" | "slideRight" | null>(null)
  const { theme } = useTheme()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate()

    const days = []

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
      })
    }

    const today = new Date()
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear(),
        date,
        hasQuote: customQuotes[dateKey] !== undefined,
      })
    }

    const totalDaysShown = firstDay + daysInMonth
    const remainingCells = totalDaysShown <= 35 ? 35 - totalDaysShown : 42 - totalDaysShown

    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, i),
      })
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setAnimation(direction === "prev" ? "slideRight" : "slideLeft")

    setTimeout(() => {
      if (direction === "prev") {
        if (currentMonth === 0) {
          setCurrentMonth(11)
          setCurrentYear(currentYear - 1)
        } else {
          setCurrentMonth(currentMonth - 1)
        }
      } else {
        if (currentMonth === 11) {
          setCurrentMonth(0)
          setCurrentYear(currentYear + 1)
        } else {
          setCurrentMonth(currentMonth + 1)
        }
      }
      setAnimation(null)
    }, 200)
  }

  const days = generateCalendarDays()

  const variants = {
    slideLeft: { x: -20, opacity: 0 },
    slideRight: { x: 20, opacity: 0 },
    center: { x: 0, opacity: 1 },
  }

  const isDark = theme === "dark"

  return (
    <div
      className={`${
        isDark ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-100"
      } backdrop-blur-sm rounded-xl shadow-2xl p-6 border`}
    >
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth("prev")}
          className={`${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-full w-10 h-10 p-0`}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <AnimatePresence mode="wait">
          <motion.h2
            key={`${currentMonth}-${currentYear}`}
            initial={animation ? variants[animation] : {}}
            animate={variants.center}
            exit={animation ? variants[animation] : {}}
            transition={{ duration: 0.2 }}
            className={`text-2xl font-bold bg-gradient-to-r ${
              isDark ? "from-purple-400 to-pink-400" : "from-indigo-600 to-purple-600"
            } bg-clip-text text-transparent`}
          >
            {monthNames[currentMonth]} {currentYear}
          </motion.h2>
        </AnimatePresence>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth("next")}
          className={`${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-full w-10 h-10 p-0`}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-4">
        {weekdays.map((day) => (
          <div key={day} className={`text-center font-medium text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentMonth}-${currentYear}-grid`}
          initial={animation ? variants[animation] : {}}
          animate={variants.center}
          exit={animation ? variants[animation] : {}}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-2"
        >
          {days.map((day, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative h-24 p-2 rounded-lg cursor-pointer transition-all duration-200
                ${
                  day.isCurrentMonth
                    ? day.isToday
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                      : isDark
                        ? "bg-gray-700 hover:bg-gray-600 border border-gray-600"
                        : "bg-white hover:shadow-md border border-gray-100"
                    : isDark
                      ? "bg-gray-800 text-gray-500 hover:bg-gray-700"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }
              `}
              onClick={() => onDateClick(day.date)}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium ${day.isToday ? "text-white" : ""}`}>{day.day}</span>
                {day.hasQuote && (
                  <MessageSquare
                    className={`h-4 w-4 ${day.isToday ? "text-white" : isDark ? "text-purple-400" : "text-indigo-500"}`}
                  />
                )}
              </div>

              {day.isCurrentMonth && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div
                    className={`${
                      isDark ? "bg-black/40" : "bg-black/20"
                    } backdrop-blur-sm rounded-lg p-1 text-xs text-white`}
                  >
                    View Quote
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
