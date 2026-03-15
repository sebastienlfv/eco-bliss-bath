import { goToLogin } from "../../utils/goTo.cy";

describe("SMOKE - Page de login", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200/#");
    goToLogin();
  });

  it("Devrait afficher le formulaire de connexion", () => {
    cy.get('[data-cy="login-form"]').should("exist").and("be.visible");

    cy.get('[data-cy="login-input-username"]')
      .should("exist")
      .and("be.visible")
      .and("be.enabled");

    cy.get('[data-cy="login-input-password"]')
      .should("exist")
      .and("be.visible")
      .and("be.enabled");

    cy.get('[data-cy="login-submit"]')
      .should("exist")
      .and("be.visible")
      .and("not.be.disabled");
  });
});
