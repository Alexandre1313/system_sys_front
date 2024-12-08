import { AuthProvider } from "@/contexts/AuthContext";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const font = Montserrat({
  subsets: ['latin'],
});

// Arquivo de layout ou página
export const metadata: Metadata = {
  title: "VENTURA TÊXTIL",
  description: "Sistema Next App",
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
