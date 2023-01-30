module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e9f5fb",
          100: "#deedf9",
          200: "#bbdcda",
          700: "#009df6",
          800: "#007abf",
          900: "#006ca9",
          dark: "#03a9f4",
        },
        dark: {
          100: "e5e7eb",
          800: "#1e293b",
          900: "#0f172a",
          border: "#03a9f4",
        },
        accent: {
          400: "#FEF0E0",
          800: "#F79121",
          900: "#B76103",
        },
      },
      backgroundImage: {
        "hero-pattern": "url('./assets/HomepageImage2.jpg')",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
