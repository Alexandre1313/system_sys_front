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
