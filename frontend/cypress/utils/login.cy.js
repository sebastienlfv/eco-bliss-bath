import { goToLogin } from "./goTo.cy";

export const login = (username, password) => {
  goToLogin();

  cy.get('[data-cy="login-input-username"]')
    .should("exist")
    .should("be.visible")
    .type(username);

  cy.get('[data-cy="login-input-password"]')
    .should("exist")
    .should("be.visible")
    .type(password);

  cy.get('[data-cy="login-submit"]')
    .should("exist")
    .should("be.visible")
    .click();

  cy.url().should("eq", "http://localhost:4200/#/");
};
