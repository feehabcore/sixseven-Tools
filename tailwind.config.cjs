/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                base:    '#07090f',
                surface: '#0d1117',
                indigo:  '#6C63FF',
                cyan:    '#00D4FF',
                rose:    '#FF4D8D',
                violet:  '#9B59FF',
                emerald: '#00E5A0',
            },
            fontFamily: {
                sans:    ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif'],
                bengali: ['Li Ador Noirrit', 'Noto Sans Bengali', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.7s ease both',
                'drift':      'drift 18s ease-in-out infinite',
                'pulse-dot':  'pulse-dot 2s ease-in-out infinite',
                'spin-slow':  'spin 2s linear infinite',
            },
            keyframes: {
                fadeInUp: {
                    from: { opacity: '0', transform: 'translateY(28px)' },
                    to:   { opacity: '1', transform: 'translateY(0)' },
                },
                drift: {
                    '0%, 100%': { transform: 'translate(0,0) scale(1)' },
                    '33%':      { transform: 'translate(40px,-30px) scale(1.05)' },
                    '66%':      { transform: 'translate(-20px,20px) scale(0.96)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
