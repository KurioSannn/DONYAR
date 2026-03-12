import { Poppins } from "next/font/google"
import "./globals.css"
import BottomNavbar from "@/components/BottomNavbar"
import Providers from "@/components/Providers" // ✅ ganti import
import type { Metadata } from "next"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "DONYAR - Smart Donation Platform",
  description: "Platform donasi cerdas powered by AI",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers> {/* ✅ pakai Providers bukan SessionProvider langsung */}
          {children}
          <BottomNavbar />
        </Providers>
      </body>
    </html>
  )
}