Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Testing the summary-item page', () => {
    beforeEach(() => {
        cy.setLangToEn();
        cy.visit("http://localhost:4200/summaries")
        cy.get('[data-cy="bd-content-summarycard"]')
            .eq(0)
            .click()
    })
    it('Should display summarycard with values', () => {
        cy.get('[data-cy="summi-card-img"]')
            .should('exist')
            .should('have.attr', 'src')
        cy.get('[data-cy="summi-card-title"]')
            .should('exist')
            .should('contain.text', 'Lorem')
        cy.get('[data-cy="summi-card-author"]')
            .should('exist')
            .should('contain.text', 'Author: Lorem')
    })

    it('Should have back button that navigates to summaries', () => {
        cy.get('[data-cy="summi-btn-back"]')
            .should('exist')
            .should('contain.text', 'Back')
            .click();
        cy.url().should('eq', 'http://localhost:4200/summaries')
    })

    it('Should have description card with values', () => {
        cy.get('[data-cy="summi-desc-card"]')
            .should('exist')
        cy.get('[data-cy="summi-desc-title"]')
            .should('exist')
            .should('contain.text', 'Summary for: Lorem')

        cy.get('[data-cy="summi-desc-creator"]')
            .should('exist')
            .should('contain.text', 'By: ')
        cy.get('[data-cy="summi-desc-username"]')
            .should('exist')
            .should('contain.text', 'editor')
        cy.get('[data-cy="summi-desc-created"]')
            .should('exist')
            .should('contain.text', 'April 8, 2016')
        cy.get('[data-cy="summi-desc-content"]')
            .should('exist')
            .its('text')
            .should('have.length.gt', 0)
    })

    it('Should navigate to profile after clicking creator username', () => {
        cy.get('[data-cy="summi-desc-username"]')
            .should('exist')
            .click()
        cy.url().should('eq', 'http://localhost:4200/profile')
    })
})