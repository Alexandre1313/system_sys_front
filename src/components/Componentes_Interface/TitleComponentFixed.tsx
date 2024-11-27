import Link from "next/link"
import { ChevronsLeft } from "react-feather"

export interface TitleComponentFixedProps {
    stringOne: string
    twoPoints?: string
    stringTwo?: string
}

export default function TitleComponentFixed(props: TitleComponentFixedProps) {
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
            <div className={`flex w-[10%] justify-end items-center`}>
            </div>
        </div>
    )
}
