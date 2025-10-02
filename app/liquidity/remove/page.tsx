"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TokenSelect } from "@/components/token-select"
import { type Token, TOKEN_SWAP_ABI, getSupportedTokens, getSwapAddress } from "@/lib/contracts/token-swap"
import { useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { formatUnits, parseUnits } from "viem"
import { useToast } from "@/hooks/use-toast"
import { WalletButton } from "@/components/wallet-button"

export default function RemoveLiquidityPage() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { toast } = useToast()

  const tokens = useMemo(() => getSupportedTokens(chainId), [chainId])
  const [token, setToken] = useState<Token | undefined>(tokens[0])
  const [amount, setAmount] = useState("")

  useEffect(() => {
    setToken(tokens[0])
  }, [tokens])

  const parsedAmount = useMemo(() => {
    try {
      if (!amount || !token) return 0n
      return parseUnits(amount, token.decimals)
    } catch {
      return 0n
    }
  }, [amount, token?.decimals])

  const swapAddress = getSwapAddress(chainId)

  const { data: reserve, refetch: refetchReserve } = useReadContract({
    abi: TOKEN_SWAP_ABI,
    address: swapAddress,
    functionName: "getReserve",
    args: [(token?.address as `0x${string}`) || "0x0000000000000000000000000000000000000000"],
    query: { enabled: Boolean(token?.address) },
  })

  const { writeContractAsync, data: txHash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash })

  const onRemove = async () => {
    if (!isConnected || !token) {
      toast({ title: "Wallet not connected", description: "Connect your wallet to proceed", variant: "destructive" })
      return
    }
    if (parsedAmount <= 0n) return

    try {
      await writeContractAsync({
        abi: TOKEN_SWAP_ABI,
        address: swapAddress,
        functionName: "removeLiquidity",
        args: [token.address as `0x${string}`, parsedAmount],
      })

      toast({ title: "Transaction submitted", description: "Waiting for confirmation..." })
    } catch (error: any) {
      toast({
        title: "Remove liquidity failed",
        description: error?.shortMessage || error?.message || "An error occurred",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      toast({ title: "Liquidity removed" })
      setAmount("")
      refetchReserve()
    }
  }, [isConfirmed])

  const isValid = !!token && amount && Number(amount) > 0

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
    <div className="mx-auto max-w-xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Remove Liquidity</CardTitle>
          <CardDescription>Withdraw tokens from the pool</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Token</span>
            </div>
            <div className="flex gap-2">
              <TokenSelect value={token} onSelect={(t) => setToken(t)} tokens={tokens} />
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-xl"
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current reserve</span>
              <span className="font-medium">
                {reserve && token ? formatUnits(reserve as bigint, token.decimals) : "0"} {token?.symbol || ""}
              </span>
            </div>
          </div>

          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={onRemove}
            disabled={!isValid || isPending || isConfirming || parsedAmount <= 0n}
          >
            {isPending || isConfirming ? "Removing..." : "Remove Liquidity"}
          </Button>
        </CardContent>
      </Card>
    </div>
      </div>
  )
} 