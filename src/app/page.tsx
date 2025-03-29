import Link from "next/link";
//import { useEffect } from "react";

export default function Home() {

  /*useEffect(() => {
    // Este código é para garantir que a imagem de fundo seja aplicada corretamente
    document.body.style.backgroundImage = "url('/background.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    return () => {
      // Limpa o estilo ao sair da página
      document.body.style.backgroundImage = "none";
    };
  }, []);*/

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <h1 className={`flex text-[50px] font-semi-bold text-emerald-600`}>
          <strong className={`flex text-[120px] font-normal text-emerald-600 -mt-20 pr-8`}>
            SYS
          </strong>
          <strong className={`flex text-[120px] font-semi-bold text-blue-600 -mt-[4.8rem]`}>
            E
          </strong>
          XPED
          <strong className={`text-orange-600 flex -mt-32 text-[120px] animate-jump`}>
            .
          </strong>
        </h1>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Systems{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
            </code>
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href={'/projetos'} legacyBehavior>
            <a
              className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-[12px] h-10 sm:h-8 px-4 sm:px-5 sm:min-w-40"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              EXPEDIÇÃO...
            </a>
          </Link>
          <Link href={'/entradas_embalagem'} legacyBehavior>
            <a
              className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-[12px] h-10 sm:h-8 px-4 sm:px-5 sm:min-w-40"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              EMBALAGEM...
            </a>
          </Link>
          <Link href={'/romaneios_despacho'} legacyBehavior>
            <a
              className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-[12px] h-10 sm:h-8 px-4 sm:px-5 sm:min-w-40"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              DESPACHO...
            </a>
          </Link>
          <Link href={'/estoques'} legacyBehavior>
            <a
              className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-[12px] h-10 sm:h-8 px-4 sm:px-5 sm:min-w-40"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              MOVIMENTAÇÕES...
            </a>
          </Link>
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href={'/consulta_grades'} legacyBehavior>
            <a
              className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-[12px] h-10 sm:h-8 px-4 sm:px-5 sm:min-w-40"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              GRADES EXPED...
            </a>
          </Link>
          <Link href={'/resume'} legacyBehavior>
            <a
              className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-[12px] h-10 sm:h-8 px-4 sm:px-5 sm:min-w-40"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              RESUMOS...
            </a>
          </Link>
          <Link href={'/graf'} legacyBehavior>
            <a
              className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-[12px] h-10 sm:h-8 px-4 sm:px-5 sm:min-w-40"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              GRÁFICO...
            </a>
          </Link>
          <Link href={'/'} legacyBehavior>
            <a
              className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-[12px] h-10 sm:h-8 px-4 sm:px-5 sm:min-w-40"
              href=""
              target=""
              rel="noopener noreferrer"
            >
            </a>
          </Link>
        </div>
      </main>
      <footer className="row-start-3 items-center justify-center">
        <div className={`row-start-3 flex gap-6 flex-wrap items-center justify-center`}>
          <Link href={'/entradas_embalagem'} legacyBehavior>
            <a
              className="flex items-center text-[13px] gap-2 hover:underline hover:underline-offset-4"
              href=""
              target=""
              rel="noopener noreferrer"
            >             
              Run Packages →
            </a>
          </Link>
          <Link href={'/romaneios_despacho'} legacyBehavior>
            <a
              className="flex items-center text-[13px] gap-2 hover:underline hover:underline-offset-4"
              href=""
              target=""
              rel="noopener noreferrer"
            >              
              Run Shipping Manifests →
            </a>
          </Link>
          <Link href={'/projetos'} legacyBehavior>
            <a
              className="flex button items-center text-[13px] gap-2 hover:underline hover:underline-offset-4"
              href=""
              target=""
              rel="noopener noreferrer"
            >              
              Run Projects →
            </a>
          </Link>
          <Link href={'/resume'} legacyBehavior>
            <a
              className="flex button items-center text-[13px] gap-2 hover:underline hover:underline-offset-4"
              href=""
              target=""
              rel="noopener noreferrer"
            >              
              Run Resumes →
            </a>
          </Link>
        </div>
        <div className={`row-start-3 flex gap-6 flex-wrap text-[17px] items-center justify-center pt-14 text-zinc-600`}>
          © {new Date().getFullYear()} - {`SYS Exped`} - All rights reserved.
        </div>
      </footer>
    </div>
  );
}
