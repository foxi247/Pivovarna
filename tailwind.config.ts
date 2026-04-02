import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // === Публичный сайт: тёмная тема ===
        brewery: {
          'bg-primary': '#0F0D0A',
          'bg-secondary': '#1A1712',
          'bg-card': '#231F1A',
          'bg-surface': '#2E2820',
          'amber-primary': '#C8873A',
          'amber-light': '#E8A855',
          'amber-dark': '#A06828',
          'text-primary': '#F5EFE6',
          'text-secondary': '#B8A898',
          'text-muted': '#7A6C5E',
          border: '#3D352B',
          'border-light': '#4D4438',
        },
        // === Админка: светлая нейтральная тема ===
        admin: {
          bg: '#FAFAF9',
          surface: '#FFFFFF',
          border: '#E5E3DF',
          text: '#1C1917',
          'text-muted': '#78716C',
          primary: '#292524',
          'primary-hover': '#1C1917',
        },
        // shadcn/ui CSS variables
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        serif: ['var(--font-playfair)', ...fontFamily.serif],
        display: ['var(--font-playfair)', ...fontFamily.serif],
      },
      fontSize: {
        'display-2xl': ['clamp(3.5rem, 8vw, 6rem)', { lineHeight: '1.05', fontWeight: '700' }],
        'display-xl': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.08', fontWeight: '700' }],
        'display-lg': ['clamp(2rem, 3.5vw, 3.25rem)', { lineHeight: '1.1', fontWeight: '700' }],
        'display-md': ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.2', fontWeight: '600' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
      },
      backgroundImage: {
        'amber-glow': 'radial-gradient(ellipse at center, rgba(200,135,58,0.15) 0%, transparent 70%)',
        'hero-gradient': 'linear-gradient(to bottom, rgba(15,13,10,0) 0%, rgba(15,13,10,0.6) 50%, rgba(15,13,10,0.95) 100%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)',
      },
      boxShadow: {
        'amber': '0 0 40px rgba(200,135,58,0.15)',
        'amber-lg': '0 0 80px rgba(200,135,58,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(200,135,58,0.2), 0 4px 20px rgba(0,0,0,0.4)',
        'admin': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'admin-md': '0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.07)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
