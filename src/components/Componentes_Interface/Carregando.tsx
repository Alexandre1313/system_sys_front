'use client';

export interface CarregandoProps {
    quantidade: number
}

export default function Carregando(props: CarregandoProps) {
    const skeletonItem = () => (
        <div className="flex flex-col items-center border rounded-lg border-gray-800 max-w-[300px] lg:max-w-[300px] 
            min-h-[390px] lg:min-h-[400px] shadow animate-pulse w-full"> 
            {/* Skeleton para a imagem */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-52 w-full rounded-lg" />

            {/* Skeleton para as descrições */}
            <div className="flex flex-col items-center gap-y-3 p-5 lg:p-4 pt-6 w-full">
                {/* Skeleton para o título do projeto */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-8 w-3/4 rounded" /> {/* Título do projeto */}
                
                {/* Skeleton para a descrição */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-5 w-5/6 rounded" /> {/* Descrição */}
                
                {/* Skeleton para a data de cadastro */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-5 w-2/3 rounded" /> {/* Data de cadastro */}
                
                {/* Skeleton para a data de modificação */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-5 w-1/2 rounded" /> {/* Data de modificação */}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-10 w-full max-w-[980px] justify-items-center"> 
            {Array.from({ length: props.quantidade }).map((_, index) => (
                <div key={index} className="w-full">                    
                    {skeletonItem()}
                </div>
            ))}
        </div>
    );
}
