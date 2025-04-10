/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Testing the books page', () => {
    beforeEach(() => {
        cy.setLangToEn();
        cy.visit("http://localhost:4200/summaries")
    })

    it('Should contain the book-display element with mode: summaries', () => {
        cy.get('[data-cy="summaries-bd"]')
            .should('exist')
            .should('have.attr', 'ng-reflect-mode', 'summaries')
    })

    it('Should contain layout elements', () => {
        cy.get('[data-cy="bd-header-card"]')
            .should('exist')
        cy.get('[data-cy="bd-header-summaries"]')
            .should('exist')
            .should('contain.text', 'Summaries')
        cy.get('[data-cy="bd-header-search"]')
            .should('exist')
        cy.get('[data-cy="bd-header-paginator"]')
            .should('exist')
    })

    it('Should have summary card items as content', ()=>{
        cy.get('[data-cy="bd-content-summarycard"]')
            .should('exist')
            .should('have.length.gt', 0)
    })

    it('Should navigate to summary-item page upon clicking a summarycard', ()=>{
        cy.get('[data-cy="bd-content-summarycard"]')
            .eq(0)
            .click()
        cy.url().should('contain', 'summary-item')

        cy.visit("http://localhost:4200/summaries")

        cy.get('[data-cy="bd-content-summarycard"]')
            .eq(2)
            .click()
        cy.url().should('contain', 'summary-item')
    }) 
})