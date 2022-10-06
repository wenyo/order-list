import EXAMPLE from '../fixtures/example.json';

const sampleItem1 = EXAMPLE.items.sample1;
const sampleItem2 = EXAMPLE.items.sample2;
const nowTime = new Date().getTime();

describe('Admin', () => {
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
    cy.intercept('/').as('hompage');
    cy.visit('/');
    cy.login(EXAMPLE.user.admin);

    // add new item

    const testItem1Name = `${sampleItem1.name}_${nowTime}`;

    // add new item
    cy.wait('@hompage').then(() => {
      cy.wait(3000);
      cy.get('.btn-primary.add').click();

      cy.get('.alert-form label:nth-child(1) input').type(testItem1Name);
      cy.get('.alert-form label:nth-child(2) input').type(sampleItem1.price);
      cy.get('.alert-form label:nth-child(3) input').type(sampleItem1.stock);
      cy.get('.alert-form label:nth-child(4) input').selectFile(sampleItem1.img, { force: true });
      cy.get('.alert-form .btn-primary[type="submit"]').click();
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
      const testItem2Name = `${sampleItem2.name}_${nowTime}`;
      cy.get('.item:not(.delete) :nth-child(2) span')
        .contains(sampleItem1.name)
        .parentsUntil('ul')
        .children('.btn-block')
        .children()
        .click();

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
      cy.get('.item:not(.delete) :nth-child(2) span')
        .contains(sampleItem1.name)
        .parentsUntil('ul')
        .children('.btn-block')
        .children()
        .click();

      cy.get('.delete').click();
      cy.wait(3000);
      cy.get('.item :nth-child(2) span')
        .contains(sampleItem2.name)
        .parentsUntil('ul')
        .should('have.class', 'delete-item');
    });

    // logout
    cy.logout();
  });
});
