export default interface TitleComponentProps {
    title: string;
}

export default function TitleComponent(props: TitleComponent){
    return (
        <h1 className='text-3xl lg:text-5xl font-medium tracking-[1px] pb-1 text-slate-600'>{props.title}</h1>
    )
}
