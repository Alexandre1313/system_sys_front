import { AuthProvider } from "@/contexts/AuthContext";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const font = Poppins({
  subsets: ['latin'],
  weight: ['300', '700', '900'],
});

// Arquivo de layout ou página
export const metadata: Metadata = {
  title: "Sys Exped",
  description: "Sistema SysExped",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">     
      <body className={font.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
