import EXAMPLE from '../fixtures/example.json';

const nowTime = new Date().getTime();

describe('Customer', () => {
  let targetItemId = '';
  let orderId = '';
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

    const note1 = `${EXAMPLE.order.sample1.note}_${nowTime}`;
    const note2 = `${EXAMPLE.order.sample2.note}_${nowTime}`;
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
        cy.get('.icon-menu').click();
        cy.get('.router li:nth-child(2)').click();

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
});
