import { login } from "../../utils/login.cy";

describe("SMOKE - Page panier", () => {
  const appUrl = "http://localhost:4200/#";
  const user = {
    username: "john.doe@test.fr",
    password: "password",
  };

  it("Devrait rediriger vers la page de login si l'utilisateur n'est pas connecté", () => {
    cy.clearLocalStorage();

    cy.visit(`${appUrl}/cart`);

    cy.url().should("include", "/login");
    cy.get('[data-cy="login-submit"]').should("exist").and("be.visible");
  });

  it("Devrait afficher les éléments principaux du panier pour un utilisateur connecté", () => {
    cy.visit(appUrl);
    login(user.username, user.password);

    cy.get('[data-cy="nav-link-cart"]').click();
    cy.url().should("include", "/cart");

    cy.get("h1").contains("Commande");

    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="cart-empty"]').length) {
        cy.get('[data-cy="cart-empty"]').should("be.visible");
      } else {
        cy.get('[data-cy="cart-line"]').should("have.length.at.least", 1);
        cy.get('[data-cy="cart-total"]').should("contain", "€");
        cy.get('[data-cy="cart-form"]').should("exist").and("be.visible");
        cy.get('[data-cy="cart-submit"]')
          .should("exist")
          .and("be.visible")
          .and("not.be.disabled");
      }
    });
  });
});

