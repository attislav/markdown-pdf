import './globals.css'

export const metadata = {
  title: 'Markdown PDF',
  description: 'Markdown to branded PDF converter',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
