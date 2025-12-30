"use client"

import { useLanguage } from "@/lib/auth-context";
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
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "customers", href: "/dashboard/customers", icon: Users },
  { key: "rawMaterials", href: "/dashboard/raw-materials", icon: Layers },
  { key: "rawMaterialsType", href: "/dashboard/raw-materials-type", icon: Layers },
  { key: "products", href: "/dashboard/products", icon: Package },
  { key: "productType", href: "/dashboard/product-type", icon: Package },
  { key: "production", href: "/dashboard/production", icon: Zap },
  { key: "sales", href: "/dashboard/sales", icon: ShoppingCart },
  { key: "monthlySummary", href: "/dashboard/daily-summary", icon: Calendar },
  { key: "analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { key: "settings", href: "/dashboard/settings", icon: Settings },
];


export default function Sidebar({ onClose }: SidebarProps) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  // Hardcoded translations for Sinhala
  const t = (key: string) => {
    if (language === "sinhala") {
      const si: Record<string, string> = {
        dashboard: "පුවරුව",
        customers: "පාරිභෝගිකයින්",
        rawMaterials: "අමුද්‍රව්‍ය",
        rawMaterialsType: "අමුද්‍රව්‍ය වර්ගය",
        products: "නිෂ්පාදන",
        productType: "නිෂ්පාදන වර්ගය",
        production: "නිෂ්පාදනය",
        sales: "විකුණුම්",
        monthlySummary: "මාසික සාරාංශය",
        analytics: "විශ්ලේෂණ",
        settings: "සැකසුම්",
        // businessManager: "ව්‍යාපාර කළමනාකරු",
        adminPanel: "පරිපාලක පුවරුව",
        logout: "ඉවත් වන්න",
      };
      return si[key] || key;
    }
    // English fallback
    const en: Record<string, string> = {
      dashboard: "Dashboard",
      customers: "Customers",
      rawMaterials: "Raw Materials",
      rawMaterialsType: "Raw Materials Type",
      products: "Products",
      productType: "Product Type",
      production: "Production",
      sales: "Sales",
      monthlySummary: "Monthly Summary",
      analytics: "Analytics",
      settings: "Settings",
      // businessManager: "Business Manager",
      adminPanel: "Admin Panel",
      logout: "Logout",
    };
    return en[key] || key;
  };

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="w-full bg-card border-r border-border h-full flex flex-col overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border hidden md:block">
        <h1 className="text-2xl font-bold text-primary">Business Manager</h1>
        <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2 overflow-y-scroll scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
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
              <span className="font-medium">{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 md:p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 md:px-4 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors text-sm md:text-base"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="font-medium">{t("logout")}</span>
        </button>
      </div>
    </aside>
  )
}
