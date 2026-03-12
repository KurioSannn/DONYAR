"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"

const SPLASH_KEY = "donyar_splashed"

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const publicPages = ["/login", "/register"]
  const isPublicPage = publicPages.includes(pathname)

  useEffect(() => {
    if (isPublicPage) return
    if (status === "loading") return

    // Cek apakah splash sudah pernah ditampilkan
    const alreadySplashed = sessionStorage.getItem(SPLASH_KEY)

    if (!alreadySplashed) {
      setLoading(true)
      sessionStorage.setItem(SPLASH_KEY, "true")

      const fadeTimer = setTimeout(() => setFadeOut(true), 1800)
      const loadTimer = setTimeout(() => {
        setLoading(false)
        if (!session) router.push("/login")
      }, 2300)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(loadTimer)
      }
    } else {
      if (!session) router.push("/login")
    }
  }, [status, session, isPublicPage])

  if (isPublicPage) return <>{children}</>

  if (loading) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center bg-white gap-4 transition-opacity duration-500"
        style={{ opacity: fadeOut ? 0 : 1 }}
      >
        <div className="animate-pulse">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-5xl">🌿</span>
          </div>
        </div>
        <div className="animate-pulse text-center">
          <h1 className="text-4xl font-bold text-green-600 tracking-widest">DONYAR</h1>
          <p className="text-gray-400 text-sm mt-1 tracking-wide">Smart Donation Platform</p>
        </div>
        <div className="flex gap-1 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  return <>{children}</>
}