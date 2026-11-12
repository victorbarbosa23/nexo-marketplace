import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Nexo — descubra produtos digitais", description: "Marketplace de descoberta de produtos digitais." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-BR"><body>{children}</body></html>; }
