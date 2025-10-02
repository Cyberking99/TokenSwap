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


export const CONTRACTS = {
  TOKEN_SWAP: "0x0000000000000000000000000000000000000000", // Replace with actual address
  TOKENS: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Mainnet USDC
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Mainnet USDT
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // Mainnet DAI
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // Mainnet WETH
  },
}

export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

export const SUPPORTED_TOKENS: Token[] = [
  {
    address: CONTRACTS.TOKENS.USDC,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: "/usdc-coin.png",
  },
  {
    address: CONTRACTS.TOKENS.USDT,
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    logoURI: "/usdt-coin.jpg",
  },
  {
    address: CONTRACTS.TOKENS.DAI,
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    logoURI: "/dai-coin.jpg",
  },
  {
    address: CONTRACTS.TOKENS.WETH,
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    logoURI: "/eth-coin.jpg",
  },
]
