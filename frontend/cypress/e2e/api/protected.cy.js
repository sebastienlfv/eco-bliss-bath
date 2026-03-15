describe("E2E - Protection (via le front)", () => {
  const appUrl = "http://localhost:4200/#";
  const apiUrl = "http://localhost:8081";

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("Devrait rediriger vers /login si non connecté + l'API /orders renvoie 401/403", () => {
    cy.intercept("GET", `${apiUrl}/orders`).as("getOrders");

    cy.visit(`${appUrl}/cart`);

    // Le composant Cart appelle quand même /orders, puis supprime le token et redirige.
    cy.wait("@getOrders")
      .its("response.statusCode")
      .should("be.oneOf", [401, 403]);

    cy.url().should("include", "/login");
  });
});

