import { Lock, Eye, Cpu, GitBranch } from "lucide-react"

export default function SecuritySection() {
  const securityPoints = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All your documents are encrypted with military-grade encryption standards",
    },
    {
      icon: Eye,
      title: "Complete Transparency",
      description: "Every transaction is recorded and verifiable on the blockchain",
    },
    {
      icon: Cpu,
      title: "Smart Contract Security",
      description: "Audited smart contracts ensuring maximum security and reliability",
    },
    {
      icon: GitBranch,
      title: "Decentralized Infrastructure",
      description: "Built on distributed IPFS network with no single point of failure",
    },
  ]

  return (
    <section
      id="security"
      className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-blue-50/5 dark:to-blue-950/5"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Enterprise-Grade Security</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your data is protected with the most advanced security measures available
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {securityPoints.map((point, index) => {
            const Icon = point.icon
            return (
              <div
                key={index}
                className="group p-8 rounded-xl border border-border/40 bg-gradient-to-br from-background/50 to-background/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-green-600 dark:text-green-400" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
