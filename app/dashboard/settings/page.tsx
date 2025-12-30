"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useLanguage } from "@/lib/auth-context"


export default function SettingsPage() {
  const [businessSettings, setBusinessSettings] = useState({
    businessName: "My Business",
    ownerName: "Owner Name",
    ownerEmail: "owner@example.com",
    ownerPhone: "+1 (555) 123-4567",
    businessAddress: "123 Business St, City",
  })

  const { language, setLanguage } = useLanguage();
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const languageOptions = [
    { id: "english", name: "English", flag: "🇬🇧" },
    { id: "sinhala", name: "සිංහල", flag: "🇱🇰" },
    // { id: "tamil", name: "தமிழ்", flag: "🇮🇳" },
  ]

  // Hardcoded translations for Sinhala
  const t = (key: string) => {
    if (language === "sinhala") {
      const si: Record<string, string> = {
        settings: "සැකසුම්",
        languagePreferences: "භාෂාව තෝරන්න",
        selectLanguage: "යෙදුමේ අතුරුමුහුණත සඳහා ඔබ කැමති භාෂාව තෝරන්න",
        selected: "තෝරා ඇත",
        saveLanguage: "භාෂාව සුරකින්න",
        savedSuccessfully: "සාර්ථකව සුරකින ලදී!",
        businessInfo: "ව්‍යාපාර තොරතුරු",
        businessName: "ව්‍යාපාරයේ නම",
        ownerName: "අයිතිකරුගේ නම",
        ownerEmail: "අයිතිකරුගේ ඊමේල්",
        ownerPhone: "අයිතිකරුගේ දුරකථන අංකය",
        businessAddress: "ව්‍යාපාර ලිපිනය",
        saveChanges: "වෙනස්කම් සුරකින්න",
        dataManagement: "දත්ත කළමනාකරණය",
        exportCSV: "📥 දත්ත නිර්යාත කරන්න (CSV)",
        backupData: "💾 දත්ත උපස්ථ කරන්න",
        exportExcel: "📊 Excel නිර්යාත කරන්න",
      }
      return si[key] || key
    }
    // English fallback
    const en: Record<string, string> = {
      settings: "Settings",
      languagePreferences: "Language Preferences",
      selectLanguage: "Select your preferred language for the application interface",
      selected: "Selected",
      saveLanguage: "Save Language",
      savedSuccessfully: "Saved successfully!",
      businessInfo: "Business Information",
      businessName: "Business Name",
      ownerName: "Owner Name",
      ownerEmail: "Owner Email",
      ownerPhone: "Owner Phone",
      businessAddress: "Business Address",
      saveChanges: "Save Changes",
      dataManagement: "Data Management",
      exportCSV: "📥 Export Data (CSV)",
      backupData: "💾 Backup Data",
      exportExcel: "📊 Export Excel",
    }
    return en[key] || key
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-foreground">{t("settings")}</h1>

      <Card className="p-6 border-l-4 border-l-blue-500">
        <h2 className="text-xl font-bold text-foreground mb-6">{t("languagePreferences")}</h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("selectLanguage")}</p>
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
                  {language === lang.id && <div className="text-xs text-blue-600 font-medium">{t("selected")}</div>}
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            {/* <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              {t("saveLanguage")}
            </Button> */}
            {saved && <span className="text-green-600 text-sm font-medium pt-2">{t("savedSuccessfully")}</span>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">{t("businessInfo")}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t("businessName")}</label>
            <Input
              value={businessSettings.businessName}
              onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
              placeholder={t("businessName")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t("ownerName")}</label>
              <Input
                value={businessSettings.ownerName}
                onChange={(e) => setBusinessSettings({ ...businessSettings, ownerName: e.target.value })}
                placeholder={t("ownerName")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t("ownerEmail")}</label>
              <Input
                type="email"
                value={businessSettings.ownerEmail}
                onChange={(e) => setBusinessSettings({ ...businessSettings, ownerEmail: e.target.value })}
                placeholder="owner@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t("ownerPhone")}</label>
            <Input
              value={businessSettings.ownerPhone}
              onChange={(e) => setBusinessSettings({ ...businessSettings, ownerPhone: e.target.value })}
              placeholder={t("ownerPhone")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t("businessAddress")}</label>
            <Input
              value={businessSettings.businessAddress}
              onChange={(e) => setBusinessSettings({ ...businessSettings, businessAddress: e.target.value })}
              placeholder={t("businessAddress")}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {t("saveChanges")}
            </Button>
            {saved && <span className="text-green-600 text-sm font-medium pt-2">{t("savedSuccessfully")}</span>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">{t("dataManagement")}</h2>
        <div className="space-y-3">
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-foreground justify-start">
            {t("exportCSV")}
          </Button>
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-foreground justify-start">
            {t("backupData")}
          </Button>
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-foreground justify-start">
            {t("exportExcel")}
          </Button>
        </div>
      </Card>
    </div>
  )
}
