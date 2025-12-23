"use client"

import type React from "react"

interface ModalOverlayProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}

export function ModalOverlay({ isOpen, onClose, children, title }: ModalOverlayProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
