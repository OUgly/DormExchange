// app/layout.tsx
// The root layout for all pages. Global styles and shared UI live here.
import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'   // ⬅️ import Footer
import { ReactNode } from 'react'

export const metadata = {
  title: 'DormExchange',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg text-white antialiased">
        <Navbar />
        {children}
        <Footer /> {/* ⬅️ render Footer after page content */}
      </body>
    </html>
  )
}
