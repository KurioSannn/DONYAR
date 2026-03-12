"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

export default function BottomNavbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

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
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 shadow-lg">
      <div className="flex justify-around items-center py-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1 px-4 py-1">
              <span className="text-xl">{link.icon}</span>
              <span className={`text-xs font-semibold transition-colors ${isActive ? "text-green-600" : "text-gray-400"}`}>
                {link.label}
              </span>
              {isActive && <div className="w-1 h-1 rounded-full bg-green-500" />}
            </Link>
          )
        })}
      </div>
    </div>
  )
}