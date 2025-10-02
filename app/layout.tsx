import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/components/providers/web3-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Suspense } from "react"
import { sdk } from '@farcaster/miniapp-sdk'

export const metadata: Metadata = {
  title: "SwapDen - Decentralized Token Exchange",
  description: "Swap tokens instantly with low fees and secure transactions",
  generator: "v0.app",
}

await sdk.actions.ready()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Web3Provider>
            {children}
            <Toaster />
          </Web3Provider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
