"use client"

import { CheckCircle2, Clock, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Document {
  hash: string
  verified: boolean
  base64?: string
}

interface DocumentsListProps {
  documents: Document[]
  onVerify: (hash: string) => Promise<void>
  isVerifying: boolean
}

export default function DocumentsList({ documents, onVerify, isVerifying }: DocumentsListProps) {
  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash)
  }

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Uploaded Documents</h2>
        <p className="text-muted-foreground mb-8">Your verified documents stored on the blockchain</p>

        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.hash}
              className="group p-6 rounded-xl border border-border/40 bg-gradient-to-r from-background/50 to-background/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    {doc.verified ? (
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <CheckCircle2 className="text-green-600" size={20} />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Clock className="text-blue-600" size={20} />
                      </div>
                    )}
                    <div>
                      <span
                        className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${
                          doc.verified
                            ? "bg-green-500/20 text-green-700 dark:text-green-400"
                            : "bg-blue-500/20 text-blue-700 dark:text-blue-400"
                        }`}
                      >
                        {doc.verified ? "✓ Verified" : "Pending Verification"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">IPFS Hash:</p>
                    <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3 font-mono text-sm break-all">
                      <span className="text-foreground/70">{doc.hash}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(doc.hash)}
                        className="ml-auto flex-shrink-0"
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                {!doc.verified && (
                  <Button
                    onClick={() => onVerify(doc.hash)}
                    disabled={isVerifying}
                    className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? "Verifying..." : "Verify"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
