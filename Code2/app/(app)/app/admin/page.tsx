"use client"

import { useState, useEffect, Suspense } from "react"
import { Search, Shield, UserCog, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { adminApi } from "@/lib/api"
import type { User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

function AdminContent() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [adjustAmount, setAdjustAmount] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      router.push("/app/projects")
    }
  }, [isAdmin, router])

  const handleSearch = async () => {
    if (!searchQuery) return
    setLoading(true)
    try {
      const results = await adminApi.searchUsers(searchQuery)
      setUsers(results)
    } finally {
      setLoading(false)
    }
  }

  const handleAdjustCredits = async (add: boolean) => {
    if (!selectedUser || !adjustAmount) return
    const amount = Number.parseInt(adjustAmount)
    if (isNaN(amount)) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid number",
      })
      return
    }

    try {
      await adminApi.adjustCredits(selectedUser.id, add ? amount : -amount, "Admin adjustment")
      toast({
        title: "Credits adjusted",
        description: `${add ? "Added" : "Removed"} ${amount} credits ${add ? "to" : "from"} ${selectedUser.email}`,
      })
      setAdjustAmount("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to adjust credits",
      })
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <Badge variant="destructive">Admin</Badge>
        </div>
        <p className="text-muted-foreground">Manage users and system settings</p>
      </div>

      <Alert className="mb-6">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You have administrative privileges. Use these tools responsibly. All actions are logged.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {/* User Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              <CardTitle>User Search</CardTitle>
            </div>
            <CardDescription>Search for users by email address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="user@example.com"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Results */}
        {users.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>{users.length} user(s) found</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Credits</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{user.credits}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                              onClick={() => setSelectedUser(user)}
                            >
                              <UserCog className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Manage User</DialogTitle>
                              <DialogDescription>{selectedUser?.email}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm text-muted-foreground">Current Credits</Label>
                                  <p className="text-2xl font-bold">{selectedUser?.credits}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-muted-foreground">Role</Label>
                                  <p className="text-lg font-medium capitalize">{selectedUser?.role}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="adjust-amount">Adjust Credits</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="adjust-amount"
                                    type="number"
                                    placeholder="Amount"
                                    value={adjustAmount}
                                    onChange={(e) => setAdjustAmount(e.target.value)}
                                  />
                                  <Button
                                    variant="outline"
                                    onClick={() => handleAdjustCredits(true)}
                                    className="gap-1 bg-transparent"
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleAdjustCredits(false)}
                                    className="gap-1 bg-transparent"
                                  >
                                    <Minus className="h-4 w-4" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Audit Log Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Admin Actions</CardTitle>
            <CardDescription>Audit log of administrative activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Audit log coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminContent />
    </Suspense>
  )
}
