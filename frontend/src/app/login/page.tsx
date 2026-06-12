import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Lock, Mail } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center relative bg-slate-50 overflow-hidden px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      
      <Card className="w-full max-w-md relative z-10 bg-white/80 backdrop-blur-2xl border-white shadow-2xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="space-y-3 text-center pb-8 pt-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary/70 shadow-lg shadow-primary/20 mb-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-800">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-500 text-base">
            Enter your credentials to access Mirraya ERP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="space-y-5">
            <div className="space-y-2 relative group">
              <label
                htmlFor="email"
                className="text-sm font-semibold leading-none text-slate-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@mirraya.com"
                  className="pl-10 h-11 bg-white/50 focus:bg-white"
                />
              </div>
            </div>
            <div className="space-y-2 relative group">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold leading-none text-slate-700"
                >
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-white/50 focus:bg-white"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-5 mt-8">
            <Button className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300">
              Sign In
            </Button>
            <div className="text-center text-sm text-slate-500">
              Having trouble logging in?{" "}
              <a href="#" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Contact Admin
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
