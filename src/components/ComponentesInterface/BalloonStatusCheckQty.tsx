import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'react-feather';

interface BalloonStatusCheckQtyProps {
  n1: number | undefined;
  n2: number | undefined;
}

export default function BalloonStatusCheckQty({ n1, n2 }: BalloonStatusCheckQtyProps) {
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
                   rounded-lg px-1 py-1"
        style={{
          boxShadow: '0 2px 4px rgba(0,0,0,0.35), 0 8px 16px rgba(0,0,0,0.45)',
        }}
      >
        {/* CONTEÚDO COM ANIMAÇÃO */}
        <AnimatePresence mode="wait">
          {n1 === n2 ? (
            <motion.span
              key="alert"
              layout
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <CheckCircle size={20} strokeWidth={2} className="text-green-500" />
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
              <AlertTriangle size={20} strokeWidth={2} className="text-orange-400" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
