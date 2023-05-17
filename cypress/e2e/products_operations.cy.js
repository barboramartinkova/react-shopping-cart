import { sizes } from '../support/viewports';
sizes.forEach((size) => {
  describe(`basic product operations in the list and in the cart on ${size}`, () => {
    beforeEach(() => {
      cy.viewport(size);
      cy.fixture('products.json').as('data');

      cy.log('📝 **Spy on a get products request and stub it with a fixture**');
      cy.stubAndVisit('/');
      cy.wait('@getProducts');
    });

    it('can add a product into the cart and finish checkout', function () {
      const products = this.data.products;

      cy.log('📝 **Find the first product and add it to cart**');
      const productTitle = products[0].title;
      cy.addToCart(productTitle);

      cy.log('📝 **Check that product is visible in the cart**');
      cy.findByText('Cart').should('be.visible');
      cy.getItemInCart(productTitle).should('be.visible');
      const productPrice = products[0].price;
      cy.get('p').contains(`$ ${productPrice}`).should('be.visible');
      cy.checkTotalPrice(productPrice);

      cy.log('📝 **Add one quantity to the product in cart**');
      cy.findByRole('button', { name: '+' }).should('be.visible').click();
      const subtotalPrice = (productPrice * 2).toFixed(2);
      cy.checkTotalPrice(subtotalPrice);

      cy.log('📝 **Finish the checkout**');
      cy.findByRole('button', { name: 'Checkout' }).click();
      cy.on('window:alert', (str) => {
        expect(str).to.equal(`Checkout - Subtotal: $ ${subtotalPrice}`);
      });
    });

    it('can add products into the cart and remove it from the cart', function () {
      const products = this.data.products;

      cy.log('📝 **Find the first product and add it to cart**');
      const productTitle = products[0].title;
      cy.addToCart(productTitle);
      cy.findByText('Cart').should('be.visible');
      cy.getItemInCart(productTitle).should('be.visible');

      cy.log('📝 **Close the cart**');
      cy.findByRole('button', { name: 'X' }).click();
      cy.findByText('Cart').should('not.exist');

      cy.log('📝 **Add a second product to the cart**');
      const secondProduct = products[1].title;
      cy.findByText(`${secondProduct}`).siblings('button').click();
      cy.findByText('Cart').should('be.visible');
      cy.getItemInCart(secondProduct).should('be.visible');

      cy.log('📝 **Add one quantity to the second product**');
      cy.getItemInCart(secondProduct)
        .findByRole('button', { name: '+' })
        .should('be.visible')
        .click();
      cy.getItemInCart(secondProduct).should('contain', 'Quantity: 2');

      cy.log('📝 **Remove the second product from the cart**');
      cy.getItemInCart(secondProduct)
        .findByRole('button', { name: 'remove product from cart' })
        .click();
      cy.get('img').contains(`${secondProduct}`).should('not.exist');
    });

    it('can display all products and filter them on', function () {
      const products = this.data.products;

      cy.log('📝 **The products and number of products are displayed**');
      cy.findByText(`${products.length} Product(s) found`);
      cy.get('[tabindex=1]').should('have.length', products.length);
      cy.checkDisplayedProducts(products);

      cy.log(
        '📝 **Filter by size S and check the list of products displays correct products**'
      );
      const productsSizeS = products.filter((product) =>
        product.availableSizes.includes('S')
      );
      cy.findByText('S').click();
      cy.get('[tabindex=1]').should('have.length', productsSizeS.length);
      cy.findByText(`${productsSizeS.length} Product(s) found`);
      cy.checkDisplayedProducts(productsSizeS);

      cy.log(
        '📝 **Remove filter and check the list of products displays correct products**'
      );
      cy.findByText('S').click();
      cy.findByText(`${products.length} Product(s) found`);
      cy.get('[tabindex=1]').should('have.length', products.length);
    });
  });
});
