import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'react-feather';

interface BalloonStatusProps {
  temCaixasParaGerar: boolean;
}

export default function BalloonStatus({ temCaixasParaGerar }: BalloonStatusProps) {
  const BG = 'rgb(15 23 42)';
  const BORDER = 'rgb(51 65 85)';

  return (
    <div className="relative inline-flex -mt-4">

      {/* BALÃO COM ANIMAÇÃO DE LAYOUT */}
      <motion.div
        layout
        transition={{
          layout: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1], // easeOutCubic (profissional)
          },
        }}
        className="relative flex items-center gap-2
                   bg-slate-900 border border-slate-700
                   rounded-lg px-3 py-2"
        style={{
          boxShadow: '0 2px 4px rgba(0,0,0,0.35), 0 8px 16px rgba(0,0,0,0.45)',
        }}
      >
        {/* CONTEÚDO COM ANIMAÇÃO */}
        <AnimatePresence mode="wait">
          {temCaixasParaGerar ? (
            <motion.span
              key="alert"
              layout
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-white text-sm font-semibold opacity-70">
                Atenção! Caixa em aberto
              </span>
              <AlertTriangle size={26} strokeWidth={2} className="text-orange-400" />
            </motion.span>
          ) : (
            <motion.span
              key="ok"
              layout
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-white text-sm font-semibold opacity-70">
                Ok
              </span>
              <CheckCircle size={26} strokeWidth={2} className="text-green-500" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* RECORTE DA BORDA */}
        <span
          className="absolute -bottom-[1px]"
          style={{
            left: '18px',
            width: '24px',
            height: '3px',
            backgroundColor: BG,
          }}
        />
      </motion.div>

      {/* BICO */}
      <svg
        width="25"
        height="18"
        viewBox="0 0 24 18"
        className="absolute -bottom-[16px]"
        style={{ left: '19px' }}
      >
        <path
          d="
            M0 2
            Q6 2, 12 10
            Q18 2, 24 2
            L24 4
            Q18 4, 12 14
            Q6 4, 0 4
            Z
          "
          fill={BG}
          stroke={BORDER}
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
      </svg>

    </div>
  );
}
