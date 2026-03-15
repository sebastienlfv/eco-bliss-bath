import { goToRegister } from '../../utils/goTo.cy'; // Importation de la fonction goToRegister

describe('Register', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/#')
  })
  it('Devrait retourner une erreur si le formulaire est vide', () => {
    goToRegister();

    cy.get('[data-cy="register-submit"]')
      .should('exist')
      .should('be.visible')
      .click();

    cy.get('[data-cy="register-errors"]')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Merci de remplir correctement tous les champs (adresse email, mot de passe de 5 caractères minimum, confirmation identique)');  
  });
  it('Devrait retourner une erreur si le mot de passe n\'est pas identique', () => {
    goToRegister();

    cy.get('[data-cy="register-input-lastname"]')
      .should('exist')
      .should('be.visible')
      .type('Doe')

    cy.get('[data-cy="register-input-firstname"]')
      .should('exist')
      .should('be.visible')
      .type('John')

    cy.get('[data-cy="register-input-email"]')
      .should('exist')
      .should('be.visible')
      .type('john.doe@example.com')

    cy.get('[data-cy="register-input-password"]')
      .should('exist')
      .should('be.visible')
      .type('password')

    cy.get('[data-cy="register-input-password-confirm"]')
      .should('exist')
      .should('be.visible')
      .type('password1')

    cy.get('[data-cy="register-submit"]')
      .should('exist')
      .should('be.visible')
      .click()

    cy.get('[data-cy="register-errors"]')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Merci de remplir correctement tous les champs (adresse email, mot de passe de 5 caractères minimum, confirmation identique)') 
  });
  it('Devrait retourner une erreur si l\'email n\'est pas valide', () => {
    goToRegister();

    cy.get('[data-cy="register-input-lastname"]')
      .should('exist')
      .should('be.visible')
      .type('Doe')

    cy.get('[data-cy="register-input-firstname"]')
      .should('exist')
      .should('be.visible')
      .type('John')

    cy.get('[data-cy="register-input-email"]')
      .should('exist')
      .should('be.visible')
      .type('john.doe')

    cy.get('[data-cy="register-input-password"]')
      .should('exist')
      .should('be.visible')
      .type('password')

    cy.get('[data-cy="register-input-password-confirm"]')
      .should('exist')
      .should('be.visible')
      .type('password')

    cy.get('[data-cy="register-submit"]')
      .should('exist')
      .should('be.visible')
      .click()

    cy.get('[data-cy="register-errors"]')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Merci de remplir correctement tous les champs (adresse email, mot de passe de 5 caractères minimum, confirmation identique)') 
  });
  it('Devrait pouvoir s\'inscrire si les champs sont valides', () => {    
    goToRegister();

    cy.get('[data-cy="register-input-lastname"]')
      .should('exist')
      .should('be.visible')
      .type('Doe')

    cy.get('[data-cy="register-input-firstname"]')
      .should('exist')
      .should('be.visible')
      .type('John')

    cy.get('[data-cy="register-input-email"]')
      .should('exist')
      .should('be.visible')
      .type('john.doe@example.com')

    cy.get('[data-cy="register-input-password"]')
      .should('exist')
      .should('be.visible')
      .type('password')

    cy.get('[data-cy="register-input-password-confirm"]')
      .should('exist')
      .should('be.visible')
      .type('password')

    cy.get('[data-cy="register-submit"]')
      .should('exist')
      .should('be.visible')
      .click()

    cy.url().should('include', '/')

    cy.get('[data-cy="nav-link-logout"]')
      .should('exist')
      .should('be.visible')
  });
});