import EXAMPLE from '../fixtures/example.json';

const nowTime = new Date().getTime();
const note1 = `${EXAMPLE.order.sample1.note}_${nowTime}`;
const note2 = `${EXAMPLE.order.sample2.note}_${nowTime}`;

describe('Customer', () => {
  let targetItemId = '';
  let orderId = '';

  // login
  it('Customer Login', () => {
    cy.visit('/');
    cy.login(EXAMPLE.user.customer);
    cy.logout();
  });

  // add order
  it('Customer add new order', () => {
    // login
    cy.intercept('/').as('homepage');
    cy.intercept('/list').as('orderlist');
    cy.visit('/');
    cy.login(EXAMPLE.user.customer);

    let stock = '0';

    // add oreder
    cy.wait('@homepage')
      // click item buy
      .then(() => {
        cy.wait(5000);
        const targetItem = cy.get('li.item:not(.sold-out):nth-child(1)');
        return targetItem.invoke('data', 'id');
      })
      // get item id
      .then((id) => {
        targetItemId = id;
        cy.get(`.item[data-id='${targetItemId}'] .btn-primary`).click();
        return cy.get('.alert-block .stock').invoke('data', 'stock');
      })
      // add order
      .then((stockStr) => {
        cy.get('.alert-form .count input')
          .focus()
          .type(`{selectAll}${EXAMPLE.order.sample1.count}`);
        cy.get('.alert-form .note textarea').type(note1);
        cy.get('.alert-form .btn-primary[type="submit"]').click();
        stock = (Number(stockStr) - EXAMPLE.order.sample1.count).toString();
        console.log(stock);
      })
      // check stock
      .then(() => {
        cy.wait(7000);
        cy.get(`.item[data-id='${targetItemId}'] .stock-data`).invoke('text').should('eq', stock);
      })
      // check order list
      .then(() => {
        cy.goPageByMenu('orderList');

        return cy.get('.content:last-child').invoke('data', 'id');
      })
      .then((orderIdResult) => {
        orderId = orderIdResult;
        console.log(orderId);
        cy.get(`.content[data-id='${orderId}'] .count`)
          .invoke('text')
          .should('eq', EXAMPLE.order.sample1.count.toString());
        cy.get(`.content[data-id='${orderId}'] .note`).invoke('text').should('eq', note1);
      });

    cy.logout();
  });

  // update order
  it('Customer update order', () => {
    cy.intercept('/').as('homepage');
    cy.intercept('/list').as('orderlist');
    let stock = '';
    let max = '';

    // login
    cy.visit('/');
    cy.login(EXAMPLE.user.customer);

    cy.wait('@homepage')
      // go orderlist
      .then(() => cy.goPageByMenu('orderList'))
      // get order & click update item
      .then(() => {
        cy.get(`.content[data-id='${orderId}']`).click();
        return cy.get('.alert-form .stock').invoke('data', 'stock');
      })
      // update order
      .then((stockStr) => {
        cy.get('.alert-form .count input').type(`{selectAll}${EXAMPLE.order.sample2.count}`);
        cy.get('.alert-form .note textarea').type(`{selectAll}${note2}`);
        cy.get('.alert-form .btn-primary[type="submit"]').click();
        max = stockStr;
        stock = (Number(stockStr) - EXAMPLE.order.sample2.count).toString();
      })
      // check order info
      .then(() => {
        cy.wait(7000);
        cy.get(`.content[data-id='${orderId}'] .count`)
          .invoke('text')
          .should('eq', EXAMPLE.order.sample2.count.toString());
        cy.get(`.content[data-id='${orderId}'] .note`).invoke('text').should('eq', note2);
      })
      // check max
      .then(() => {
        cy.get(`.content[data-id='${orderId}']`).click();
        cy.get('.alert-form .stock').invoke('data', 'stock').should('eq', max);
        cy.get('.alert-form .cancel').click();
      })
      // go homepage
      .then(() => cy.goPageByMenu('home'))
      // check item stock
      .then(() => {
        cy.wait(5000);
        cy.get(`.item[data-id='${targetItemId}'] .stock-data`).invoke('text').should('eq', stock);
      });

    // logout
    cy.logout();
  });
});
