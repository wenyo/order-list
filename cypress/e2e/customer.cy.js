import EXAMPLE from '../fixtures/example.json';
import { NO_COUNT } from '../utils/enum';

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

  // normal - update order
  it('Normal update order template', () => {
    cy.intercept('/').as('homepage');
    cy.intercept('/list').as('orderlist');

    // login
    cy.visit('/');
    cy.login(EXAMPLE.user.customer);

    cy.wait('@homepage')
      // go orderlist
      .then(() => cy.goPageByMenu('orderList'))
      .then(() => {
        cy.wait(5000);
        cy.updateOrder({
          countNum: EXAMPLE.order.sample2.count,
          note: note1,
          targetItemId,
          orderId,
        });
      });

    // logout
    cy.logout();
  });

  // Sold Out - update order
  it('Sold Out update order template', () => {
    cy.intercept('/').as('homepage');
    cy.intercept('/list').as('orderlist');

    // login
    cy.visit('/');
    cy.login(EXAMPLE.user.customer);

    cy.wait('@homepage')
      // go orderlist
      .then(() => cy.goPageByMenu('orderList'))
      .then(() => {
        cy.wait(5000);
        cy.updateOrder({
          countNum: NO_COUNT,
          note: note2,
          targetItemId,
          orderId,
        });
      });

    // logout
    cy.logout();
  });
});
