import Link from "next/link"
import { CheckCircle, MessageSquare, Calendar, History, ThumbsUp, Mic } from "lucide-react"

import { Button } from "@/components/ui/button"
import FeatureCard from "@/components/feature-card"



export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-50 to-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Ariana Coach</h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-8 max-w-3xl mx-auto">
            She can help you with your challenges as a manager.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Link href="/learn-more">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Ariana Helps Business Leaders</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-primary" />}
              title="Voice & Text Interaction"
              description="Communicate with Ariana through voice or text chat, whichever you prefer in the moment."
            />

            <FeatureCard
              icon={<History className="h-10 w-10 text-primary" />}
              title="Conversation Memory"
              description="Ariana remembers your past interactions, creating a continuous coaching relationship."
            />

            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Scheduled Sessions"
              description="Book appointments or start impromptu coaching sessions whenever you need guidance."
            />

            <FeatureCard
              icon={<CheckCircle className="h-10 w-10 text-primary" />}
              title="Personalized Coaching"
              description="Get advice tailored to your specific role and challenges as a business leader."
            />

            <FeatureCard
              icon={<ThumbsUp className="h-10 w-10 text-primary" />}
              title="Continuous Improvement"
              description="Provide feedback to help Ariana better serve your needs over time."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Start Your Coaching Journey?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="text-lg px-8">
              <Link href="/book">Book Appointment</Link>
            </Button>
            <Button size="lg" variant="secondary" className="text-lg px-8">
              <Link href="/session">Start Session</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Mic className="h-6 w-6" />
              <span className="text-xl font-bold">voice</span>
            </div>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left text-slate-400">
            <p>© {new Date().getFullYear()} Ariana Coach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
