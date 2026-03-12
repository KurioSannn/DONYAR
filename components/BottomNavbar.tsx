"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

export default function BottomNavbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const publicPages = ["/login", "/register"]

  if (publicPages.includes(pathname)) return null

  const links = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/campaign", label: "Campaign", icon: "📋" },
    { href: "/riwayat", label: "Riwayat", icon: "📜" },
    { href: "/ai", label: "AI Chat", icon: "🤖" },
    { href: "/profile", label: "Profil", icon: "👤" },
    ...(session?.user?.role === "admin"
      ? [{ href: "/admin", label: "Admin", icon: "⚙️" }]
      : []),
  ]

  return (
    <div className="fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl z-50">
      <div className="flex justify-around items-center py-2 px-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                isActive ? "bg-green-500 shadow-lg shadow-green-200" : "bg-transparent"
              }`}>
                <span className="text-lg">{link.icon}</span>
              </div>
              <span className={`text-xs font-semibold transition-colors ${
                isActive ? "text-green-600" : "text-gray-400"
              }`}>
                {link.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}