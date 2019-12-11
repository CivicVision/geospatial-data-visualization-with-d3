var tailwindcss = require('tailwindcss');
module.exports = {
  plugins: [
    tailwindcss('./themes/civic/assets/css/tailwind.config.js'),
    require('autoprefixer')({
      browsers: ['>1%']
    }),
  ]
};
