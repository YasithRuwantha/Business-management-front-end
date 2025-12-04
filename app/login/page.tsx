"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    setTimeout(() => {
      if (email === "admin@gmail.com" && password === "pw-admin") {
        sessionStorage.setItem("auth", "true")
        sessionStorage.setItem("user", "Admin")
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-6 md:p-8 space-y-6 md:space-y-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Business Manager</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <Input
                type="password"
                placeholder="pw-admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full text-base"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-2.5 text-base md:text-lg"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded text-xs md:text-sm text-gray-700">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p className="truncate">
              Email: <span className="font-mono text-xs">admin@gmail.com</span>
            </p>
            <p className="truncate">
              Password: <span className="font-mono text-xs">pw-admin</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
