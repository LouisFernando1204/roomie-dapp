const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FFC300",
        complementary: "#3000ff",
        darkOrange: "#ff8c00",
        brightYellow: "#ffdd00",
        darkYellow: "#e6c200",
        coral: "#ff5733",
        skyBlue: "#00b4d8",
        almostBlack: "#1a1a1a",
        lightGray: "#f5f5f5",
        secondary: "#F8F9FA",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      animation: {
        blink: "blink 1.5s infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 0.2 },
          "50%": { opacity: 1 },
        },
      }
    },
  },
  plugins: [addVariablesForColors,
    require("flowbite/plugin")
  ],
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
