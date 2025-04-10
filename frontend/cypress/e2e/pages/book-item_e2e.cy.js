/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Testing the books page', () => {
    beforeEach(() => {
        cy.setLangToEn();
        cy.visit("http://localhost:4200/books")
        cy.get('[data-cy="bd-content-bookcard"]')
            .eq(1)
            .click()
    })

    it('Should display bookcard with values', () => {
        cy.get('[data-cy="booki-card-img"]')
            .should('exist')
            .should('have.attr', 'src')
        cy.get('[data-cy="booki-card-title"]')
            .should('exist')
            .should('contain.text', 'Metamorphosis')
        cy.get('[data-cy="booki-card-author"]')
            .should('exist')
            .should('contain.text', 'Author: Franz Kafka')
        cy.get('[data-cy="booki-card-release"]')
            .should('exist')
            .should('contain.text', 'Release date: 1915')
        cy.get('[data-cy="booki-card-genre"]')
            .should('exist')
            .should('contain.text', 'Genre: Philosophical')
    })

    it('Should have back button that navigates to books', () => {
        cy.get('[data-cy="booki-btn-back"]')
            .should('exist')
            .should('contain.text', 'Back')
            .click();
        cy.url().should('eq', 'http://localhost:4200/books')
    })

    it('Should have description card with values', () => {
        cy.get('[data-cy="booki-desc-card"]')
            .should('exist')
        cy.get('[data-cy="booki-desc-title"]')
            .should('exist')
            .should('contain.text', 'Metamorphosis')
        cy.get('[data-cy="booki-desc-author"]')
            .should('exist')
            .should('contain.text', 'Franz Kafka')
        cy.get('[data-cy="booki-desc-release"]')
            .should('exist')
            .should('contain.text', '1915')
        cy.get('[data-cy="booki-desc-desc"]')
            .should('exist')
            .its('text')
            .should('have.length.gt', 0)
    })

});

describe('Testing book-item custom-paginator and review-display', () => {
    beforeEach(() => {
        cy.setLangToEn();
        cy.visit("http://localhost:4200/books")
        cy.get('[data-cy="bd-content-bookcard"]')
            .eq(1)
            .click()
    })

    it('Should contain custom-paginator and review-display components', () => {
        cy.get('[data-cy="booki-desc-paginator"]')
            .should('exist')
        cy.get('[data-cy="booki-desc-rd"]')
            .should('exist')
    })
});
