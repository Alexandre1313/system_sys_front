import { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Relatório de Expedição por Escola | SYS EXPED',
  description: 'Visualize e analise os dados de expedição organizados por escola, data e status. Gere relatórios detalhados em PDF com agrupamento por unidade escolar.',
  keywords: [
    'relatório expedição',
    'escola',
    'data saída',
    'PDF',
    'agrupamento escolar',
    'análise expedição',
    'sistema expedição',
    'unidade escolar'
  ],
  authors: [{ name: 'Alexandre Cordeiro' }],
  robots: {
    index: false,
    follow: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e293b',
}

export default function RelatorioSaidaPorDataEscolaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
