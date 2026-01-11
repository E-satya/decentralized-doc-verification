"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onStartClick: () => void
}

export default function HeroSection({ onStartClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-20 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-20 w-96 h-96 bg-gradient-to-tl from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-xl">
            <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
              ✨ Secure & Instant Verification
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 leading-tight">
          <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
            Verify Documents
          </span>
          <br />
          <span className="text-gray-600 dark:text-gray-400">in Seconds</span>
        </h1>

        {/* Description */}
        <p className="text-center text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Advanced document verification with blockchain-backed authenticity checks. Upload, verify, and secure your
          documents with enterprise-grade encryption.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            onClick={onStartClick}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 px-8 group"
          >
            Start Verifying
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Button>
          <Button size="lg" variant="outline" className="px-8 hover:bg-foreground/5 bg-transparent">
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12 border-t border-border/40">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">10M+</div>
            <p className="text-sm text-muted-foreground">Documents Verified</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">99.9%</div>
            <p className="text-sm text-muted-foreground">Accuracy Rate</p>
          </div>
          <div className="text-center col-span-2 md:col-span-1">
            <div className="text-3xl md:text-4xl font-bold mb-2">&lt;2s</div>
            <p className="text-sm text-muted-foreground">Average Time</p>
          </div>
        </div>
      </div>
    </section>
  )
}
