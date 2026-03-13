import { Poppins } from "next/font/google"
import "./globals.css"
import BottomNavbar from "@/components/BottomNavbar"
import Providers from "@/components/Providers"
import SplashScreen from "@/components/SplashScreen"
import type { Metadata } from "next"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "DONYAR - Smart Donation Platform",
  description: "Platform donasi cerdas powered by AI untuk Ramadhan 1447H",
  icons: {
    icon: "/LogoDonyar.svg",
    apple: "/LogoDonyar.svg",
  },
openGraph: {
  title: "DONYAR - Smart Donation Platform 🌙",
  description: "Temukan campaign donasi terbaik dengan bantuan AI. Platform donasi cerdas untuk Ramadhan 1447H.",
  url: "https://donyar.vercel.app",
  siteName: "DONYAR",
  type: "website",
  images: [
    {
      url: "https://donyar.vercel.app/LogoDonyar.svg",
      width: 800,
      height: 800,
      alt: "DONYAR Logo",
    }
  ],
},
  twitter: {
    card: "summary",
    title: "DONYAR - Smart Donation Platform 🌙",
    description: "Temukan campaign donasi terbaik dengan bantuan AI.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <Providers>
          <SplashScreen>
            {children}
          </SplashScreen>
          <BottomNavbar />
        </Providers>
      </body>
    </html>
  )
}
