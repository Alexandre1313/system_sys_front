import { Loader } from "react-feather";

export default function IsLoading(){
    return <div className="flex flex-col w-full min-h-[95vh] items-center justify-center text-2xl gap-y-2">       
        <Loader size={40} className={`animate-rotate2`} color={`rgba(193, 254, 187, 0.4)`}/>
        Carregando...
    </div>;
}
