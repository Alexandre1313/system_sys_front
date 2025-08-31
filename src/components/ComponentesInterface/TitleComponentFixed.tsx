'use client'

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronsLeft, User, UserCheck } from "react-feather";

export interface TitleComponentFixedProps {
    stringOne: string;
    twoPoints?: string;
    stringTwo?: string;
}

export default function TitleComponentFixed(props: TitleComponentFixedProps) {
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

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="flex items-center h-16 lg:h-20 gap-2 sm:gap-4">
                    {/* Logo and Back Button */}
                    <div className="flex items-center shrink-0">
                        <Link 
                            href="/" 
                            className="flex items-center space-x-2 sm:space-x-3 group"
                        >
                            <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg transition-transform group-hover:scale-105">
                                <ChevronsLeft size={16} className="text-white lg:w-5 lg:h-5" strokeWidth={2} />
                            </div>
                            <div className="hidden md:block">
                                <div className="text-sm lg:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600">
                                    SYS<span className="text-blue-400 ml-1">E</span><span className="text-slate-300 ml-1">XPED</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Page Title */}
                    <div className="flex-1 flex justify-center px-2 sm:px-4 min-w-0">
                        <div className="text-center w-full max-w-full overflow-hidden">
                            {/* Desktop and Tablet Title */}
                            <div className="hidden sm:block">
                                <h1 className="text-lg lg:text-2xl font-semibold text-white truncate" 
                                    title={`${props.stringOne}${props.twoPoints ? ` ${props.twoPoints}` : ''}${props.stringTwo ? ` ${props.stringTwo}` : ''}`}>
                                    <span className="text-white">{props.stringOne}</span>
                                    {props.twoPoints && <span className="text-slate-400"> {props.twoPoints} </span>}
                                    {props.stringTwo && <span className="text-slate-300">{props.stringTwo}</span>}
                                </h1>
                            </div>
                            
                            {/* Mobile Title - More Compact */}
                            <div className="sm:hidden">
                                <h1 className="text-sm font-semibold text-white truncate leading-tight" 
                                    title={`${props.stringOne}${props.twoPoints ? ` ${props.twoPoints}` : ''}${props.stringTwo ? ` ${props.stringTwo}` : ''}`}>
                                    {/* Show only the main part on mobile, truncated if needed */}
                                    {props.stringTwo ? (
                                        <span>
                                            <span className="text-slate-400">{props.stringOne.length > 15 ? props.stringOne.substring(0, 15) + '...' : props.stringOne}</span>
                                            <span className="text-slate-300"> - {props.stringTwo}</span>
                                        </span>
                                    ) : (
                                        <span className="text-white">{props.stringOne}</span>
                                    )}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* User Info and Actions */}
                    <div className="flex items-center space-x-2 shrink-0">
                        {/* User Status - Hidden on small screens */}
                        <div className="hidden xl:flex items-center">
                            {user ? (
                                <div className="flex items-center space-x-2 px-2 py-1 bg-emerald-900/30 border border-emerald-700 rounded-lg">
                                    <UserCheck size={14} className="text-emerald-400" strokeWidth={1.5} />
                                    <span className="text-emerald-300 text-xs font-medium truncate max-w-[80px]" title={user.nome}>
                                        {user.nome}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-1 px-2 py-1 bg-red-900/30 border border-red-700 rounded-lg">
                                    <User size={14} className="text-red-400" strokeWidth={1.5} />
                                    <span className="text-red-300 text-xs font-medium">N/A</span>
                                </div>
                            )}
                        </div>

                        {/* Logout Button */}
                        <button
                            type="button"
                            onClick={handlerLogout}
                            className="flex items-center justify-center px-2 sm:px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all duration-300 hover:scale-105"
                        >
                            <span className="hidden sm:inline">LOGOUT</span>
                            <span className="sm:hidden">SAIR</span>
                        </button>
                    </div>
                </div>

                {/* Mobile User Status */}
                <div className="xl:hidden py-2 border-t border-slate-700/50">
                    <div className="flex items-center justify-center px-4">
                        {user ? (
                            <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-900/30 border border-emerald-700 rounded-lg">
                                <UserCheck size={12} className="text-emerald-400" strokeWidth={1.5} />
                                <span className="text-emerald-300 text-xs truncate max-w-[150px]" title={user.nome}>
                                    {user.nome}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 px-3 py-1 bg-red-900/30 border border-red-700 rounded-lg">
                                <User size={12} className="text-red-400" strokeWidth={1.5} />
                                <span className="text-red-300 text-xs">NÃO IDENTIFICADO</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
