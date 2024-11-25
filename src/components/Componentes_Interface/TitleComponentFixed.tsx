export interface TitleComponentFixedProps {
 stringOne: string
 twoPoints?: string
 stringTwo?: string
}

export default function TitleComponentFixed(props: TitleComponentFixedProps){
    return(
        <h2 className='text-blue-500 text-[14px] lg:text-lg border-b border-y-neutral-600 fixed top-0 left-0 w-full 
        text-center z-10 py-2 px-4 bg-[#111111]'>
            <strong>{props.stringOne}</strong>
            <span> {props.twoPoints} </span>
            <strong>{props.stringTwo}</strong>
        </h2>
    )
}
