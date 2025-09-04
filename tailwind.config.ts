import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  safelist: [
    'bg-slate-200',
    'bg-emerald-700',
    'bg-cyan-700',
    'bg-red-700',
    'bg-orange-600',
    'bg-emerald-900/30',
    'bg-cyan-900/30',
    'bg-red-900/30',
    'bg-slate-900/30',
    'bg-orange-900/30',
    'border-emerald-700',
    'border-cyan-700',
    'border-red-700',
    'border-slate-700',
    'border-orange-700',
    'hover:bg-emerald-700/50',
    'hover:border-emerald-500/30',
    'hover:bg-cyan-700/50',
    'hover:border-cyan-500/30',
    'hover:bg-slate-700/50',
    'hover:border-slate-500/30',
    'hover:bg-red-700/50',
    'hover:border-red-500/30',
    'hover:bg-orange-700/50',
    'hover:border-orange-500/30',
    'Border'
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        custonWhite: "rgba(217, 219, 224, 1)",
        trans: "rgba(0, 0, 0, 0)",
      },
    },

    animation: {
      bounceX: 'bounceX 1s ease-in-out infinite',  // Animação vai e vem horizontal
      bounceXL: 'bounceX 1s ease-in-out infinite',  // Animação vai e vem horizontal
      bounceY: 'bounceY 2s ease-in-out infinite',  // Animação vai e vem vertical
      bounceYEfect: 'bounceYEfect 1s ease-in-out',  // Animação vai e vem vertical
      rotate: 'rotate 1s linear infinite', // Duração de 1 segundo, animação linear e infinita
      rotate2: 'rotate 1.5s linear infinite', // Duração de 0.7sec segundos, animação linear e infinita
      jump: 'jump 1.5s ease-in-out infinite',
      shake: 'shake 1.4s ease-in-out', 'shake-periodic': 'shake 1.4s ease-in-out infinite alternate', 'shake-loop': 'shakeTwo 4s ease-in-out infinite',
    },

    keyframes: {
      jump: {
        '0%, 100%': { transform: 'translateY(0)' },
        '10%': { transform: 'translateY(0)' },
        '20%': { transform: 'translateY(0)' },
        '30%': { transform: 'translateY(0)' },
        '40%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-20px)' },
        '60%': { transform: 'translateY(0)' },
        '70%': { transform: 'translateY(-40px)' },
        '80%': { transform: 'translateY(0)' },
        '90%': { transform: 'translateY(0)' },
      },

      shakeTwo: {
        '0%': { transform: 'translateX(0)' },
        '2%': { transform: 'translateX(-2px)' },
        '4%': { transform: 'translateX(2px)' },
        '6%': { transform: 'translateX(-2px)' },
        '8%': { transform: 'translateX(2px)' },
        '10%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(0)' },
      },

      shake: {
        '0%, 100%': { transform: 'translateX(0)' },
        '20%': { transform: 'translateX(-2px)' },
        '40%': { transform: 'translateX(2px)' },
        '60%': { transform: 'translateX(-2px)' },
        '80%': { transform: 'translateX(2px)' },
      },

      bounceX: {
        '0%, 100%': { transform: 'translateX(0)' },  // No início e no fim, fica na posição inicial
        '50%': { transform: 'translateX(5px)' },   // No meio do ciclo, move 100px para a direita
      },

      bounceXL: {
        '0%, 100%': { transform: 'translateX(0)' },  // No início e no fim, fica na posição inicial
        '50%': { transform: 'translateX(-5px)' },   // No meio do ciclo, move 100px para a direita
      },

      bounceY: {
        '0%, 100%': { transform: 'translateY(0)' },  // No início e no fim, fica na posição inicial
        '50%': { transform: 'translateY(3px)' },   // No meio do ciclo, move 100px para baixo
      },

      bounceYEfect: {
        '0%': { transform: 'translateY(-10px)' },
        '100%': { transform: 'translateY(0)' },
      },

      rotate: {
        '0%': { transform: 'rotate(0deg)' },  // No início
        '100%': { transform: 'rotate(-360deg)' },  // No fim, faz a rotação completa
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.btn-grad': {
          backgroundImage: 'linear-gradient(to right, #348F50 0%, #56B4D3 51%, #348F50 100%)',
          transition: 'background-position 0.4s ease-in-out',
          backgroundSize: '200% 100%',
        },
        '.btn-grad:hover': {
          backgroundPosition: 'right center',
        },
        '.bleft-1': {
          borderLeft: '4.2em',
        },
        '.no-arrow': {
          appearance: 'none',
        },
        '.flexColCC': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        },

        '.flexColCS': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%'
        },

        '.flexRRC': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        },

        '.shadow-green': {
          boxShadow: '0 4px 6px rgba(13, 198, 129, 0.1)',
        },

        '.flexRRFE': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%'
        },

        '.shadow': {
          boxShadow: '15px 15px 30px 5px rgba(0, 0, 0, 0.75)'
        },

        '.bghover': {
          backgroundColor: 'rgba(13, 198, 129, 0.015)'
        },

        '.input': {

        }
      };

      // Adiciona os utilitários
      addUtilities(newUtilities, {
        respectPrefix: false, // Isso adiciona as classes diretamente, sem prefixo
        respectImportant: false, // Ignora a regra !important
      });
    }),
  ],
};
export default config;
