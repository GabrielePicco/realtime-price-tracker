import PriceTracker from "@/components/price-tracker"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
        <h1 className="text-4xl font-bold mb-8">Realtime Price Tracker</h1>
        <PriceTracker />
      </main>
    </ThemeProvider>
  )
}

