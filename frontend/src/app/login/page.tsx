"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Lock, Mail, Loader2 } from "lucide-react"
import { fetcher } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetcher("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password })
      })
      if (res.user) {
        login(res.user)
        // Redirect based on role
        const role = res.user.role
        if (role === 'owner') router.push('/dashboard/owner')
        else if (role === 'hr') router.push('/dashboard/hr')
        else if (role === 'accounting') router.push('/dashboard/accounting')
        else if (role === 'kepala-toko') router.push('/dashboard/kepala-toko')
        else router.push('/dashboard/karyawan')
      }
    } catch (err: any) {
      setError(err.message || "Gagal login. Periksa email dan password Anda.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center relative bg-background overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-secondary/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute top-1/3 -right-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />

      <Card className="w-full max-w-[380px] relative z-10 bg-card/90 backdrop-blur-xl border-border shadow-2xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="space-y-2 text-center pb-6 pt-8">
          <div className="mx-auto flex h-40 items-center justify-center mb-2">
            <img src="/logo.png" alt="Mirayya Logo" className="h-full w-auto object-contain drop-shadow-sm scale-150 hover:scale-[1.60] transition-transform duration-300" />
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pb-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}
            <div className="space-y-1.5 relative group">
              <label
                htmlFor="identifier"
                className="text-xs font-semibold leading-none text-foreground"
              >
                Email / ID Karyawan
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="name@mirayya.com atau EMP001"
                  className="pl-9 h-10 text-sm bg-background/50 focus:bg-background"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5 relative group">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold leading-none text-foreground"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-10 text-sm bg-background/50 focus:bg-background"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <Button type="submit" disabled={loading} className="w-full h-10 text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Sign In
              </Button>
              <div className="text-center text-xs text-muted-foreground">
                Having trouble logging in?{" "}
                <a href="mailto:admin@mirayya.com" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  Contact Admin
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
