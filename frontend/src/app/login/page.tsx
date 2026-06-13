import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Lock, Mail } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center relative bg-background overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
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
          <div className="space-y-4">
            <div className="space-y-1.5 relative group">
              <label
                htmlFor="email"
                className="text-xs font-semibold leading-none text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@mirraya.com"
                  className="pl-9 h-10 text-sm bg-background/50 focus:bg-background"
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
                <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-10 text-sm bg-background/50 focus:bg-background"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Button className="w-full h-10 text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              Sign In
            </Button>
            <div className="text-center text-xs text-muted-foreground">
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

