"use client"

import { useEffect, useState } from "react"

type ToastProps = {
  message: string
  type?: "success" | "error" | "info"
  onClose: () => void
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const styles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }

  const icons = { success: "✅", error: "❌", info: "ℹ️" }

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-999 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-bold transition-all animate-bounce ${styles[type]}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  )
}