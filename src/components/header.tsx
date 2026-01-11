"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, Wallet } from "lucide-react"
import { useState, useEffect } from "react"

interface HeaderProps {
  address?: string
  onConnect: () => Promise<void>
  onDisconnect: () => void
  isConnecting?: boolean
}

export default function Header({ address, onConnect, onDisconnect, isConnecting = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/40"
          : "bg-gradient-to-b from-background to-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">DV</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline">DocVerify</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
            Features
          </a>
          <a href="#security" className="text-sm text-muted-foreground hover:text-foreground transition">
            Security
          </a>
        </div>

        <div className="flex items-center gap-3">
          {address ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                {formatAddress(address)}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={onDisconnect}
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut size={16} />
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={onConnect}
              disabled={isConnecting}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white flex items-center gap-2"
            >
              <Wallet size={16} />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3 animate-in fade-in duration-200">
          <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground transition">
            Features
          </a>
          <a href="#security" className="block text-sm text-muted-foreground hover:text-foreground transition">
            Security
          </a>
        </div>
      )}
    </header>
  )
}
