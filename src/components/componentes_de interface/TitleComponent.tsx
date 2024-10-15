export default interface TitleComponentProps {
    title: string;
}

export default function TitleComponent(props: TitleComponent){
    return (
        <h1 className='text-3xl lg:text-5xl font-extrabold tracking-[1px]'>{props.title}</h1>
    )
}
