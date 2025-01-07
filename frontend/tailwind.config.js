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
        // Added new colors from uploaded image
        mutedPalette: {
          mutedBlue: "#7D91B1", 
      
          sageGreen: "#B7B295",
        
          beige: "#F0E4D3",
        
          dustyMauve: "#B9A9AC", 
        
          softTan: "#E2C3A5", 
        },
        primaryGreen: {
          light: "#d4e9d7", // Light green
          DEFAULT: "#4CAF50", // Green
          dark: "#2E7D32", // Dark green
        },
        primaryBrown: {
          light: "#e7d9c4", // Light brown
          DEFAULT: "#a07451", // Brown
          dark: "#6a4f36", // Dark brown
        },
      },
    },
  },
  plugins: [],
};