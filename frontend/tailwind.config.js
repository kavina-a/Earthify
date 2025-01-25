/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Ensure it scans all React files
  theme: {
    extend: {
      colors: {
        greenPalette: {
          beigeBrown: "#A67B5C",
          lightBeige: "#C8B282",
          beige: "#D0C59A",
          greenishBeige: "#6D9775",
          deepGreen: "#417154",
          darkGreen: "#104730",
        },
        mutedPalette: {
          mutedBlue: "#7D91B1", 
          sageGreen: "#B7B295",
          beige: "#F0E4D3",
          dustyMauve: "#B9A9AC", 
          softTan: "#E2C3A5", 
        },
        earthTone: {
          oliveGreen: "#556B2F",
          charcoalGray: "#333333",
          terracotta: "#E07A5F",
          sandstoneBeige: "#D2B48C",
          creamyWhite: "#FAF3E0",
          clayBrown: "#A0522D",
          forestGreen: "#2E8B57",
          rustRed: "#8B4513",
          stoneGray: "#A9A9A9",
          goldenrod: "#DAA520",
        },
      },
    },
  },
  plugins: [],
};