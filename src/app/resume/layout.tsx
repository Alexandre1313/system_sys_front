import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'HISTÒRICO',
    description: '...',
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}