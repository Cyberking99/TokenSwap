"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TokenSelect } from "@/components/token-select"
import { type Token, TOKEN_SWAP_ABI, ERC20_ABI, getSupportedTokens, getSwapAddress } from "@/lib/contracts/token-swap"
import { ArrowDownUp, Settings, Info } from "lucide-react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance, useChainId } from "wagmi"
import { WalletButton } from "@/components/wallet-button"
import { useToast } from "@/hooks/use-toast"
import { formatUnits, parseUnits } from "viem"

export function SwapCard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { toast } = useToast()

  const tokens = useMemo(() => getSupportedTokens(chainId), [chainId])

  const [tokenIn, setTokenIn] = useState<Token | undefined>(tokens[0])
  const [tokenOut, setTokenOut] = useState<Token | undefined>(tokens[1])
  const [amountIn, setAmountIn] = useState("")
  const [amountOut, setAmountOut] = useState("")
  const [slippage, setSlippage] = useState("0.5")

  useEffect(() => {
    setTokenIn(tokens[0])
    setTokenOut(tokens[1])
  }, [tokens])

  const parsedAmountIn = useMemo(() => {
    try {
      if (!amountIn || !tokenIn) return 0n
      return parseUnits(amountIn, tokenIn.decimals)
    } catch {
      return 0n
    }
  }, [amountIn, tokenIn?.decimals])

  const minAmountOut = useMemo(() => {
    try {
      if (!amountOut || !tokenOut) return 0n
      const out = parseUnits(amountOut, tokenOut.decimals)
      const slipBps = BigInt(Math.floor(Number(slippage) * 100))
      return out - (out * slipBps) / 10_000n
    } catch {
      return 0n
    }
  }, [amountOut, tokenOut?.decimals, slippage])

  const { data: balanceIn } = useBalance({
    address,
    token: tokenIn?.address as `0x${string}` | undefined,
    query: { enabled: Boolean(address && tokenIn?.address) },
  })

  const { data: balanceOut } = useBalance({
    address,
    token: tokenOut?.address as `0x${string}` | undefined,
    query: { enabled: Boolean(address && tokenOut?.address) },
  })

  const swapAddress = getSwapAddress(chainId)

  const { data: quotedOut, refetch: refetchQuote, isFetching: isQuoting } = useReadContract({
    abi: TOKEN_SWAP_ABI,
    address: swapAddress,
    functionName: "getAmountOut",
    args: [
      (tokenIn?.address as `0x${string}`) || "0x0000000000000000000000000000000000000000",
      (tokenOut?.address as `0x${string}`) || "0x0000000000000000000000000000000000000000",
      parsedAmountIn,
    ],
    query: {
      enabled: Boolean(parsedAmountIn > 0n && tokenIn && tokenOut && tokenIn.address !== tokenOut.address),
    },
  })

  useEffect(() => {
    if (quotedOut && parsedAmountIn > 0n && tokenOut) {
      setAmountOut(formatUnits(quotedOut as bigint, tokenOut.decimals))
    } else {
      setAmountOut("")
    }
  }, [quotedOut, parsedAmountIn, tokenOut?.decimals])

  const { writeContractAsync, data: txHash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const handleSwapTokens = () => {
    const temp = tokenIn
    setTokenIn(tokenOut)
    setTokenOut(temp)
    setAmountIn(amountOut)
    setAmountOut(amountIn)
  }

  const handleSwap = async () => {
    if (!isConnected || !address || !tokenIn || !tokenOut) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to swap tokens",
        variant: "destructive",
      })
      return
    }

    if (parsedAmountIn <= 0n) return

    try {
      await writeContractAsync({
        abi: ERC20_ABI,
        address: tokenIn.address as `0x${string}`,
        functionName: "approve",
        args: [swapAddress, parsedAmountIn],
      })

      await writeContractAsync({
        abi: TOKEN_SWAP_ABI,
        address: swapAddress,
        functionName: "swap",
        args: [
          tokenIn.address as `0x${string}`,
          tokenOut.address as `0x${string}`,
          parsedAmountIn,
          minAmountOut,
        ],
      })

      toast({
        title: "Swap submitted",
        description: `Waiting for confirmation...`,
      })
    } catch (error: any) {
      toast({
        title: "Swap failed",
        description: error?.shortMessage || error?.message || "An error occurred during the swap",
        variant: "destructive",
      })
      return
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Swap successful!",
        description: `Swapped ${amountIn} ${tokenIn?.symbol} for ~${amountOut} ${tokenOut?.symbol}`,
      })
      setAmountIn("")
      setAmountOut("")
      refetchQuote()
    }
  }, [isConfirmed])

  const isValidAmount = amountIn && Number.parseFloat(amountIn) > 0 && tokenIn && tokenOut

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Swap</CardTitle>
            <CardDescription>Trade tokens instantly</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token In */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">You pay</span>
            <span className="text-muted-foreground">
              Balance: {balanceIn && tokenIn ? formatUnits(balanceIn.value, tokenIn.decimals) : "0.00"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="text-2xl font-semibold h-14"
            />
            <TokenSelect value={tokenIn} onSelect={(t) => setTokenIn(t)} tokens={tokens} />
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <Button variant="outline" size="icon" onClick={handleSwapTokens} className="rounded-full bg-transparent">
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* Token Out */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">You receive</span>
            <span className="text-muted-foreground">
              Balance: {balanceOut && tokenOut ? formatUnits(balanceOut.value, tokenOut.decimals) : "0.00"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={amountOut}
              readOnly
              className="text-2xl font-semibold h-14 bg-muted"
            />
            <TokenSelect value={tokenOut} onSelect={(t) => setTokenOut(t)} tokens={tokens} />
          </div>
        </div>

        {/* Swap Details */}
        {isValidAmount && tokenIn && tokenOut && (
          <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium">
                {isQuoting
                  ? "…"
                  : `1 ${tokenIn.symbol} = ${amountOut && amountIn ? (Number(amountOut) / Number(amountIn)).toFixed(6) : "-"} ${tokenOut.symbol}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Slippage tolerance</span>
              <span className="font-medium">{slippage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Network fee</span>
              <span className="font-medium">Estimated at confirm</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isConnected ? (
          <WalletButton />
        ) : (
          <Button
            className="w-full h-14 text-lg font-semibold"
            onClick={handleSwap}
            disabled={!isValidAmount || isPending || isConfirming || parsedAmountIn <= 0n}
          >
            {isPending || isConfirming ? "Swapping..." : "Swap"}
          </Button>
        )}

        {/* Info */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            Output is estimated. You will receive at least {amountOut || "0.0"} {tokenOut?.symbol || ""} or the transaction
            will revert.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

