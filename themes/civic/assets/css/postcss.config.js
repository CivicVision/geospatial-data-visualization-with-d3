var tailwindcss = require('tailwindcss');
module.exports = {
  plugins: [
    tailwindcss('./themes/civic/assets/css/tailwind.js'),
    require('autoprefixer')({
      browsers: ['>1%']
    }),
  ]
};
