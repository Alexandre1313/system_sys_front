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
        <div className={`fixed top-0 left-0 w-full flex border-b border-y-neutral-600  
                    z-20 py-2 px-4 bg-[#182e23] justify-center items-center`}>
            <div className={`flex w-[7%] justify-start items-center`}>
                <Link href={'/'}>
                    <ChevronsLeft className="animate-bounceXL" size={25} color={'#fff'} strokeWidth={2} />
                </Link>
            </div>
            <div className={`flex w-[86%] justify-center items-center gap-x-5`}>
                <div className='text-{#f7f7f7} text-[12px] lg:text-lg'>
                    <span className={`text-slate-200 text-[12px] lg:text-lg`}>{props.stringOne}</span>
                    <span className={`text-slate-200 text-[12px] lg:text-lg`}> {props.twoPoints} </span>
                    <span className={`text-slate-200 text-[12px] lg:text-lg`}>{props.stringTwo}</span>
                </div>
                {user && (
                    <div className='flex text-{#f7f7f7} border-l pl-5 border-zinc-600 text-[12px] lg:text-lg gap-x-3 justify-start'>
                        <UserCheck strokeWidth={1} color={`#00ffbf`} />
                        <span className={`text-slate-400 text-[12px] lg:text-lg`}>{user.nome}</span>
                    </div>
                )}
                {!user && (
                    <div className='flex text-{#FF073A} border-l pl-5 border-zinc-600 text-[12px] lg:text-lg gap-x-3 justify-start'>
                        <User strokeWidth={1} color={`#00ffbf`} />
                        <span className={`text-slate-400 text-[12px] lg:text-lg`}>{'NÃO IDENTIFICADO'}</span>
                    </div>
                )}
            </div>
            <div className={`flex lg:w-[7%] justify-center items-center`}>
                <button
                    type={`button`}
                    onClick={handlerLogout}
                    className={`lg:text-[11px] text-[10px] text-zinc-600 flex items-center justify-center border lg:px-3 px-1 lg:py-1 pv-[2px]
                               border-zinc-600 rounded-md hover:bg-zinc-600 hover:text-white transition duration-500`}>
                    LOGOUT
                </button>
            </div>
        </div>
    )
}
