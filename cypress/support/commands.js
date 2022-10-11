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
import { ZERO_COUNT, NO_COUNT } from '../utils/enum';

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

Cypress.Commands.add('goPageByMenu', (page) => {
  const menuLiIdx = {
    home: 1,
    orderList: 2,
  };
  cy.wait(3000);
  cy.get('.icon-menu').click();
  cy.get(`.router li:nth-child(${menuLiIdx[page]})`).click();
});

// customer update order template
Cypress.Commands.add('updateOrder', ({ countNum, note, targetItemId, orderId }) => {
  let stock = '';
  let max = '';
  let count = 0;

  // open order edit alert
  cy.get(`.content[data-id='${orderId}']`).click();
  // get stock
  cy.get('.alert-form .stock')
    .invoke('data', 'stock')
    // update order
    .then((stockStr) => {
      count = countNum === NO_COUNT ? Number(stockStr) : countNum;
      console.log(count);
      cy.get('.alert-form .count input').type(`{selectAll}${count}`);
      cy.get('.alert-form .note textarea').type(`{selectAll}${note}`);
      cy.get('.alert-form .btn-primary[type="submit"]').click();
      max = stockStr;
      stock = (Number(stockStr) - count).toString();
    })
    // check order info
    .then(() => {
      cy.wait(7000);
      cy.get(`.content[data-id='${orderId}'] .count`).invoke('text').should('eq', count.toString());
      cy.get(`.content[data-id='${orderId}'] .note`).invoke('text').should('eq', note);
    })
    // check max
    .then(() => {
      cy.get(`.content[data-id='${orderId}']`).click();
      cy.get('.alert-form .stock').invoke('data', 'stock').should('eq', max);
      cy.get('.alert-form .cancel').click();
    })
    // go homepage
    .then(() => cy.goPageByMenu('home'))
    // check item stock & sold-out class
    .then(() => {
      cy.wait(5000);
      cy.get(`.item[data-id='${targetItemId}'] .stock-data`).invoke('text').should('eq', stock);
      if (Number(stock) === ZERO_COUNT) {
        cy.get(`.item[data-id='${targetItemId}']`).should('have.class', 'sold-out');
      }
    });
});
