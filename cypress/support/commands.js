// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (user) => {
  cy.url().should('include', '/login');

  cy.get(".input-primary[name='account']").type(user.account);
  cy.get(".input-primary[name='password']").type(user.password);

  cy.get('.btn-primary').click();
});

Cypress.Commands.add('logout', () => {
  cy.wait(3000);
  cy.get('.icon-menu').click();
  cy.get('.btn-secondary').click();
});
