import EXAMPLE from '../fixtures/example.json';

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

    // add new item

    const testItem1Name = `${sampleItem1.name}_${nowTime}`;

    // add new item
    cy.wait('@homepage').then(() => {
      cy.wait(3000);
      cy.get('.btn-primary.add').click();
      cy.get('.alert-form label:nth-child(1) input').type(testItem1Name);
      cy.get('.alert-form label:nth-child(2) input').type(sampleItem1.price);
      cy.get('.alert-form label:nth-child(3) input').type(sampleItem1.stock);
      cy.get('.alert-form label:nth-child(4) input').selectFile(sampleItem1.img, { force: true });
      cy.get('.alert-form .btn-primary[type="submit"]').click();
    });

    // chek add result, get targetItemId
    cy.wait(7000);
    const targetItem = cy
      .get('.item:not(.delete) :nth-child(2) span')
      .contains(testItem1Name)
      .parentsUntil('ul', '.item');

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

      cy.get('.alert-form label:nth-child(1) input').clear().type(testItem2Name);
      cy.get('.alert-form label:nth-child(2) input').clear().type(sampleItem2.price);
      cy.get('.alert-form label:nth-child(3) input').clear().type(sampleItem2.stock);
      cy.get('.alert-form label:nth-child(4) input').selectFile(sampleItem2.img, { force: true });
      cy.get('.alert-form .btn-primary[type="submit"]').click();
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
