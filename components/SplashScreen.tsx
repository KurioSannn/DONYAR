"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

const SPLASH_KEY = "donyar_splashed";

export default function SplashScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const publicPages = ["/login", "/register"];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    if (isPublicPage) return;
    if (status === "loading") return;

    const alreadySplashed = sessionStorage.getItem(SPLASH_KEY);

    if (!alreadySplashed) {
      setLoading(true);
      sessionStorage.setItem(SPLASH_KEY, "true");

      const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
      const loadTimer = setTimeout(() => {
        setLoading(false);
        if (!session) router.push("/login");
      }, 2300);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(loadTimer);
      };
    } else {
      if (!session) router.push("/login");
    }
  }, [status, session, isPublicPage]);

  if (isPublicPage) return <>{children}</>;

  if (loading) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center gap-6 transition-opacity duration-500"
        style={{
          opacity: fadeOut ? 0 : 1,
          background: "linear-gradient(160deg, #1a6b1c 0%, #0d3d0e 100%)",
        }}
      >
        {/* LOGO */}
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl p-4">
            <Image src="/LogoDonyar.svg" alt="DONYAR" width={60} height={60} />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-widest">
              DONYAR
            </h1>
            <p className="text-green-300 text-sm mt-1 tracking-wide">
              Smart Donation Platform
            </p>
          </div>
        </div>

        {/* DOTS */}
        <div className="flex gap-2 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-green-300 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
