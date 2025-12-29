import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { RawMaterialTypeProvider } from "@/lib/raw-material-type-context"
import { ProductTypeProvider } from "@/lib/product-type-context"
import { RawMaterialProvider } from "@/lib/raw-material-context"
import { RawMaterialPurchaseProvider } from "@/lib/raw-material-purchase"
import { ProductProvider } from "@/lib/product-context"
import { ProductHistoryProvider } from "@/lib/product-history"
import { ProfitProvider } from "@/lib/profit-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })



export const metadata: Metadata = {
  title: "Business Management System",
  description: "Simple business management dashboard",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <RawMaterialTypeProvider>
            <ProductTypeProvider>
              <RawMaterialProvider>
                <RawMaterialPurchaseProvider>
                  <ProductProvider>
                    <ProductHistoryProvider>
                      <ProfitProvider>
                        {children}
                      </ProfitProvider>
                    </ProductHistoryProvider>
                  </ProductProvider>
                </RawMaterialPurchaseProvider>
              </RawMaterialProvider>
            </ProductTypeProvider>
          </RawMaterialTypeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
