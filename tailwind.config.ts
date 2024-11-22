import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
    },
    keyframes: {
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
