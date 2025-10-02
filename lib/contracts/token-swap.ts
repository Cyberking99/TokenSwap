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

export const CONTRACTS = {
  TOKEN_SWAP: (process.env.NEXT_PUBLIC_TOKEN_SWAP_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  TOKENS: {
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    STIM: "0x035d2026d6ab320150F9B0456D426D5CDdF8423F",
    WETH: "0x4200000000000000000000000000000000000006",
  },
}

export function getSwapAddress(chainId?: number): `0x${string}` {
  const key = chainId ? `NEXT_PUBLIC_TOKEN_SWAP_ADDRESS_${chainId}` : undefined
  const byChain = key ? (process.env[key] as string | undefined) : undefined
  return (byChain || process.env.NEXT_PUBLIC_TOKEN_SWAP_ADDRESS || CONTRACTS.TOKEN_SWAP) as `0x${string}`
}

const TOKEN_ADDRESSES_BY_CHAIN: Record<number, Record<string, `0x${string}`>> = {
  8453: {
    STIM: "0x035d2026d6ab320150F9B0456D426D5CDdF8423F",
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    WETH: "0x4200000000000000000000000000000000000006",
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

const STATIC_TOKEN_CATALOG_BY_CHAIN: Record<number, Token[]> = {
  8453: [
    {
      address: getEnvTokenAddress("USDC", 8453) as `0x${string}`,
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logoURI: "/USDC.svg",
      chainId: 8453,
    },
    {
      address: getEnvTokenAddress("STIM", 8453) as `0x${string}`,
      symbol: "STIM",
      name: "STIM Token",
      decimals: 18,
      logoURI: "/stim-coin.png",
      chainId: 8453,
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
  const extraUSDC = maybeAdd("USDC", "USD Coin", 6, "/USDC.svg")
  if (extraUSDC) extras.push(extraUSDC)
  const extraUSDT = maybeAdd("USDT", "Tether USD", 6, "/usdt-coin.jpg")
  if (extraUSDT) extras.push(extraUSDT)
  const extraDAI = maybeAdd("DAI", "Dai Stablecoin", 18, "/dai-coin.jpg")
  if (extraDAI) extras.push(extraDAI)

  const finalList = [...withEnv, ...extras].filter((t) => !isZeroAddress(t.address))

  return finalList.length > 0 ? finalList : STATIC_TOKEN_CATALOG_BY_CHAIN[1]
}
