"use client"

import { useEffect, useRef } from "react"

interface RecordingWaveformProps {
  analyser: AnalyserNode | null
  isRecording: boolean
  recordingTime: number
}

export function RecordingWaveform({ analyser, isRecording, recordingTime }: RecordingWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | null>(null)

  // Format time as MM:SS,MS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(2, "0")}`
  }

  useEffect(() => {
    if (!isRecording || !analyser || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = 120 * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = "#1F2937"
      ctx.fillRect(0, 0, 800, 120)

      const centerY = 60
      const barWidth = 3
      const barGap = 1
      const maxBars = Math.floor(800 / (barWidth + barGap))
      const step = Math.floor(bufferLength / maxBars)

      ctx.strokeStyle = "#FF6B35"
      ctx.setLineDash([4, 4])
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      ctx.lineTo(800, centerY)
      ctx.stroke()
      ctx.setLineDash([])

      let x = 0
      for (let i = 0; i < maxBars; i++) {
        const index = i * step
        const value = dataArray[index] || 0
        const barHeight = (value / 255) * 50

        // Red/orange color for bars
        ctx.fillStyle = "#FF5252"
        ctx.shadowBlur = 8
        ctx.shadowColor = "#FF5252"

        // Draw bar above and below center line
        ctx.fillRect(x, centerY - barHeight, barWidth, barHeight)
        ctx.fillRect(x, centerY, barWidth, barHeight)

        x += barWidth + barGap
      }

      ctx.shadowBlur = 0
      animationIdRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [isRecording, analyser])

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <p className="text-3xl font-light text-gray-400">{formatTime(recordingTime)}</p>
      </div>

      <canvas ref={canvasRef} className="w-full h-32 rounded-lg" style={{ imageRendering: "crisp-edges" }} />
    </div>
  )
}
