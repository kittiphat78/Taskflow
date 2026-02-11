import "./globals.css"
import { AuthProvider } from "./providers"

export const metadata = {
  title: "TaskFlow",
  description: "Simple Todo App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
