import './globals.css'

export const metadata = {
  title: 'CareerShield AI',
  description: 'Verify opportunities. Measure readiness. Plan your next move.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  )
}
