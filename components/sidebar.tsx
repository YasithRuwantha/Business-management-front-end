"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  ShoppingCart,
  Zap,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react"

interface SidebarProps {
  onClose?: () => void
}

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Raw Materials", href: "/dashboard/raw-materials", icon: Layers },
  { label: "Raw Materials Type", href: "/dashboard/raw-materials-type", icon: Layers},
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Production", href: "/dashboard/production", icon: Zap },
  { label: "Sales", href: "/dashboard/sales", icon: ShoppingCart },
  { label: "Monthly Summary", href: "/dashboard/daily-summary", icon: Calendar },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem("auth")
    sessionStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <aside className="w-full bg-card border-r border-border h-full flex flex-col overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border hidden md:block">
        <h1 className="text-2xl font-bold text-primary">Business Manager</h1>
        <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-2 rounded-lg transition-colors text-sm md:text-base ${
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-2 md:p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 md:px-4 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors text-sm md:text-base"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
