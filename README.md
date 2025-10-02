# TokenSwap - Decentralized Token Exchange

A modern, secure decentralized token swap application built with Next.js, WalletConnect, and Solidity smart contracts. Trade ERC-20 tokens instantly with low fees and a beautiful user interface.

![TokenSwap Interface](https://via.placeholder.com/1200x600/1a1a2e/ffffff?text=TokenSwap+DeFi+Platform)

## Features

- **Multi-Wallet Support** - Connect with MetaMask, WalletConnect, Coinbase Wallet, and more
- **AMM-Style Swaps** - Automated Market Maker using constant product formula (x * y = k)
- **Low Fees** - Only 0.3% swap fee
- **Slippage Protection** - Configurable slippage tolerance to protect against price movements
- **Real-Time Calculations** - Instant swap rate and fee calculations
- **Multi-Chain Support** - Works on Ethereum, Arbitrum, Polygon, Base, and Optimism
- **Responsive Design** - Beautiful UI that works on desktop and mobile
- **Secure** - Built with OpenZeppelin contracts and ReentrancyGuard protection

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Modern styling with design tokens
- **Reown AppKit** (WalletConnect v3) - Multi-wallet connection
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **shadcn/ui** - High-quality UI components

### Smart Contracts
- **Solidity 0.8.20** - Smart contract language
- **OpenZeppelin** - Secure, audited contract libraries
- **Hardhat** - Ethereum development environment

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A WalletConnect Project ID (free from [cloud.reown.com](https://cloud.reown.com))
- MetaMask or another Web3 wallet

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd token-swap
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   \`\`\`

   Get your WalletConnect Project ID:
   - Go to [cloud.reown.com](https://cloud.reown.com)
   - Create a free account
   - Create a new project
   - Copy your Project ID

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Smart Contract Deployment

### Setup Hardhat

1. **Install Hardhat and dependencies**
   \`\`\`bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   npx hardhat init
   \`\`\`

2. **Configure Hardhat**
   
   Update `hardhat.config.js`:
   \`\`\`javascript
   require("@nomicfoundation/hardhat-toolbox");
   
   module.exports = {
     solidity: "0.8.20",
     networks: {
       sepolia: {
         url: process.env.SEPOLIA_RPC_URL || "",
         accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
       },
       mainnet: {
         url: process.env.MAINNET_RPC_URL || "",
         accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
       },
     },
   };
   \`\`\`

3. **Deploy the contract**
   \`\`\`bash
   npx hardhat run scripts/deploy.js --network sepolia
   \`\`\`

4. **Update contract addresses**
   
   After deployment, update the contract addresses in:
   - `lib/contracts/token-swap.ts` - Update `TOKEN_SWAP_ADDRESS`
   - Add your token addresses to the `SUPPORTED_TOKENS` array

### Adding Liquidity

The contract owner needs to add liquidity before users can swap:

\`\`\`javascript
// Using ethers.js
const tokenSwap = await ethers.getContractAt("TokenSwap", contractAddress);
await tokenSwap.addLiquidity(tokenAddress, amount);
\`\`\`

## Project Structure

\`\`\`
token-swap/
├── app/
│   ├── layout.tsx          # Root layout with Web3 provider
│   ├── page.tsx            # Main swap interface
│   └── globals.css         # Global styles and design tokens
├── components/
│   ├── providers/
│   │   └── web3-provider.tsx    # WalletConnect provider
│   ├── swap-card.tsx            # Main swap interface component
│   ├── token-select.tsx         # Token selection dropdown
│   └── wallet-button.tsx        # Wallet connection button
├── lib/
│   ├── contracts/
│   │   └── token-swap.ts        # Contract ABIs and addresses
│   ├── hooks/
│   │   └── use-token-swap.ts    # Custom hook for swap logic
│   └── walletconnect.ts         # WalletConnect configuration
├── contracts/
│   └── TokenSwap.sol            # Solidity smart contract
└── public/                      # Static assets
\`\`\`

## Usage

### Connecting Your Wallet

1. Click the "Connect Wallet" button in the top right
2. Select your preferred wallet (MetaMask, WalletConnect, etc.)
3. Approve the connection in your wallet

### Swapping Tokens

1. Select the token you want to swap from the "From" dropdown
2. Enter the amount you want to swap
3. Select the token you want to receive in the "To" dropdown
4. Review the swap details (rate, fees, slippage)
5. Click "Swap" and confirm the transaction in your wallet

### Adjusting Slippage

- Click the settings icon (⚙️) in the swap card
- Adjust the slippage tolerance (default: 0.5%)
- Higher slippage allows for more price movement but may result in worse rates

## Smart Contract Details

### TokenSwap.sol

The main swap contract implements an Automated Market Maker (AMM) using the constant product formula:

**Formula:** `x * y = k`

Where:
- `x` = Reserve of token A
- `y` = Reserve of token B
- `k` = Constant product

**Key Functions:**
- `swap()` - Execute a token swap with slippage protection
- `getAmountOut()` - Calculate output amount for a given input
- `addLiquidity()` - Add tokens to the liquidity pool (owner only)
- `removeLiquidity()` - Remove tokens from the pool (owner only)

**Security Features:**
- ReentrancyGuard protection
- SafeERC20 for secure token transfers
- Slippage protection
- Owner-only liquidity management
- Emergency withdraw function

## Configuration

### Supported Networks

By default, the app supports:
- Ethereum Mainnet
- Arbitrum
- Polygon
- Base
- Optimism

To add more networks, edit `lib/walletconnect.ts`:

\`\`\`typescript
import { yourNetwork } from "@reown/appkit/networks"

export const networks = [mainnet, arbitrum, polygon, base, optimism, yourNetwork]
\`\`\`

### Supported Tokens

To add more tokens, edit `lib/contracts/token-swap.ts`:

\`\`\`typescript
export const SUPPORTED_TOKENS = [
  {
    address: "0x...",
    symbol: "TOKEN",
    name: "Token Name",
    decimals: 18,
    logoURI: "/tokens/token.png",
  },
  // Add more tokens...
]
\`\`\`

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - Deploy

### Deploy Smart Contract

See the [Smart Contract Deployment](#smart-contract-deployment) section above.

## Security Considerations

- Always audit smart contracts before deploying to mainnet
- Test thoroughly on testnets (Sepolia, Goerli)
- Use a hardware wallet for contract ownership
- Set appropriate slippage tolerance
- Verify contract source code on Etherscan
- Consider getting a professional audit for production use

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## Acknowledgments

- [Reown (WalletConnect)](https://reown.com) - Multi-wallet connection
- [OpenZeppelin](https://openzeppelin.com) - Secure smart contract libraries
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Vercel](https://vercel.com) - Hosting and deployment

---

Built with ❤️ using Next.js and Solidity
