import { login } from "../utils/login.cy";

const user = {
  username: "john.doe@test.fr",
  password: "password",
};

describe("Cart", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200/#");
  });
  it("Devrait pouvoir ajouter un produit au panier", () => {
    login(user.username, user.password);

    cy.get('[data-cy="nav-link-products"]')
      .should("exist")
      .should("be.visible")
      .click();

    cy.url().should("eq", "http://localhost:4200/#/products");

    cy.get('[data-cy="product-link"]')
      .should("exist")
      .should("be.visible")
      .first()
      .click();

    cy.wait(1000);

    cy.get('[data-cy="detail-product-add"]')
      .should("exist")
      .should("be.visible")
      .click({ force: true });

    cy.url().should("eq", "http://localhost:4200/#/cart");

    cy.get('[data-cy="cart-input-lastname"]')
      .should("exist")
      .should("be.visible")
      .should("have.value", "Doe");

    cy.get('[data-cy="cart-input-firstname"]')
      .should("exist")
      .should("be.visible")
      .should("have.value", "John");

    cy.get('[data-cy="cart-input-address"]')
      .should("exist")
      .should("be.visible")
      .type("123 Rue de la Paix");

    cy.get('[data-cy="cart-input-zipcode"]')
      .should("exist")
      .should("be.visible")
      .type("75000");

    cy.get('[data-cy="cart-input-city"]')
      .should("exist")
      .should("be.visible")
      .type("Paris");

    cy.get('[data-cy="cart-submit"]')
      .should("exist")
      .should("be.visible")
      .click();

    cy.url().should("eq", "http://localhost:4200/#/confirmation");
  });
});
