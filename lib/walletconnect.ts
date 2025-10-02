import { createAppKit } from "@reown/appkit/react"
import { base } from "@reown/appkit/networks"
import type { AppKitNetwork } from "@reown/appkit/networks"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id"

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [base]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
})

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: networks,
  projectId,
  features: {
    analytics: true,
  },
  metadata: {
    name: "SwapDen",
    description: "Swap from one token to another easily",
    icons: ["https://myapp.com/icon.png"],
    url: "https://myapp.com",
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "oklch(0.45 0.18 280)",
    "--w3m-border-radius-master": "1rem",
  },
})

export const config = wagmiAdapter.wagmiConfig
