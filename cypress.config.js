const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://react-shopping-cart-67954.firebaseapp.com',
  },
});
