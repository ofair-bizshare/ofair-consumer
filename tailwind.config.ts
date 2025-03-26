
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
                teal: {
                    DEFAULT: '#00D09E',
                    50: '#E6FAF6',
                    100: '#CCF6ED',
                    200: '#99ECDB',
                    300: '#66E3C8',
                    400: '#33D9B6',
                    500: '#00D09E',
                    600: '#00A67E',
                    700: '#007D5F',
                    800: '#00533F',
                    900: '#002A20',
                },
                blue: {
                    DEFAULT: '#00327B',
                    50: '#E6EDF7',
                    100: '#CCDBEE',
                    200: '#99B8DE',
                    300: '#6694CD',
                    400: '#3371BD',
                    500: '#004DAD',
                    600: '#003E8A',
                    700: '#00327B',
                    800: '#00215F',
                    900: '#00112F',
                },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' }
                },
                'fade-in-up': {
                    from: { 
                        opacity: '0',
                        transform: 'translateY(20px)'
                    },
                    to: { 
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                'fade-in-down': {
                    from: { 
                        opacity: '0',
                        transform: 'translateY(-20px)'
                    },
                    to: { 
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                'slide-in-right': {
                    from: { 
                        transform: 'translateX(-20px)',
                        opacity: '0'
                    },
                    to: { 
                        transform: 'translateX(0)',
                        opacity: '1'
                    }
                },
                'slide-in-left': {
                    from: { 
                        transform: 'translateX(20px)',
                        opacity: '0'
                    },
                    to: { 
                        transform: 'translateX(0)',
                        opacity: '1'
                    }
                },
                'pulse-subtle': {
                    '0%, 100%': {
                        opacity: '1'
                    },
                    '50%': {
                        opacity: '0.8'
                    }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'fade-in-up': 'fade-in-up 0.6s ease-out',
                'fade-in-down': 'fade-in-down 0.6s ease-out',
                'slide-in-right': 'slide-in-right 0.4s ease-out',
                'slide-in-left': 'slide-in-left 0.4s ease-out',
                'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
