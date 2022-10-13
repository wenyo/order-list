import EXAMPLE from '../fixtures/example.json';
require('cypress-xpath');

const sampleItem1 = EXAMPLE.items.sample1;
const sampleItem2 = EXAMPLE.items.sample2;
const nowTime = new Date().getTime();

describe('Admin', () => {
  let targetItemId = '';

  it('Admin Login', () => {
    cy.intercept('/').as('hompage');
    cy.visit('/');

    cy.login(EXAMPLE.user.admin);
    cy.wait('@hompage').then(() => {
      cy.logout();
    });
  });

  it('Admin add item', () => {
    // login
    cy.intercept('/').as('homepage');
    cy.visit('/');
    cy.login(EXAMPLE.user.admin);

    const testItem1Name = `${sampleItem1.name}_${nowTime}`;

    // add new item
    cy.wait('@homepage').then(() => {
      cy.wait(7000);
      cy.get('.add').click();
      cy.get('.alert-form .name input').type(`{selectAll}${testItem1Name}`);
      cy.get('.alert-form .price input').type(`{selectAll}${sampleItem1.price}`);
      cy.get('.alert-form .stock input').type(`{selectAll}${sampleItem1.stock}`);
      cy.get('.alert-form .img input').selectFile(sampleItem1.img, { force: true });
      cy.get('.alert-form button[type="submit"]').click();
    });

    // check add result, get targetItemId
    cy.wait(7000);
    const targetItem = cy.xpath(`//li[contains(.,'${testItem1Name}')]`);

    targetItem.invoke('data', 'id').then((id) => {
      targetItemId = id;
      console.log(`get .item data-id=${targetItemId}`);
    });

    // logout
    cy.logout();
  });

  it('Admin update item', () => {
    // login
    cy.intercept('/').as('hompage');
    cy.visit('/');
    cy.login(EXAMPLE.user.admin);

    // update item
    cy.wait('@hompage').then(() => {
      cy.wait(3000);

      const testItem2Name = `${sampleItem2.name}_${nowTime}`;
      cy.get(`li.item[data-id='${targetItemId}'] .btn-primary`).click();

      cy.get('.alert-form .name input').type(`{selectAll}${testItem2Name}`);
      cy.get('.alert-form .price input').type(`{selectAll}${sampleItem2.price}`);
      cy.get('.alert-form .stock input').type(`{selectAll}${sampleItem2.stock}`);
      cy.get('.alert-form .img input').selectFile(sampleItem2.img, { force: true });
      cy.get('.alert-form button[type="submit"]').click();
    });

    // logout
    cy.logout();
  });

  it('Admin delete item', () => {
    // login
    cy.intercept('/').as('hompage');
    cy.visit('/');
    cy.login(EXAMPLE.user.admin);

    cy.wait('@hompage').then(() => {
      cy.wait(3000);
      cy.get(`li.item[data-id='${targetItemId}'] .btn-primary`).click();
      cy.get('.delete button').click();
      cy.wait(7000);
      cy.get(`li.item[data-id='${targetItemId}']`).should('have.class', 'delete-item');
    });

    // logout
    cy.logout();
  });

  it('Admin show item', () => {
    // login
    cy.intercept('/').as('hompage');
    cy.visit('/');
    cy.login(EXAMPLE.user.admin);

    cy.wait('@hompage').then(() => {
      cy.wait(3000);
      cy.get(`li.item[data-id='${targetItemId}'] .btn-primary`).click();
      cy.get('.delete button').click();
      cy.wait(7000);
      cy.get(`li.item[data-id='${targetItemId}']`).should('not.have.class', 'delete-item');
    });

    // logout
    cy.logout();
  });
});
