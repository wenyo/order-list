import EXAMPLE from '../fixtures/example.json';

describe('Admin', () => {
  it('Admin Login', () => {
    cy.visit('/');
    cy.url().should('include', '/login');

    cy.get(".input-primary[name='account']").type(EXAMPLE.user.admin.account);
    cy.get(".input-primary[name='password']").type(EXAMPLE.user.admin.password);

    cy.get('.btn-primary').click();

    cy.get('.icon-menu').click();
    cy.get('.btn-secondary').click();
  });

  it('Admin add items', () => {
    // login
    cy.intercept('/').as('hompage');
    cy.visit('/');
    cy.url().should('include', '/login');

    cy.get(".input-primary[name='account']").type(EXAMPLE.user.admin.account);
    cy.get(".input-primary[name='password']").type(EXAMPLE.user.admin.password);

    cy.get('.btn-primary').click();

    // add new item
    const sampleItem1 = EXAMPLE.items.sample1;
    const sampleItem2 = EXAMPLE.items.sample2;
    const nowTime = new Date().getTime();
    const testItem1Name = `${sampleItem1.name}_${nowTime}`;
    const testItem2Name = `${sampleItem2.name}_${nowTime}`;
    // return;
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

    // update item
    cy.wait(3000);
    const testItem = cy
      .get('.item :nth-child(2) span')
      .contains(sampleItem1.name)
      .parentsUntil('ul');
    const testUpdateBtn = testItem.children('.btn-block').children();
    testUpdateBtn.click();

    cy.get('.alert-form label:nth-child(1) input').clear().type(testItem2Name);
    cy.get('.alert-form label:nth-child(2) input').clear().type(sampleItem2.price);
    cy.get('.alert-form label:nth-child(3) input').clear().type(sampleItem2.stock);
    cy.get('.alert-form label:nth-child(4) input').selectFile(sampleItem2.img, { force: true });
    cy.get('.alert-form .btn-primary[type="submit"]').click();

    // item delete
    cy.wait(3000);
    testUpdateBtn.click();
    cy.get('.delete').click();
    cy.wait(3000);
    cy.get('.item :nth-child(2) span')
      .contains(sampleItem2.name)
      .parentsUntil('ul')
      .should('have.class', 'delete-item');

    // logout
    cy.get('.icon-menu').click();
    cy.get('.btn-secondary').click();
  });
});
