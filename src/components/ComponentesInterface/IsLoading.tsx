import { Loader } from "react-feather";

interface IsLoadingProps {
    color?: boolean;
}

export default function IsLoading({ color }: IsLoadingProps){
    const colors = color ? `rgba(0, 0, 0, 1)`: `rgba(193, 254, 187, 0.4)`;
    const colorsText = color ? `text-slate-900`: `text-slate-300`;

    return <div className={`flex flex-col w-full min-h-[95vh] items-center justify-center text-2xl gap-y-2 ${colorsText}`}>       
        <Loader size={40} className={`animate-rotate2`} color={colors}/>
        Carregando...
    </div>;
}
