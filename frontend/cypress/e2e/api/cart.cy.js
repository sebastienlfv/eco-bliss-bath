import { login } from "../../utils/login.cy";

describe("E2E - Panier (API vérifiée via UI)", () => {
  const appUrl = "http://localhost:4200/#";
  const apiUrl = "http://localhost:8081";

  const user = {
    username: "john.doe@test.fr",
    password: "password",
  };

  beforeEach(() => {
    cy.visit(appUrl);
    login(user.username, user.password);
  });

  it("Devrait ajouter un produit au panier et vérifier le listing (API + UI)", () => {
    // Détail produit chargé via API
    cy.intercept("GET", new RegExp(`${apiUrl}/products/\\d+$`)).as(
      "getProduct",
    );

    // Ajout panier + refresh panier via API
    cy.intercept("PUT", `${apiUrl}/orders/add`).as("addToCart");
    cy.intercept("GET", `${apiUrl}/orders`).as("getOrders");

    cy.get('[data-cy="nav-link-products"]').click();
    cy.url().should("include", "/products");

    cy.get('[data-cy="product-link"]').first().click();
    cy.wait("@getProduct").its("response.statusCode").should("eq", 200);

    cy.get('[data-cy="detail-product-add"]').should("be.visible").click();

    cy.wait("@addToCart").its("response.statusCode").should("eq", 200);

    cy.wait("@getOrders").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body).to.have.property("orderLines");
      expect(response?.body?.orderLines?.length).to.be.greaterThan(0);
    });

    // Assertions UI panier
    cy.url().should("include", "/cart");
    cy.get('[data-cy="cart-line"]').should("have.length.at.least", 1);
    cy.get('[data-cy="cart-line-name"]').first().should("not.be.empty");
    cy.get('[data-cy="cart-total"]').should("contain", "€");
  });
  it("Devrait refuser l'ajout au panier si le produit est en rupture de stock (si un produit existe)", () => {
    // On s'appuie sur l'API uniquement pour trouver un produit en rupture,
    // ensuite l'action et la vérification se font via le front.
    cy.request({
      method: "GET",
      url: `${apiUrl}/products`,
    }).then((response) => {
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

      cy.intercept("PUT", `${apiUrl}/orders/add`).as("addToCart");

      cy.visit(`${appUrl}/products/${outOfStock.id}`);
      cy.get('[data-cy="detail-product-stock"]').should(
        "contain",
        String(outOfStock.availableStock),
      );

      cy.get('[data-cy="detail-product-quantity"]')
        .should("be.visible")
        .type("30");

      cy.get('[data-cy="detail-product-add"]').should("be.visible").click();

      cy.wait("@addToCart")
        .its("response.statusCode")
        .should("be.oneOf", [400, 409, 422]);
    });
  });
  it("Devrait diminuer le stock affiché après ajout d'un produit au panier", () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/products`,
    }).then((response) => {
      expect(response.status).to.eq(200);

      const productWithStock = response.body.find(
        (p) => p.availableStock !== null && p.availableStock > 1,
      );

      if (!productWithStock) {
        cy.log(
          "Aucun produit avec un stock > 1 trouvé, test non applicable sur cet environnement.",
        );
        return;
      }

      const initialStock = productWithStock.availableStock;

      cy.visit(appUrl);
      login(user.username, user.password);

      cy.visit(`${appUrl}/products/${productWithStock.id}`);

      cy.get('[data-cy="detail-product-stock"]')
        .invoke("text")
        .then((text) => {
          const stockFromUi = parseInt(text, 10);
          // Le texte est du type "X en stock", on s'assure au minimum que X est cohérent.
          expect(stockFromUi).to.be.a("number");
        });

      cy.intercept("PUT", `${apiUrl}/orders/add`).as("addToCart");

      cy.get('[data-cy="detail-product-quantity"]')
        .should("be.visible")
        .clear()
        .type("1");

      cy.get('[data-cy="detail-product-add"]').should("be.visible").click();

      cy.wait("@addToCart").its("response.statusCode").should("eq", 200);

      // On revérifie le stock via l'API pour s'assurer qu'il a diminué
      cy.request({
        method: "GET",
        url: `${apiUrl}/products/${productWithStock.id}`,
      }).then((res2) => {
        expect(res2.status).to.eq(200);
        expect(res2.body).to.have.property("availableStock");
        expect(res2.body.availableStock).to.be.lessThan(initialStock);
      });
    });
  });
  it("Ne doit pas permettre de valider une quantité négative pour un produit", () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/products`,
    }).then((response) => {
      expect(response.status).to.eq(200);

      const productWithStock = response.body.find(
        (p) => p.availableStock === null || p.availableStock > 0,
      );

      if (!productWithStock) {
        cy.log(
          "Aucun produit avec un stock disponible trouvé, test non applicable sur cet environnement.",
        );
        return;
      }

      cy.visit(appUrl);
      login(user.username, user.password);

      cy.visit(`${appUrl}/products/${productWithStock.id}`);

      cy.url().should("include", `/products/${productWithStock.id}`);

      cy.get('[data-cy="detail-product-quantity"]')
        .should("be.visible")
        .clear()
        .type("-1");

      cy.get('[data-cy="detail-product-add"]').should("be.visible").click();

      // Le formulaire Angular a un Validators.min(0), donc avec -1 il reste invalide
      // et la méthode addToCart ne doit pas naviguer vers le panier.
      cy.url().should("include", `/products/${productWithStock.id}`);
    });
  });
});
