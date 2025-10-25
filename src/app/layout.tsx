import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Navbar } from '@/components/Navbar'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins' 
})

export const metadata: Metadata = {
  title: 'UniVibe Events - Find Your Vibe on Campus',
  description: 'Discover hackathons, gaming nights, food clubs, and tech workshops on your campus',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-background">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
