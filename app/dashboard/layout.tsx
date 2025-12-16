"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { Menu, X } from "lucide-react"
import { CustomersProvider } from "@/lib/customers-context"
import { SalesProvider } from "@/lib/sales-context"
import { ProductionProvider } from "@/lib/production-context"
import { ProductTypeProvider } from "@/lib/product-type-context"
import { RawMaterialProvider } from "@/lib/raw-material-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem("auth")
    if (!auth) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <CustomersProvider>
    <SalesProvider>
    <ProductTypeProvider>
    <RawMaterialProvider>
    <ProductionProvider>
    <div className="flex h-screen bg-background md:flex-row flex-col">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border p-4 flex items-center justify-between z-50">
        <h1 className="text-lg font-bold text-primary">Business Manager</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-foreground hover:text-primary transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30 mt-16" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative md:flex md:flex-col w-64 h-[calc(100vh-64px)] md:h-full md:mt-0 mt-16 z-40 transform transition-transform md:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto mt-16 md:mt-0">{children}</main>
    </div>
    </ProductionProvider>
    </RawMaterialProvider>
    </ProductTypeProvider>
    </SalesProvider>
    </CustomersProvider>
  )
}
