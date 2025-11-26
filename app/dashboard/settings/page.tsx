"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SettingsPage() {
  const [businessSettings, setBusinessSettings] = useState({
    businessName: "My Business",
    ownerName: "Owner Name",
    ownerEmail: "owner@example.com",
    ownerPhone: "+1 (555) 123-4567",
    businessAddress: "123 Business St, City",
  })

  const [language, setLanguage] = useState("english")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const languageOptions = [
    { id: "english", name: "English", flag: "🇬🇧" },
    { id: "sinhala", name: "සිංහල", flag: "🇱🇰" },
    { id: "tamil", name: "தமிழ்", flag: "🇮🇳" },
  ]

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-foreground">Settings</h1>

      <Card className="p-6 border-l-4 border-l-blue-500">
        <h2 className="text-xl font-bold text-foreground mb-6">Language Preferences</h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Select your preferred language for the application interface</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {languageOptions.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                  language === lang.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="text-left">
                  <div className="font-semibold text-foreground">{lang.name}</div>
                  {language === lang.id && <div className="text-xs text-blue-600 font-medium">Selected</div>}
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Language
            </Button>
            {saved && <span className="text-green-600 text-sm font-medium pt-2">Saved successfully!</span>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Business Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Business Name</label>
            <Input
              value={businessSettings.businessName}
              onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
              placeholder="Business name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Owner Name</label>
              <Input
                value={businessSettings.ownerName}
                onChange={(e) => setBusinessSettings({ ...businessSettings, ownerName: e.target.value })}
                placeholder="Owner name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Owner Email</label>
              <Input
                type="email"
                value={businessSettings.ownerEmail}
                onChange={(e) => setBusinessSettings({ ...businessSettings, ownerEmail: e.target.value })}
                placeholder="owner@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Owner Phone</label>
            <Input
              value={businessSettings.ownerPhone}
              onChange={(e) => setBusinessSettings({ ...businessSettings, ownerPhone: e.target.value })}
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Business Address</label>
            <Input
              value={businessSettings.businessAddress}
              onChange={(e) => setBusinessSettings({ ...businessSettings, businessAddress: e.target.value })}
              placeholder="Business address"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Save Changes
            </Button>
            {saved && <span className="text-green-600 text-sm font-medium pt-2">Saved successfully!</span>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Data Management</h2>
        <div className="space-y-3">
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-foreground justify-start">
            📥 Export Data (CSV)
          </Button>
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-foreground justify-start">
            💾 Backup Data
          </Button>
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-foreground justify-start">
            📊 Export Excel
          </Button>
        </div>
      </Card>
    </div>
  )
}
