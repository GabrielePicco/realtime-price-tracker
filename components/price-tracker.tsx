"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Connection, PublicKey } from "@solana/web3.js"

const PriceTracker = () => {
  const [price, setPrice] = useState(0)
  const [priceHistory, setPriceHistory] = useState<{ time: number; price: number }[]>([])

  useEffect(() => {
    const connection = new Connection("https://devnet.magicblock.app")
    const accountPubkey = new PublicKey("7AxV2515SwLFVxWSpCngQ3TNqY17JERwcCfULc464u7D")

    const subscriptionId = connection.onAccountChange(
      accountPubkey,
      (accountInfo) => {
          const bytes = accountInfo.data.slice(73, 81);
          const quantizedValueBigInt = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getBigInt64(0, true);
          const newPrice = Number(quantizedValueBigInt) / 100_000_000;
          console.log("New price:", newPrice)
          setPrice(newPrice)
          setPriceHistory((prev) => [...prev.slice(-100), { time: Date.now(), price: newPrice }])
      },
        {commitment: "confirmed"}
    )

    return () => {
      connection.removeAccountChangeListener(subscriptionId)
    }
  }, [])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Current SOL Price: ${price.toFixed(5)}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={priceHistory}>
            <XAxis dataKey="time" tick={false} />
              <YAxis
                  domain={[(dataMin: number) => dataMin * 0.9999, (dataMax: number) => dataMax * 1.0001]}
                  padding={{ top: 1, bottom: 1 }}
                  tickFormatter={(value) => value.toFixed(1)}
              />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default PriceTracker
