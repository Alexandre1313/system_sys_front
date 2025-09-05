'use client'

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, UserCheck, X, Home, Folder, BookOpen, LogOut } from "react-feather";

export interface DrawerNavigationProps {
    isOpen: boolean;
    onClose: () => void;
    currentPage?: string;
    projectName?: string;
    sectionName?: string;
}

export default function DrawerNavigation({ isOpen, onClose, projectName, sectionName }: DrawerNavigationProps) {
    const { logout, user } = useAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => { setIsClient(true) }, []);

    const handlerLogout = () => {
        if (isClient) {
            logout()
            router.push('/login')
        }
    }

    // Close drawer when clicking outside or pressing escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div 
                className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-md border-r border-slate-700 z-50 transform transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600">
                                    SYS<span className="text-blue-400 ml-1">E</span><span className="text-slate-300 ml-1">XPED</span>
                                </h1>
                                <p className="text-xs text-slate-400">Sistema de Expedição</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200"
                        >
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Current Page Info */}
                    {(projectName || sectionName) && (
                        <div className="p-4 bg-slate-800/50 border-b border-slate-700">
                            <div className="text-center">
                                {projectName && (
                                    <h2 className="text-lg font-semibold text-white truncate" title={projectName}>
                                        {projectName}
                                    </h2>
                                )}
                                {sectionName && (
                                    <p className="text-sm text-slate-400 mt-1">
                                        {sectionName}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        <Link 
                            href="/" 
                            onClick={onClose}
                            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-colors duration-200 group"
                        >
                            <Home size={20} className="text-slate-400 group-hover:text-emerald-400" />
                            <span className="text-slate-300 group-hover:text-white">Página Initial</span>
                        </Link>

                        <Link 
                            href="/projetos" 
                            onClick={onClose}
                            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-colors duration-200 group"
                        >
                            <Folder size={20} className="text-slate-400 group-hover:text-emerald-400" />
                            <span className="text-slate-300 group-hover:text-white">Projetos</span>
                        </Link>

                        {projectName && (
                            <div className="pt-4 border-t border-slate-700">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-3">
                                    Página Atual
                                </p>
                                <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl">
                                    <BookOpen size={20} className="text-emerald-400" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate" title={projectName}>
                                            {projectName}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {sectionName || 'Navegação'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t border-slate-700">
                        {user ? (
                            <div className="flex items-center space-x-3 p-3 bg-emerald-900/30 border border-emerald-700 rounded-xl mb-4">
                                <UserCheck size={20} className="text-emerald-400" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-emerald-300 font-medium truncate" title={user.nome}>
                                        {user.nome}
                                    </p>
                                    <p className="text-xs text-emerald-400">Conectado</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 p-3 bg-red-900/30 border border-red-700 rounded-xl mb-4">
                                <User size={20} className="text-red-400" />
                                <div className="flex-1">
                                    <p className="text-red-300 font-medium">Não Identificado</p>
                                    <p className="text-xs text-red-400">Sem autenticação</p>
                                </div>
                            </div>
                        )}

                        {/* Logout Button */}
                        <button
                            onClick={handlerLogout}
                            className="w-full flex items-center justify-center space-x-2 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all duration-300 group"
                        >
                            <LogOut size={18} className="text-slate-400 group-hover:text-red-400" />
                            <span className="text-slate-300 group-hover:text-white font-medium">Logout</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-700">
                        <p className="text-xs text-slate-500 text-center">
                            © {new Date().getFullYear()} SYS EXPED - v2.1.1
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
