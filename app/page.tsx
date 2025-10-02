import { SwapCard } from "@/components/swap-card"
import { WalletButton } from "@/components/wallet-button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <h1 className="text-xl font-bold">SwapDen</h1>
          </div>
          <WalletButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="text-center space-y-4 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Swap tokens with ease</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Trade your favorite tokens instantly with low fees and secure transactions powered by smart contracts
            </p>
          </div>

          <SwapCard />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-8">
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="font-semibold text-lg mb-2">Low Fees</h3>
              <p className="text-sm text-muted-foreground">Enjoy competitive rates with minimal transaction fees</p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="font-semibold text-lg mb-2">Secure</h3>
              <p className="text-sm text-muted-foreground">Your funds are protected by audited smart contracts</p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="font-semibold text-lg mb-2">Fast</h3>
              <p className="text-sm text-muted-foreground">Execute swaps in seconds with instant confirmations</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
