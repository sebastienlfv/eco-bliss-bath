import { goToLogin } from "../../utils/goTo.cy"; // Importation de la fonction goToLogin

describe("Login", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200/#");
  });
  it("Devrait retourner une erreur si le formulaire est vide", () => {
    goToLogin();

    cy.get('[data-cy="login-submit"]')
      .should("exist")
      .should("be.visible")
      .click();

    cy.get('[data-cy="login-errors"]')
      .should("exist")
      .should("be.visible")
      .should("contain", "Merci de remplir correctement tous les champs");
  });
  it("Devrait retourner une erreur si l'email n'est pas valide", () => {
    goToLogin();

    cy.get('[data-cy="login-input-username"]')
      .should("exist")
      .should("be.visible")
      .type("john.doe"); // email invalide (sans @)

    cy.get('[data-cy="login-input-password"]')
      .should("exist")
      .should("be.visible")
      .type("John");

    cy.get('[data-cy="login-submit"]')
      .should("exist")
      .should("be.visible")
      .click();

    cy.get('[data-cy="login-errors"]')
      .should("exist")
      .should("be.visible")
      .should("contain", "Merci de remplir correctement tous les champs");
  });
  it("Devrait retourner une erreur si le mot de passe n'est pas valide", () => {
    goToLogin();

    cy.get('[data-cy="login-input-username"]')
      .should("exist")
      .should("be.visible")
      .type("john.doe@test.fr");

    cy.get('[data-cy="login-input-password"]')
      .should("exist")
      .should("be.visible")
      .type("John");

    cy.get('[data-cy="login-submit"]')
      .should("exist")
      .should("be.visible")
      .click();

    cy.get('[data-cy="login-errors"]')
      .should("exist")
      .should("be.visible")
      .should("contain", "Identifiants incorrects");
  });
  it("Devrait pouvoir se connecter si les champs sont valides", () => {
    goToLogin();

    cy.get('[data-cy="login-input-username"]')
      .should("exist")
      .should("be.visible")
      .type("john.doe@test.fr");

    cy.get('[data-cy="login-input-password"]')
      .should("exist")
      .should("be.visible")
      .type("password"); // utilisateur de test en BDD : john.doe@test.fr / password

    cy.get('[data-cy="login-submit"]')
      .should("exist")
      .should("be.visible")
      .click();

    cy.url().should("eq", "http://localhost:4200/#/");
  });
});
