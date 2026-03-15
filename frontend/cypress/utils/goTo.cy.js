export const goToRegister = () => {
    cy.get('[data-cy="nav-link-register"]') // Récupère le lien d'inscription
    .should('exist')
    .should('be.visible')
    .click();
};

export const goToLogin = () => {
  cy.get('[data-cy="nav-link-login"]') // Récupère le lien de connexion
  .should('exist')
  .should('be.visible')
  .click();
};