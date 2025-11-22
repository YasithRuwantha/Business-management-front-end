"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
  useEffect(() => {
    const auth = sessionStorage.getItem("auth")
    if (!auth) {
      redirect("/login")
    }
  }, [])

  return null
}
