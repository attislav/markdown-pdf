'use client'
import { useState, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  FileText, Upload, Download, Eye, Code2, Trash2, Copy, Check, X
} from 'lucide-react'

const mdComponents = {
  tr: ({ node, ...props }) => (
    <tr style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} {...props} />
  ),
  table: ({ node, ...props }) => (
    <table style={{ pageBreakInside: 'auto', breakInside: 'auto', width: '100%', borderCollapse: 'collapse' }} {...props} />
  ),
}

const SAMPLE = `# Mein Bericht

## Zusammenfassung

Dies ist ein **Beispieldokument** mit _Markdown_ Formatierung.

## Punkte

- Punkt 1
- Punkt 2
- Punkt 3

## Tabelle

| Spalte 1 | Spalte 2 | Spalte 3 |
|----------|----------|----------|
| A        | B        | C        |
| D        | E        | F        |

## Code

\`\`\`javascript
const hello = () => console.log("Hello World")
\`\`\`

> Ein Zitat zur Inspiration.

---

Erstellt mit **Markdown PDF**.
`

export default function Home() {
  const [markdown, setMarkdown] = useState(SAMPLE)
  const [logo, setLogo] = useState(null)
  const [logoName, setLogoName] = useState('')
  const [footerText, setFooterText] = useState('')
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState('split') // 'split' | 'editor' | 'preview'
  const fileInputRef = useRef(null)
  const logoInputRef = useRef(null)

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setLogo(ev.target.result)
      setLogoName(file.name)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleMarkdownFile = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setMarkdown(ev.target.result)
    reader.readAsText(file)
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [markdown])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  return (
    <>
      {/* Print header — only visible when printing */}
      <div className="print-header">
        {logo && <img src={logo} alt="Logo" style={{ maxHeight: '40px', maxWidth: '200px', objectFit: 'contain' }} />}
      </div>

      {/* Print footer — only visible when printing */}
      <div className="print-footer">
        <span>{footerText || ''}</span>
        <span style={{ counterReset: 'page' }} className="page-number">
        </span>
      </div>

      {/* Screen UI */}
      <div className="no-print min-h-screen bg-[#0f1117] text-gray-100 flex flex-col">
        {/* Top bar */}
        <header className="border-b border-gray-800 bg-[#0f1117] px-4 py-3 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 mr-4">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">Markdown PDF</span>
          </div>

          {/* View toggle */}
          <div className="flex bg-gray-800 rounded-lg p-0.5 text-sm">
            {[['split', 'Split'], ['editor', 'Editor'], ['preview', 'Vorschau']].map(([v, label]) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1 rounded-md transition-colors ${view === v ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto flex-wrap">
            {/* Logo upload */}
            <div className="flex items-center gap-2">
              {logo ? (
                <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-1.5 text-sm">
                  <img src={logo} alt="logo" className="h-5 w-auto object-contain" />
                  <span className="text-gray-400 max-w-[100px] truncate text-xs">{logoName}</span>
                  <button onClick={() => { setLogo(null); setLogoName('') }} className="text-gray-500 hover:text-red-400 ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => logoInputRef.current?.click()}
                  className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 transition-colors">
                  <Upload className="w-4 h-4" />
                  Logo hochladen
                </button>
              )}
              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </div>

            {/* Footer text */}
            <input
              type="text"
              value={footerText}
              onChange={e => setFooterText(e.target.value)}
              placeholder="Footer-Text (z.B. Firmenname)"
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-500 w-52"
            />

            {/* Load .md file */}
            <button onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 transition-colors">
              <Code2 className="w-4 h-4" />
              .md laden
            </button>
            <input ref={fileInputRef} type="file" accept=".md,.txt" onChange={handleMarkdownFile} className="hidden" />

            {/* Copy */}
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Clear */}
            <button onClick={() => setMarkdown('')}
              className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Export PDF */}
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-colors">
              <Download className="w-4 h-4" />
              Als PDF
            </button>
          </div>
        </header>

        {/* Main area */}
        <main className="flex flex-1 overflow-hidden">
          {/* Editor */}
          {(view === 'split' || view === 'editor') && (
            <div className={`flex flex-col ${view === 'split' ? 'w-1/2 border-r border-gray-800' : 'w-full'}`}>
              <div className="px-4 py-2 border-b border-gray-800 text-xs text-gray-500 flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5" /> Markdown
              </div>
              <textarea
                value={markdown}
                onChange={e => setMarkdown(e.target.value)}
                spellCheck={false}
                placeholder="Markdown hier eingeben..."
                className="flex-1 bg-[#0f1117] text-gray-200 p-5 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              />
            </div>
          )}

          {/* Preview */}
          {(view === 'split' || view === 'preview') && (
            <div className={`flex flex-col ${view === 'split' ? 'w-1/2' : 'w-full'} overflow-y-auto`}>
              <div className="px-4 py-2 border-b border-gray-800 text-xs text-gray-500 flex items-center gap-2 sticky top-0 bg-[#0f1117] z-10">
                <Eye className="w-3.5 h-3.5" /> Vorschau
                {logo && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <img src={logo} alt="logo" className="h-5 w-auto object-contain opacity-60" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-8 bg-white text-gray-900">
                {logo && (
                  <div className="mb-6 pb-4 border-b border-gray-200">
                    <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
                  </div>
                )}
                <article className="prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                    {markdown}
                  </ReactMarkdown>
                </article>
                {footerText && (
                  <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-400">
                    {footerText}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Print content — only rendered when printing */}
      <div className="print-content">
        <article className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </>
  )
}
