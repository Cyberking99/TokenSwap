"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type Token, SUPPORTED_TOKENS } from "@/lib/contracts/token-swap"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface TokenSelectProps {
  value?: Token
  onSelect: (token: Token) => void
  disabled?: boolean
}

export function TokenSelect({ value, onSelect, disabled }: TokenSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between bg-transparent"
          disabled={disabled}
        >
          {value ? (
            <div className="flex items-center gap-2">
              <Image
                src={value.logoURI || "/placeholder.svg"}
                alt={value.symbol}
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="font-semibold">{value.symbol}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select token</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search token..." />
          <CommandList>
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
              {SUPPORTED_TOKENS.map((token) => (
                <CommandItem
                  key={token.address}
                  value={token.symbol}
                  onSelect={() => {
                    onSelect(token)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", value?.address === token.address ? "opacity-100" : "opacity-0")}
                  />
                  <Image
                    src={token.logoURI || "/placeholder.svg"}
                    alt={token.symbol}
                    width={20}
                    height={20}
                    className="mr-2 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{token.symbol}</span>
                    <span className="text-xs text-muted-foreground">{token.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
