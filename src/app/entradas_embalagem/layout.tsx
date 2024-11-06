import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'ENTRADAS',
    description: '...',
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
