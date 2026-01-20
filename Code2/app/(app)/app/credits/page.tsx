"use client"

import { useState, useEffect } from "react"
import { Coins, Plus, TrendingUp, TrendingDown, RefreshCcw, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { creditsApi } from "@/lib/api"
import type { CreditTransaction } from "@/lib/types"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const creditPackages = [
  { amount: 100, price: "$9.99", popular: false },
  { amount: 500, price: "$39.99", popular: true },
  { amount: 2000, price: "$129.99", popular: false },
]

export default function CreditsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    const data = await creditsApi.getTransactions()
    setTransactions(data)
  }

  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter === "all") return true
    return t.type === typeFilter
  })

  const handlePurchase = async (amount: number, price: string) => {
    setLoading(true)
    try {
      await creditsApi.purchase(amount)
      toast({
        title: "Purchase successful",
        description: `${amount} credits added to your account`,
      })
      setPurchaseModalOpen(false)
      loadTransactions()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Purchase failed",
        description: "Please try again",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earn":
      case "purchase":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "spend":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "refund":
        return <RefreshCcw className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  return (
    <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credits</h1>
          <p className="text-muted-foreground mt-1">Manage your credits and view transaction history</p>
        </div>
      </div>

      {/* Warning Banner */}
      {user && user.credits < 50 && (
        <Alert className="mb-6">
          <Coins className="h-4 w-4" />
          <AlertDescription>
            Your credit balance is running low. Consider purchasing more credits to continue generating illustrations.
          </AlertDescription>
        </Alert>
      )}

      {/* Balance Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardDescription>Current Balance</CardDescription>
            <CardTitle className="text-4xl">{user?.credits || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Free Plan</Badge>
              <p className="text-sm text-muted-foreground">Each illustration costs ~10 credits</p>
            </div>
            <Dialog open={purchaseModalOpen} onOpenChange={setPurchaseModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Buy Credits
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Purchase Credits</DialogTitle>
                  <DialogDescription>Choose a credit package that fits your needs</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {creditPackages.map((pkg) => (
                    <Card
                      key={pkg.amount}
                      className={cn(
                        "cursor-pointer transition-colors hover:border-primary",
                        pkg.popular && "border-primary",
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{pkg.amount} Credits</CardTitle>
                            <CardDescription className="text-2xl font-bold mt-1">{pkg.price}</CardDescription>
                          </div>
                          {pkg.popular && <Badge>Popular</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => handlePurchase(pkg.amount, pkg.price)}
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? "Processing..." : "Purchase"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Usage Tip</CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Generate multiple illustrations at once to save credits. Batch generation is more efficient than individual
            requests.
          </CardContent>
        </Card>
      </div>

      {/* Transaction Ledger */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Complete audit trail of all credit transactions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="earn">Earned</SelectItem>
                  <SelectItem value="spend">Spent</SelectItem>
                  <SelectItem value="purchase">Purchased</SelectItem>
                  <SelectItem value="refund">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="hidden md:table-cell">Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {format(new Date(txn.createdAt), "MMM d, HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(txn.type)}
                          <span className="capitalize text-sm">{txn.type}</span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn("text-right font-medium", txn.amount > 0 ? "text-green-600" : "text-red-600")}
                      >
                        {txn.amount > 0 ? "+" : ""}
                        {txn.amount}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{txn.reason}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {txn.referenceId || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
