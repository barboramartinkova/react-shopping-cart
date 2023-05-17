import '@testing-library/cypress/add-commands';

before(() => {
  cy.request(
    'https://react-shopping-cart-67954.firebaseio.com/products.json'
  ).then((response) => {
    cy.writeFile('cypress/fixtures/products.json', response.body);
  });
});

Cypress.Commands.add('addToCart', (product) => {
  cy.findByText(`${product}`).siblings('button').click();
});

Cypress.Commands.add('getItemInCart', (product) => {
  cy.findByRole('img', { name: `${product}` }).parent();
});

Cypress.Commands.add('getProduct', (product) => {
  cy.get('[tabindex=1]').contains(product);
});

Cypress.Commands.add('checkDisplayedProducts', (productsToCheck) => {
  productsToCheck.forEach((product) => {
    cy.getProduct(product.title).should('be.visible');
  });
});

Cypress.Commands.add('stubAndVisit', (productsToCheck) => {
  cy.intercept(
    'GET',
    'https://react-shopping-cart-67954.firebaseio.com/products.json',
    { fixture: 'products.json' }
  ).as('getProducts');
  cy.visit('/');
});

Cypress.Commands.add('checkTotalPrice', (productPrice) => {
  cy.findByRole('button', { name: 'Checkout' })
    .siblings('div')
    .should('contain', `$ ${productPrice}`);
});
