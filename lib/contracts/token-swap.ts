export const TOKEN_SWAP_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_tokenIn", type: "address" },
      { internalType: "address", name: "_tokenOut", type: "address" },
      { internalType: "uint256", name: "_amountIn", type: "uint256" },
      { internalType: "uint256", name: "_minAmountOut", type: "uint256" },
    ],
    name: "swap",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_tokenIn", type: "address" },
      { internalType: "address", name: "_tokenOut", type: "address" },
      { internalType: "uint256", name: "_amountIn", type: "uint256" },
    ],
    name: "getAmountOut",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_token", type: "address" }],
    name: "getReserve",
    outputs: [{ internalType: "uint256", name: "reserve", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "addLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "removeLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

export const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  chainId?: number
}

// Base catalog (mainnet) plus optional per-chain overrides via env
export const CONTRACTS = {
  TOKEN_SWAP: (process.env.NEXT_PUBLIC_TOKEN_SWAP_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  TOKENS: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
}

// Optional: chain-specific swap address via env NEXT_PUBLIC_TOKEN_SWAP_ADDRESS_<chainId>
export function getSwapAddress(chainId?: number): `0x${string}` {
  const key = chainId ? `NEXT_PUBLIC_TOKEN_SWAP_ADDRESS_${chainId}` : undefined
  const byChain = key ? (process.env[key] as string | undefined) : undefined
  return (byChain || process.env.NEXT_PUBLIC_TOKEN_SWAP_ADDRESS || CONTRACTS.TOKEN_SWAP) as `0x${string}`
}

// Map of known token addresses per chain
const TOKEN_ADDRESSES_BY_CHAIN: Record<number, Record<string, `0x${string}`>> = {
  1: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  84532: {
    WETH: "0x4200000000000000000000000000000000000006",
    USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    STIM: "0x18Dc055ed8D98573D4518EE89EF50d6F4B74B528",
  },
}

function getEnvTokenAddress(symbol: string, chainId: number): `0x${string}` | undefined {
  const byChain = TOKEN_ADDRESSES_BY_CHAIN[chainId]
  if (!byChain) return undefined
  const envAddr = byChain[symbol]
  if (!envAddr) return undefined
  return envAddr
}

function isZeroAddress(addr?: string) {
  return !addr || addr === "0x0000000000000000000000000000000000000000"
}

// Known token catalogs by chain. Start with mainnet; extend as needed or override via env.
const STATIC_TOKEN_CATALOG_BY_CHAIN: Record<number, Token[]> = {
  1: [
    {
      address: CONTRACTS.TOKENS.USDC,
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logoURI: "/usdc-coin.png",
      chainId: 1,
    },
    {
      address: CONTRACTS.TOKENS.USDT,
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      logoURI: "/usdt-coin.jpg",
      chainId: 1,
    },
    {
      address: CONTRACTS.TOKENS.DAI,
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      logoURI: "/dai-coin.jpg",
      chainId: 1,
    },
    {
      address: CONTRACTS.TOKENS.WETH,
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "/eth-coin.jpg",
      chainId: 1,
    },
  ],
  // Base Sepolia (84532): WETH is canonical OP WETH, stables should be provided via env
  84532: [
    {
      address: "0x4200000000000000000000000000000000000006",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "/eth-coin.jpg",
      chainId: 84532,
    },
    {
      address: getEnvTokenAddress("USDC", 84532) as `0x${string}`,
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logoURI: "/usdc-coin.png",
      chainId: 84532,
    },
    {
      address: getEnvTokenAddress("STIM", 84532) as `0x${string}`,
      symbol: "STIM",
      name: "STIM Token",
      decimals: 18,
      logoURI: "/stim-coin.png",
      chainId: 84532,
    },
  ],
}

export function getSupportedTokens(chainId: number): Token[] {
  const baseCatalog = STATIC_TOKEN_CATALOG_BY_CHAIN[chainId || 1] || STATIC_TOKEN_CATALOG_BY_CHAIN[1]
  console.log("baseCatalog", baseCatalog)
  const withEnv = baseCatalog.map((t) => {
    const envAddress = getEnvTokenAddress(t.symbol, chainId)
    console.log("envAddress", envAddress, chainId)
    const addr = (envAddress || t.address) as string
    return { ...t, address: addr, chainId: chainId || t.chainId }
  })

  // Optionally add commonly used stables via env if not in static catalog on the chain
  const maybeAdd = (symbol: string, name: string, decimals: number, logoURI: string) => {
    const envAddress = getEnvTokenAddress(symbol, chainId)
    if (!envAddress || isZeroAddress(envAddress)) return undefined
    const exists = withEnv.some((x) => x.symbol === symbol)
    if (exists) return undefined
    return {
      address: envAddress,
      symbol,
      name,
      decimals,
      logoURI,
      chainId,
    } as Token
  }

  const extras: Token[] = []
  const extraUSDC = maybeAdd("USDC", "USD Coin", 6, "/usdc-coin.png")
  if (extraUSDC) extras.push(extraUSDC)
  const extraUSDT = maybeAdd("USDT", "Tether USD", 6, "/usdt-coin.jpg")
  if (extraUSDT) extras.push(extraUSDT)
  const extraDAI = maybeAdd("DAI", "Dai Stablecoin", 18, "/dai-coin.jpg")
  if (extraDAI) extras.push(extraDAI)

  // Filter out any tokens that have zero/empty addresses for the selected chain
  const finalList = [...withEnv, ...extras].filter((t) => !isZeroAddress(t.address))

  // If after filtering we somehow have no tokens, fall back to mainnet catalog (read-only)
  return finalList.length > 0 ? finalList : STATIC_TOKEN_CATALOG_BY_CHAIN[1]
}
