"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"

interface QuoteManagerProps {
  customQuotes: Record<string, string>
  onSaveQuote: (date: string, quote: string) => void
}

export function QuoteManager({ customQuotes, onSaveQuote }: QuoteManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [quote, setQuote] = useState("")
  const [managingQuotes, setManagingQuotes] = useState(false)
  const [quotesList, setQuotesList] = useState<Array<{ date: string; quote: string }>>([])
  const { theme } = useTheme()

  useEffect(() => {
    // Convert customQuotes object to array for display
    const quotesArray = Object.entries(customQuotes).map(([date, quote]) => ({
      date,
      quote,
    }))
    setQuotesList(quotesArray)
  }, [customQuotes])

  const handleSaveQuote = () => {
    if (!date || !quote.trim()) {
      alert("Please select a date and enter a quote")
      return
    }

    const dateString = format(date, "yyyy-MM-dd")
    onSaveQuote(dateString, quote.trim())
    setQuote("")
    setIsOpen(false)
  }

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number)
    return format(new Date(year, month - 1, day), "MMMM d, yyyy")
  }

  const isDark = theme === "dark"

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        size="sm"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`sm:max-w-[500px] ${isDark ? "bg-gray-800 border-gray-700" : ""}`}>
          <DialogHeader>
            <DialogTitle className={`text-xl font-bold ${isDark ? "text-white" : ""}`}>
              Add Inspirational Quote
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="date" className={`text-sm font-medium ${isDark ? "text-gray-300" : ""}`}>
                Select Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      isDark && "bg-gray-700 border-gray-600 hover:bg-gray-600",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={`w-auto p-0 ${isDark ? "bg-gray-800 border-gray-700" : ""}`}>
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <label htmlFor="quote" className={`text-sm font-medium ${isDark ? "text-gray-300" : ""}`}>
                Your Inspirational Quote
              </label>
              <Textarea
                id="quote"
                placeholder="Enter your quote here..."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={4}
                className={`resize-none ${
                  isDark ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : ""
                }`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveQuote}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              Save Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={managingQuotes} onOpenChange={setManagingQuotes}>
        <DialogContent
          className={`sm:max-w-[600px] max-h-[80vh] overflow-y-auto ${isDark ? "bg-gray-800 border-gray-700" : ""}`}
        >
          <DialogHeader>
            <DialogTitle className={`text-xl font-bold ${isDark ? "text-white" : ""}`}>Manage Your Quotes</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {quotesList.length > 0 ? (
              quotesList.map((item, index) => (
                <Card key={index} className={`${isDark ? "bg-gray-700 border-gray-600" : "border-gray-200"}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {formatDisplayDate(item.date)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className={`text-sm ${isDark ? "text-gray-300" : ""}`}>{item.quote}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                No custom quotes added yet
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
