"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SettingsPanelProps {
  onBackgroundChange: (bg: string) => void
  onSaveCustomQuote: (date: string, quote: string) => void
}

export function SettingsPanel({ onBackgroundChange, onSaveCustomQuote }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [adminDate, setAdminDate] = useState("")
  const [adminQuote, setAdminQuote] = useState("")

  const backgroundOptions = [
    { key: "default", label: "Default", class: "bg-gradient-to-br from-blue-50 to-blue-200" },
    { key: "nature", label: "Nature", class: "bg-green-600" },
    { key: "abstract", label: "Abstract", class: "bg-purple-600" },
    { key: "solid-blue", label: "Blue", class: "bg-blue-600" },
  ]

  const handleSaveQuote = () => {
    if (!adminDate || !adminQuote.trim()) {
      alert("Please select a date and enter a quote")
      return
    }

    onSaveCustomQuote(adminDate, adminQuote.trim())
    setAdminDate("")
    setAdminQuote("")
    alert("Quote saved successfully!")
  }

  return (
    <div className="fixed bottom-6 right-6">
      <Button onClick={() => setIsOpen(!isOpen)} className="w-12 h-12 rounded-full shadow-lg" size="sm">
        <Settings className="h-5 w-5" />
      </Button>

      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Background Options</h3>
              <div className="grid grid-cols-2 gap-2">
                {backgroundOptions.map((option) => (
                  <div
                    key={option.key}
                    className={`h-16 rounded cursor-pointer border-2 border-transparent hover:border-blue-500 ${option.class}`}
                    onClick={() => onBackgroundChange(option.key)}
                    title={option.label}
                  />
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Admin Controls</h3>
              <div className="space-y-3">
                <Input type="date" value={adminDate} onChange={(e) => setAdminDate(e.target.value)} />
                <Textarea
                  placeholder="Enter custom quote"
                  value={adminQuote}
                  onChange={(e) => setAdminQuote(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleSaveQuote} className="w-full">
                  Save Quote
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
