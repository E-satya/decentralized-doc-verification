import { Shield, Zap, Lock, FileCheck, Globe, Clock } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Your documents are secured on the blockchain",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant verification through IPFS technology",
    },
    {
      icon: Lock,
      title: "Immutable Storage",
      description: "Documents cannot be altered once verified",
    },
    {
      icon: FileCheck,
      title: "Easy Verification",
      description: "One-click document verification process",
    },
    {
      icon: Globe,
      title: "Decentralized",
      description: "No central authority control your data",
    },
    {
      icon: Clock,
      title: "Timestamped",
      description: "Permanent timestamp of document upload",
    },
  ]

  return (
    <section
      id="features"
      className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background via-blue-50/10 to-background dark:via-blue-950/10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to verify and secure your documents on the blockchain
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-6 rounded-xl border border-border/40 bg-gradient-to-br from-background/50 to-background/30 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-cyan-600 dark:text-cyan-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
