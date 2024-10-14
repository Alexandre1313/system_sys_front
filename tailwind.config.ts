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
          justifyContent: 'flex-start'
        },

        '.flexRRC': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        },
      
        '.button': {
        
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
