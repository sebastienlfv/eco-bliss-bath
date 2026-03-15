describe("SMOKE - Disponibilité des produits", () => {
  const appUrl = "http://localhost:4200/#";
  const apiUrl = "http://localhost:8081";

  it("Devrait afficher au moins un produit disponible", () => {
    cy.request(`${apiUrl}/products`).then((response) => {
      expect(response.status).to.eq(200);
      const available = response.body.find(
        (p) => p.availableStock === null || p.availableStock > 0,
      );

      expect(available, "au moins un produit disponible").to.exist;

      cy.visit(`${appUrl}/products/${available.id}`);

      cy.get('[data-cy="detail-product-name"]').should("not.be.empty");
      cy.get('[data-cy="detail-product-stock"]').should(
        "contain",
        String(available.availableStock ?? ""),
      );
    });
  });

  it("Devrait afficher correctement un produit non disponible", () => {
    cy.request(`${apiUrl}/products`).then((response) => {
      expect(response.status).to.eq(200);

      const outOfStock = response.body.find(
        (p) => p.availableStock !== null && p.availableStock <= 0,
      );

      if (!outOfStock) {
        cy.log(
          "Aucun produit en rupture de stock trouvé, test non applicable sur cet environnement.",
        );
        return;
      }

      cy.visit(`${appUrl}/products/${outOfStock.id}`);
      cy.get('[data-cy="detail-product-name"]').should("not.be.empty");
      cy.get('[data-cy="detail-product-stock"]').should(
        "contain",
        String(outOfStock.availableStock),
      );
    });
  });
});
