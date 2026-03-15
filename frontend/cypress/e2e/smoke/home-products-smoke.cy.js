describe("SMOKE - Produits sur la page d'accueil", () => {
  const appUrl = "http://localhost:4200/#";

  it("Devrait afficher au moins un produit dans la sélection d'accueil avec ses informations principales", () => {
    cy.visit(appUrl);

    cy.get('[data-cy="product-home"]')
      .should("exist")
      .and("have.length.at.least", 1);

    cy.get('[data-cy="product-home"]')
      .first()
      .within(() => {
        cy.get('[data-cy="product-home-img"]')
          .should("exist")
          .and("be.visible");

        cy.get('[data-cy="product-home-name"]')
          .should("exist")
          .and("be.visible")
          .and("not.be.empty");

        cy.get('[data-cy="product-home-ingredients"]')
          .should("exist")
          .and("be.visible")
          .and("not.be.empty");

        cy.get('[data-cy="product-home-price"]')
          .should("exist")
          .and("be.visible")
          .and("contain", "€");

        cy.get('[data-cy="product-home-link"]')
          .should("exist")
          .and("be.visible")
          .and("not.be.disabled");
      });
  });
});

