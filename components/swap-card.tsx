"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TokenSelect } from "@/components/token-select"
import { type Token, SUPPORTED_TOKENS } from "@/lib/contracts/token-swap"
import { ArrowDownUp, Settings, Info } from "lucide-react"
import { useAccount } from "wagmi"
import { WalletButton } from "@/components/wallet-button"
import { useToast } from "@/hooks/use-toast"

export function SwapCard() {
  const { isConnected } = useAccount()
  const { toast } = useToast()
  const [tokenIn, setTokenIn] = useState<Token>(SUPPORTED_TOKENS[0])
  const [tokenOut, setTokenOut] = useState<Token>(SUPPORTED_TOKENS[1])
  const [amountIn, setAmountIn] = useState("")
  const [amountOut, setAmountOut] = useState("")
  const [slippage, setSlippage] = useState("0.5")
  const [isLoading, setIsLoading] = useState(false)

  // Simulate price calculation
  useEffect(() => {
    if (amountIn && Number.parseFloat(amountIn) > 0) {
      // Mock exchange rate calculation
      const rate = 0.998 // 0.2% fee
      const output = (Number.parseFloat(amountIn) * rate).toFixed(6)
      setAmountOut(output)
    } else {
      setAmountOut("")
    }
  }, [amountIn, tokenIn, tokenOut])

  const handleSwapTokens = () => {
    const temp = tokenIn
    setTokenIn(tokenOut)
    setTokenOut(temp)
    setAmountIn(amountOut)
    setAmountOut(amountIn)
  }

  const handleSwap = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to swap tokens",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Swap successful!",
        description: `Swapped ${amountIn} ${tokenIn.symbol} for ${amountOut} ${tokenOut.symbol}`,
      })
      setAmountIn("")
      setAmountOut("")
    } catch (error) {
      toast({
        title: "Swap failed",
        description: "An error occurred during the swap",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isValidAmount = amountIn && Number.parseFloat(amountIn) > 0

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
            <span className="text-muted-foreground">Balance: 0.00</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="text-2xl font-semibold h-14"
            />
            <TokenSelect value={tokenIn} onSelect={setTokenIn} />
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
            <span className="text-muted-foreground">Balance: 0.00</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={amountOut}
              readOnly
              className="text-2xl font-semibold h-14 bg-muted"
            />
            <TokenSelect value={tokenOut} onSelect={setTokenOut} />
          </div>
        </div>

        {/* Swap Details */}
        {isValidAmount && (
          <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium">
                1 {tokenIn.symbol} = 0.998 {tokenOut.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Slippage tolerance</span>
              <span className="font-medium">{slippage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Network fee</span>
              <span className="font-medium">~$2.50</span>
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
            disabled={!isValidAmount || isLoading}
          >
            {isLoading ? "Swapping..." : "Swap"}
          </Button>
        )}

        {/* Info */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            Output is estimated. You will receive at least {amountOut || "0.0"} {tokenOut.symbol} or the transaction
            will revert.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
