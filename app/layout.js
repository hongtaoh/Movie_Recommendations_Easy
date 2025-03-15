import "./globals.css";
import Link from 'next/link';

export const metadata = {
  title: "Movie App",
  description: "A simple movie browsing application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto p-4 flex justify-between items-center">
            <Link href='/' className="text-xl font-bold text-blue-600">
              The Movie App
            </Link>
          </nav>
        </header>
        <main className="continer mx-auto p-4 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}