"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Upload, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isPending?: boolean
}

interface ApiResponse {
  text: string
  question: string
  chatId: string
  chatMessageId: string
  isStreamValid: boolean
  sessionId: string
  memoryType: string
}

interface ChatStorage {
  messages: Message[]
  sessionId: string
  chatId: string | null
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string>("")
//   const [fileUploading, setFileUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load chat from localStorage or initialize with welcome message
  useEffect(() => {
    const storedChat = localStorage.getItem("chatStorage")

    if (storedChat) {
      try {
        const parsedStorage: ChatStorage = JSON.parse(storedChat)

        // Convert string dates back to Date objects
        const messagesWithDates = parsedStorage.messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))

        setMessages(messagesWithDates)
        setChatId(parsedStorage.chatId)
        setSessionId(parsedStorage.sessionId)
      } catch (error) {
        console.error("Error parsing stored chat:", error)
        initializeChat()
      }
    } else {
      initializeChat()
    }
  }, [])

  // Initialize new chat with welcome message and session ID
  const initializeChat = () => {
    const welcomeMessage = ` Hello! I'm Ariana, your AI business coach — here to support you in growing your startup with clarity and confidence.
Whether you're working on sales, marketing, finance, or overall strategy, I've got you covered.`

    const newSessionId = generateId()
    setSessionId(newSessionId)

    setMessages([
      {
        id: "welcome",
        content: welcomeMessage,
        role: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  // Generate a unique ID for session
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Save chat to localStorage whenever messages or chatId changes
  useEffect(() => {
    if (messages.length > 0) {
      const chatStorage: ChatStorage = {
        messages,
        sessionId,
        chatId,
      }
      localStorage.setItem("chatStorage", JSON.stringify(chatStorage))
    }
  }, [messages, chatId, sessionId])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  async function query(data: {
    question: string
    chatId?: string
    overrideConfig?: { sessionId: string }
  }) {
    setIsLoading(true)

    try {
      // Add the sessionId to the request
      const requestData = {
        question: data.question,
        chatId: data.chatId,
        overrideConfig: {
          sessionId: sessionId,
        },
      }

      const response = await fetch(
        "https://flowise-pkan.onrender.com/api/v1/prediction/e24e29cd-0bb7-4b2e-ae6e-32dcaf3799f9",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        },
      )

      const result: ApiResponse = await response.json()

      // Save the chatId for future messages
      if (result.chatId) {
        setChatId(result.chatId)
      }

      // Update sessionId if returned from API
      if (result.sessionId) {
        setSessionId(result.sessionId)
      }

      return result
    } catch (error) {
      console.error("Error querying API:", error)
      return {
        text: "Sorry, I encountered an error. Please try again later.",
        question: data.question,
        chatId: data.chatId || "",
        chatMessageId: "",
        isStreamValid: false,
        sessionId: sessionId,
        memoryType: "",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() && !selectedFile) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    // Add file information if a file is selected
    if (selectedFile) {
      userMessage.content += selectedFile ? `\n[Attached file: ${selectedFile.name}]` : ""
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])

    // Add pending message placeholder
    const pendingId = Date.now().toString() + "-pending"
    setMessages((prev) => [
      ...prev,
      {
        id: pendingId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
        isPending: true,
      },
    ])

    // Clear input and file
    setInput("")
    setSelectedFile(null)

    // Send message to API with sessionId
    const result = await query({
      question: userMessage.content,
      chatId: chatId || undefined,
      overrideConfig: {
        sessionId: sessionId,
      },
    })

    // Remove pending message and add actual response
    setMessages((prev) =>
      prev
        .filter((msg) => msg.id !== pendingId)
        .concat({
          id: result.chatMessageId || Date.now().toString(),
          content: result.text,
          role: "assistant",
          timestamp: new Date(),
        }),
    )
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Clear chat history and start a new session
  const clearChat = () => {
    localStorage.removeItem("chatStorage")
    initializeChat()
    setChatId(null)
  }

  return (
    <div className="flex items-center justify-center bg-gradient-to-b">
      <Card className="w-full max-w-8xl h-[82vh] flex flex-col shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
          <CardTitle className="text-lg font-medium">Chat with Ariana</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Clear chat</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear conversation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to clear all messages? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearChat} className="bg-red-500 hover:bg-red-600">
                  Clear
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col space-y-4 justify-between">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex w-full", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div className={cn("flex items-start gap-3 max-w-[80%]")}>
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Ariana" />
                      <AvatarFallback className="bg-purple-700 text-white">AR</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "rounded-lg p-3 text-sm",
                      message.role === "user"
                        ? "bg-black text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none",
                    )}
                  >
                    {message.isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Ariana is typing...</span>
                      </div>
                    ) : (
                      <>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div
                          className={cn("text-xs mt-1", message.role === "user" ? "text-blue-100" : "text-gray-500")}
                        >
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </>
                    )}
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                      <AvatarFallback className="bg-black text-white">YOU</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="border-t p-3">
          <form onSubmit={handleSendMessage} className="flex w-full gap-2 items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />

            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={handleFileUpload}
              className="flex-shrink-0"
              title="Upload file"
            >
              <Upload className="h-5 w-5" />
            </Button>

            <div className="relative flex-grow">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="pr-20"
                disabled={isLoading}
              />
              {selectedFile && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full truncate max-w-[100px]">
                  {selectedFile.name}
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="icon"
              className="flex-shrink-0 bg-black hover:bg-purple-700"
              disabled={isLoading || (!input.trim() && !selectedFile)}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
