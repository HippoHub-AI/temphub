/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        PlusJakartaSans: ["PlusJakartaSans", "sans-serif"],
      },
      boxShadow: {
        custom: "0px 17px 40px 4px #7090B01C",
        "custom-dark": " 14px 27px 45px 4px #7090B033",
      },
    },
    keyframes: {
      typewriter: {
        "0%": { width: "0" }, // Start typing
        "100%": { width: "100%" }, // Complete typing within container width
      },
    },
    animation: {
      typewriter: "typewriter 3s steps(70) forwards", // Use "end" for smoother steps
    },
  },
  plugins: [],
};
