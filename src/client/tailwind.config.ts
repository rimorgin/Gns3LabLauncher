import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        "95p": "95%",
      },
      backgroundImage: {
        // Define gradients with custom angles here if needed
        // Example: 'bg-gradient-45': 'linear-gradient(45deg, var(--tw-gradient-stops))'
      },
      animation: {
        "fade-in-scale": "fadeInScale 0.3s ease-out",
      },
      keyframes: {
        fadeInScale: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      console.log("plugin loaded");
      matchUtilities(
        {
          "bg-gradient": (angle) => ({
            "background-image": `linear-gradient(${angle}, var(--tw-gradient-stops))`,
          }),
        },
        {
          values: Object.assign(theme("bgGradientDeg", {}), {
            10: "10deg",
            15: "15deg",
            20: "20deg",
            25: "25deg",
            30: "30deg",
            45: "45deg",
            60: "60deg",
            90: "90deg",
            120: "120deg",
            135: "135deg",
          }),
        },
      );
    }),
  ],
};

export default config;
