"use client"

import { useEffect, useRef } from "react"

export function AnalogClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const updateClock = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const now = new Date()
      const radius = canvas.width / 2

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.beginPath()
      ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI)
      ctx.fillStyle = "white"
      ctx.fill()
      ctx.strokeStyle = "#333"
      ctx.lineWidth = 8
      ctx.stroke()

      ctx.font = radius * 0.15 + "px Arial"
      ctx.textBaseline = "middle"
      ctx.textAlign = "center"
      for (let i = 1; i <= 12; i++) {
        const angle = (i * Math.PI) / 6
        ctx.fillStyle = "#333"
        ctx.fillText(i.toString(), radius + Math.sin(angle) * (radius * 0.7), radius - Math.cos(angle) * (radius * 0.7))
      }

      const hour = now.getHours() % 12
      const hourAngle = ((hour * 30 + now.getMinutes() * 0.5) * Math.PI) / 180
      drawHand(ctx, radius, hourAngle, radius * 0.5, 6, "#333")

      const minuteAngle = (now.getMinutes() * 6 * Math.PI) / 180
      drawHand(ctx, radius, minuteAngle, radius * 0.8, 4, "#333")

      const secondAngle = (now.getSeconds() * 6 * Math.PI) / 180
      drawHand(ctx, radius, secondAngle, radius * 0.9, 2, "#f44336")

      ctx.beginPath()
      ctx.arc(radius, radius, 5, 0, 2 * Math.PI)
      ctx.fillStyle = "#333"
      ctx.fill()
    }

    const drawHand = (
      ctx: CanvasRenderingContext2D,
      radius: number,
      angle: number,
      length: number,
      width: number,
      color: string,
    ) => {
      ctx.beginPath()
      ctx.lineWidth = width
      ctx.lineCap = "round"
      ctx.strokeStyle = color
      ctx.moveTo(radius, radius)
      ctx.lineTo(radius + Math.sin(angle) * length, radius - Math.cos(angle) * length)
      ctx.stroke()
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)

    return () => clearInterval(timer)
  }, [])

  return <canvas ref={canvasRef} width="200" height="200" className="border-2 border-gray-300 rounded-full" />
}
