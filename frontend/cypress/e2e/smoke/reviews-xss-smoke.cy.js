import { login } from "../../utils/login.cy";

describe("SMOKE - XSS potentiel sur les commentaires", () => {
  const appUrl = "http://localhost:4200/#";
  const apiUrl = "http://localhost:8081";
  const user = {
    username: "john.doe@test.fr",
    password: "password",
  };

  it("Ne devrait pas exécuter de balises <script> ou d'attributs d'évènement dans un commentaire", () => {
    const xssPayload = `<img src=x onerror="alert('xss')"><script>alert('xss');</script>`;

    // 1. Login
    cy.visit(appUrl);
    login(user.username, user.password);

    // 2. Navigation vers la page des avis
    cy.get('[data-cy="nav-link-reviews"]').click();

    // 3. Remplir et poster un avis contenant du HTML potentiellement dangereux
    cy.get('[data-cy="review-form"]').should("be.visible");

    cy.get('[data-cy="review-input-rating-images"] img')
      .first()
      .click();

    cy.get('[data-cy="review-input-title"]').type("Test XSS");
    cy.get('[data-cy="review-input-comment"]').type(xssPayload, { parseSpecialCharSequences: false });

    cy.intercept("POST", `${apiUrl}/reviews`).as("postReview");
    cy.get('[data-cy="review-submit"]').click();

    cy.wait("@postReview")
      .its("response.statusCode")
      .should((status) => {
        expect([200, 201]).to.include(status);
      });

    // 4. Vérifier que l'avis est affiché puis analyser le HTML pour détecter des scripts ou handlers inline
    cy.contains('[data-cy="review-title"]', "Test XSS", { timeout: 10000 });

    cy.get('[data-cy="review-comment"]').then(($comments) => {
      const html = ($comments.html() || "").toLowerCase();

      // Aucune balise <script> ne doit apparaître
      expect(html).to.not.include("<script");
      // Pas d'attributs d'événements inline
      expect(html).to.not.include("onerror=");
      expect(html).to.not.include("onload=");
      expect(html).to.not.include("onclick=");
    });
  });
});

