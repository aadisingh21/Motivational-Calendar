"use client"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { useTheme } from "@/contexts/theme-context"

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  quote: string
}

export function QuoteModal({ isOpen, onClose, quote }: QuoteModalProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${isDark ? "bg-gray-800 border-gray-700" : ""}`}>
        <DialogHeader>
          <div className="text-center">
            <p className={`text-lg leading-relaxed italic ${isDark ? "text-gray-200" : ""}`}>"{quote}"</p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
