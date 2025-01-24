import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'EXPEDIÇÃO',
    description: '...',
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
