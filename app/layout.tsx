import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Codezotic — Case Study Dashboard',
  description: 'Manage case studies for codezotic.com',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  )
}
