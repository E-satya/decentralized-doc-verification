"use client"

import { Shield, Zap, Lock, BarChart3, Smartphone, Globe } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade encryption and blockchain-backed verification for complete security",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Verify documents in seconds with our advanced AI-powered processing engine",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data never leaves your control. End-to-end encryption on all documents",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track verification history, success rates, and detailed audit logs",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Verify documents on the go with our responsive mobile-first design",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Globe,
      title: "Global Support",
      description: "Support for 50+ document types and compliance with international standards",
      color: "from-teal-500 to-cyan-500",
    },
  ]

  return (
    <section
      id="features"
      className="py-20 md:py-32 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background via-blue-500/5 to-background"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need for secure, reliable document verification at your fingertips
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-6 rounded-xl border border-border/40 bg-gradient-to-br from-background/80 to-background/40 hover:border-border/60 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-2.5 mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="text-white" size={20} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
