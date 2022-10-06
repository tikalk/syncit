const { createGlobPatternsForDependencies } = require("@nrwl/react/tailwind");
const { join } = require("path");

module.exports = {
  content: [
    join(__dirname, "{pages,components,sections}/**/*!(*.stories|*.spec).{ts,tsx,html}"),
    ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {}
  },
  daisyui: {
    themes: [
      {
        master: {
          "primary": "#ff0000",
          "secondary": "#F000B8",
          "accent": "#37CDBE",
          "neutral": "#3D4451",
          "base-100": "#FFFFFF",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272"
        }
      },
      "dark"
    ]
  },
  plugins: [require("daisyui")]
};
