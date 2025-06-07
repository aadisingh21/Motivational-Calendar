"use client"

import { useState } from "react"
import { Settings, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/contexts/theme-context"

interface EnhancedSettingsProps {
  onBackgroundChange: (bg: string) => void
  onViewQuotes: () => void
}

export function EnhancedSettings({ onBackgroundChange, onViewQuotes }: EnhancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const backgroundOptions = [
    { key: "default", label: "Default", class: "bg-gradient-to-br from-blue-50 to-blue-200" },
    { key: "gradient", label: "Gradient", class: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" },
    { key: "particles", label: "Particles", class: "bg-gradient-to-br from-slate-900 to-indigo-900" },
    { key: "waves", label: "Waves", class: "bg-gradient-to-br from-blue-900 to-indigo-900" },
    { key: "geometric", label: "Geometric", class: "bg-gradient-to-br from-gray-900 to-gray-800" },
  ]

  const isDark = theme === "dark"

  return (
    <div className="fixed bottom-6 right-6">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        size="sm"
      >
        <Settings className="h-5 w-5" />
      </Button>

      {isOpen && (
        <Card
          className={`absolute bottom-16 right-0 w-80 shadow-xl ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="theme">
              <TabsList className={`grid w-full grid-cols-3 ${isDark ? "bg-gray-700" : ""}`}>
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
              </TabsList>

              <TabsContent value="theme" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sun className={`h-4 w-4 ${isDark ? "text-gray-400" : "text-yellow-500"}`} />
                    <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Light Mode
                    </span>
                  </div>
                  <Switch checked={isDark} onCheckedChange={toggleTheme} />
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Dark Mode
                    </span>
                    <Moon className={`h-4 w-4 ${isDark ? "text-blue-400" : "text-gray-400"}`} />
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                  <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Toggle between light and dark themes. Your preference will be saved automatically.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="backgrounds" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {backgroundOptions.map((option) => (
                    <div
                      key={option.key}
                      className={`
                        h-20 rounded-lg cursor-pointer border-2 border-transparent 
                        hover:border-indigo-500 transition-all duration-200 ${option.class}
                        flex items-center justify-center
                      `}
                      onClick={() => {
                        onBackgroundChange(option.key)
                        setIsOpen(false)
                      }}
                    >
                      <span className="font-medium text-white text-shadow">{option.label}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="quotes" className="space-y-4 pt-4">
                <Button
                  onClick={() => {
                    onViewQuotes()
                    setIsOpen(false)
                  }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  View All Custom Quotes
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
