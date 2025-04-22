"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, AudioWaveformIcon as Waveform } from "lucide-react"
import { cn } from "@/lib/utils"

const DashboardHome = () => {
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "active" | "ended">("idle")
  const [isMuted, setIsMuted] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [activeTab, setActiveTab] = useState("voice")
  const [transcript, setTranscript] = useState<Array<{ role: "user" | "ai"; text: string }>>([])
  const audioVisualizerRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const transcriptContainerRef = useRef<HTMLDivElement>(null)
  const [isLowPerfDevice, setIsLowPerfDevice] = useState(false)

  // Simulate call connection
  const startCall = () => {
    setCallStatus("connecting")
    setCallDuration(0)

    // Simulate connection delay
    setTimeout(() => {
      setCallStatus("active")
      setTranscript((prev) => [
        ...prev,
        { role: "ai", text: "Hello! I'm your AI voice assistant. How can I help you today?" },
      ])

      // Start call timer
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }, 2000)
  }

  const endCall = () => {
    setCallStatus("ended")
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setTimeout(() => {
      setCallStatus("idle")
    }, 3000)
  }

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Simulate user speaking
  const simulateUserSpeaking = () => {
    if (callStatus === "active") {
      setTranscript((prev) => [...prev, { role: "user", text: "Can you help me with my account settings?" }])

      // Simulate AI response after a short delay
      setTimeout(() => {
        setTranscript((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Of course! I'd be happy to help with your account settings. What specific settings would you like to adjust?",
          },
        ])
      }, 2000)
    }
  }

  // Audio visualizer animation
  useEffect(() => {
    if (!audioVisualizerRef.current) return

    const canvas = audioVisualizerRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set initial canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = 80

    let animationFrameId: number

    const draw = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set wave properties
      const barCount = isLowPerfDevice ? 15 : 30
      const barWidth = canvas.width / barCount
      const barGap = 2

      // Draw audio visualization bars
      for (let i = 0; i < barCount; i++) {
        // Generate random height for the visualization effect
        const height = callStatus === "active" ? Math.random() * (canvas.height * 0.8) + canvas.height * 0.2 : 2 // Small line when inactive

        ctx.fillStyle = "#3b82f6"
        ctx.fillRect(i * (barWidth + barGap), canvas.height - height, barWidth, height)
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    try {
      draw()
    } catch (error) {
      console.error("Error in audio visualization:", error)
      // Fallback to a simple visualization or disable it
     
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [callStatus, isLowPerfDevice])

  // Responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (audioVisualizerRef.current) {
        audioVisualizerRef.current.width = audioVisualizerRef.current.offsetWidth
        audioVisualizerRef.current.height = 80
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  // Add this effect to auto-scroll transcript
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight
    }
  }, [transcript])

  // Add this effect to detect low performance devices
  useEffect(() => {
    // Simple heuristic - mobile devices or older browsers might struggle with animations
    const isLowPerf = window.navigator.userAgent.includes("Mobile") || !window.requestAnimationFrame
    setIsLowPerfDevice(isLowPerf)
  }, [])

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">AI Voice Assistant(Under Development)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Voice Call</CardTitle>
              {callStatus === "active" && (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Live Call • {formatTime(callDuration)}
                </Badge>
              )}
              {callStatus === "connecting" && (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                >
                  Connecting...
                </Badge>
              )}
              {callStatus === "ended" && (
                <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Call Ended
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <Avatar className="h-24 w-24 border-4 border-primary/10">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="AI Assistant" />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">AI</AvatarFallback>
              </Avatar>

              <div className="text-center">
                <h2 className="text-xl font-semibold">Ariana Voice Assistant</h2>
                <p className="text-muted-foreground">Powered by GPT-4o</p>
              </div>

              <div className="w-full">
                <canvas
                  ref={audioVisualizerRef}
                  className={cn(
                    "w-full rounded-lg transition-opacity duration-300",
                    callStatus !== "active" ? "opacity-30" : "opacity-100",
                  )}
                  height={80}
                ></canvas>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full h-12 w-12",
                isMuted ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400" : "",
              )}
              onClick={() => setIsMuted(!isMuted)}
              disabled={callStatus !== "active"}
              aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </Button>

            <Button
              variant={callStatus === "idle" || callStatus === "ended" ? "default" : "destructive"}
              size="icon"
              className="rounded-full h-16 w-16"
              onClick={callStatus === "idle" || callStatus === "ended" ? startCall : endCall}
              aria-label={callStatus === "idle" || callStatus === "ended" ? "Start call" : "End call"}
            >
              {callStatus === "idle" || callStatus === "ended" ? <Phone /> : <PhoneOff />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full h-12 w-12",
                !isAudioEnabled ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400" : "",
              )}
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              disabled={callStatus !== "active"}
              aria-label={isAudioEnabled ? "Disable audio" : "Enable audio"}
            >
              {isAudioEnabled ? <Volume2 /> : <VolumeX />}
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Call Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="voice" className="flex-1">
                  Voice
                </TabsTrigger>
                <TabsTrigger value="transcript" className="flex-1">
                  Transcript
                </TabsTrigger>
              </TabsList>

              <TabsContent value="voice" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Voice Settings</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Voice Model</div>
                    <div>GPT-4o</div>
                    <div className="text-muted-foreground">Voice Type</div>
                    <div>Natural</div>
                    <div className="text-muted-foreground">Language</div>
                    <div>English (US)</div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={simulateUserSpeaking}
                    disabled={callStatus !== "active"}
                  >
                    <Waveform className="mr-2 h-4 w-4" />
                    Simulate User Question
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="transcript" className="mt-4">
                <div ref={transcriptContainerRef} className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {transcript.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Transcript will appear here during the call
                    </p>
                  ) : (
                    transcript.map((entry, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg",
                          entry.role === "ai" ? "bg-primary/10 ml-4" : "bg-secondary mr-4",
                        )}
                      >
                        <p className="text-xs font-medium mb-1">{entry.role === "ai" ? "AI Assistant" : "You"}</p>
                        <p className="text-sm">{entry.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      
    </div>
  )
}

export default DashboardHome
