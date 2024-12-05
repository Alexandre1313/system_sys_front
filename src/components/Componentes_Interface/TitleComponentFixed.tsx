'use client'

import Link from "next/link";
import { ChevronsLeft } from "react-feather";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface TitleComponentFixedProps {
    stringOne: string;
    twoPoints?: string;
    stringTwo?: string;
}

export default function TitleComponentFixed(props: TitleComponentFixedProps) {
    const { logout } = useAuth();
    const router = useRouter();
    const [ isClient, setIsClient ] = useState<boolean>(false);

    useEffect(() => { setIsClient(true)}, []);

    const handlerLogout = () => {       
        if(isClient){
            logout()
            router.push('/login')
        }
    }

    return (
        <div className={`fixed top-0 left-0 w-full flex border-b border-y-neutral-600  
                    z-10 py-2 px-4 bg-[#111111] justify-center items-center`}>
            <div className={`flex w-[10%] justify-start items-center`}>
                <Link href={'/'}>
                    <ChevronsLeft className="animate-bounceXL" size={18} color={'#fff'} strokeWidth={2} />
                </Link>
            </div>
            <div className={`flex w-[80%] justify-center items-center`}>
                <h2 className='text-blue-500 text-[14px] lg:text-lg'>
                    <strong>{props.stringOne}</strong>
                    <span> {props.twoPoints} </span>
                    <strong>{props.stringTwo}</strong>
                </h2>
            </div>
            <div className={`flex w-[10%] justify-center items-center`}>
                <button 
                    type={`button`}
                    onClick={handlerLogout}
                    className={`text-[10px] text-zinc-600 flex items-center justify-center border px-3 py-1
                               border-zinc-600 rounded-md hover:bg-zinc-600 hover:text-white transition duration-500`}>
                    LOGOUT
                </button>
            </div>
        </div>
    )
}
