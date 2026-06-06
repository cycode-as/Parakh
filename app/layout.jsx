import './globals.css'

export const metadata = {
  title: 'Parakh — Find Opportunities You Can Trust',
  description: 'Analyze internships and jobs using your Resume, GitHub, LinkedIn, and Portfolio.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
