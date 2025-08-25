import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        //backgroundImage: "url('/bg3.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-2 lg:gap-8 row-start-2 items-center sm:items-center justify-center">
          <h1 className={`flex text-[20px] font-semi-bold text-emerald-600 lg:text-[50px]`}>
            <strong className={`flex lg:text-[120px] text-[50px] font-normal text-emerald-600 lg:-mt-[4.7rem] -mt-8 pr-3 lg:pr-8`}>
              SYS
            </strong>
            <strong className={`flex lg:text-[120px] text-[50px] font-semi-bold text-blue-600 lg:-mt-[4.8rem] -mt-[1.99rem]`}>
              E
            </strong>
            XPED
            <strong className={`text-orange-600 flex lg:-mt-32 -mt-16 lg:text-[120px] text-[60px] animate-jump`}>
              <Image src={`/box2lines.png`} height={100} width={180} alt={`image box`} loading="eager"/>
            </strong>
          </h1>
          <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2">
              Systems{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              </code>
            </li>
          </ol>
          <div className="flex gap-2 lg:gap-4 items-center flex-row flex-wrap justify-center">
            <Link href={'/projetos'} legacyBehavior>
              <a
                className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-[9px] lg:text-[13px] h-7 lg:h-8 px-3 lg:px-5 lg:min-w-40 min-w-[130px]"
                href=""
                target=""
                rel="noopener noreferrer"
              >
                EXPEDIÇÃO...
              </a>
            </Link>
            <Link href={'/entradas_embalagem'} legacyBehavior>
              <a
                className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-[9px] lg:text-[13px] h-7 lg:h-8 px-3 lg:px-5 lg:min-w-40 min-w-[130px]"
                href=""
                target=""
                rel="noopener noreferrer"
              >
                EMBALAGEM...
              </a>
            </Link>
            <Link href={'/romaneios_despacho'} legacyBehavior>
              <a
                className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-[9px] lg:text-[13px] h-7 lg:h-8 px-3 lg:px-5 lg:min-w-40 min-w-[130px]"
                href=""
                target=""
                rel="noopener noreferrer"
              >
                DESPACHO...
              </a>
            </Link>
            <Link href={'/estoques'} legacyBehavior>
              <a
                className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-[9px] lg:text-[13px] h-7 lg:h-8 px-3 lg:px-5 lg:min-w-40 min-w-[130px]"
                href=""
                target=""
                rel="noopener noreferrer"
              >
                MOVIMENTAÇÕES...
              </a>
            </Link>
          </div>
          <div className="flex gap-2 lg:gap-4  items-center flex-row flex-wrap justify-center">
            <Link href={'/rankingusers'} legacyBehavior>
              <a
                className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-[9px] lg:text-[13px] h-7 lg:h-8 px-3 lg:px-5 lg:min-w-40 min-w-[130px]"
                href=""
                target=""
                rel="noopener noreferrer"
              >
                RANKING...
              </a>
            </Link>
            <Link href={'/resume2'} legacyBehavior>
              <a
                className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-[9px] lg:text-[13px] h-7 lg:h-8 px-3 lg:px-5 lg:min-w-40 min-w-[130px]"
                href=""
                target=""
                rel="noopener noreferrer"
              >
                RESUMOS TWO...
              </a>
            </Link>
            <Link href={'/graf'} legacyBehavior>
              <a
                className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-[9px] lg:text-[13px] h-7 lg:h-8 px-3 lg:px-5 lg:min-w-40 min-w-[130px]"
                href=""
                target=""
                rel="noopener noreferrer"
              >
                GRÁFICO...
              </a>
            </Link>
            <Link href={'/caixas_por_grade_m'} legacyBehavior>
              <a
                className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-[9px] lg:text-[13px] h-7 lg:h-8 px-3 lg:px-5 lg:min-w-40 min-w-[130px]"
                href=""
                target=""
                rel="noopener noreferrer"
              >
                ET. U P/ GRADE
              </a>
            </Link>
          </div>
        </main>
        <footer className="row-start-3 items-center lg:justify-center justify-center">
          <div className={`row-start-3 flex gap-6 flex-wrap items-center justify-center`}>
            <Link href={'/entradas_embalagem'} legacyBehavior>
              <a
                className="flex items-center lg:text-[13px] text-[8px] gap-2 hover:underline hover:underline-offset-4"
                href=""
                target=""
                rel="noopener noreferrer"
              >
                Run Packages →
              </a>
            </Link>
            <Link href={'/consulta_grades'} legacyBehavior>
              <a
                className="flex items-center lg:text-[13px] text-[8px] gap-2 hover:underline hover:underline-offset-4"
                href=""
                target=""
                rel="noopener noreferrer"
              >
                Run query grids →
              </a>
            </Link>
            <Link href={'/resumepp'} legacyBehavior>
              <a
                className="flex button items-center lg:text-[13px] text-[8px] gap-2 hover:underline hover:underline-offset-4"
                href=""
                target=""
                rel="noopener noreferrer"
              >
                Run Resumes PP →
              </a>
            </Link>
            <Link href={'/resume'} legacyBehavior>
              <a
                className="flex button items-center lg:text-[13px] text-[8px] gap-2 hover:underline hover:underline-offset-4"
                href=""
                target=""
                rel="noopener noreferrer"
              >
                Run Resumes Old →
              </a>
            </Link>
          </div>
          <div className={`row-start-3 flex gap-6 flex-wrap lg:text-[17px] text-[8px] items-center justify-center pt-14 text-zinc-300`}>
            © {new Date().getFullYear()} - {`SYS Exped`} - All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
