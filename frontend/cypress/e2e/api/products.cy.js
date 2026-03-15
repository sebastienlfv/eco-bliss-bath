describe("E2E - Produit (infos via clic + API)", () => {
  const appUrl = "http://localhost:4200/#";
  const apiUrl = "http://localhost:8081";

  it("Devrait afficher les infos du produit après clic (cohérent avec l'API)", () => {
    cy.intercept("GET", `${apiUrl}/products`).as("getProducts");
    cy.intercept("GET", new RegExp(`${apiUrl}/products/\\d+$`)).as("getProduct");

    cy.visit(`${appUrl}/products`);

    cy.wait("@getProducts")
      .its("response.statusCode")
      .should("eq", 200);

    cy.get('[data-cy="product-link"]').should("have.length.at.least", 1).first().click();

    cy.wait("@getProduct").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);

      const product = response?.body;
      expect(product).to.have.property("name");
      expect(product).to.have.property("price");
      expect(product).to.have.property("availableStock");

      const formattedPrice = new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(product.price);

      // Assertions UI : les infos affichées correspondent à la réponse API
      cy.get('[data-cy="detail-product-name"]').should("contain", product.name);
      cy.get('[data-cy="detail-product-price"]').should(
        "contain",
        formattedPrice
      );
      cy.get('[data-cy="detail-product-stock"]').should(
        "contain",
        String(product.availableStock)
      );
    });
  });
});

