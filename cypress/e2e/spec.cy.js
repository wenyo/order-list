import EXAMPLE from "../fixtures/example.json";

describe("Admin", () => {
  it("Admin Login", () => {
    cy.visit("/");
    cy.url().should("include", "/login");

    cy.get(".input-primary[name='account']").type(EXAMPLE.user.admin.account);
    cy.get(".input-primary[name='password']").type(EXAMPLE.user.admin.password);

    cy.get(".btn-primary").click();
  });

  it("Admin Loggout", () => {
    cy.get(".icon-menu").click();
    cy.get(".btn-secondary").click();
  });
});
