/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Testing the books page', () => {
    beforeEach(() => {
        cy.setLangToEn();
        cy.visit("http://localhost:4200/books")
    })

    it('Should contain the book-display element with mode: books', () => {
        cy.get('[data-cy="books-bd"]')
            .should('exist')
            .should('have.attr', 'ng-reflect-mode', 'books')
    })

    it('Should contain layout elements', () => {
        cy.get('[data-cy="bd-header-card"]')
            .should('exist')
        cy.get('[data-cy="bd-header-books"]')
            .should('exist')
            .should('contain.text', ' Our selection ')
        cy.get('[data-cy="bd-header-search"]')
            .should('exist')
        cy.get('[data-cy="bd-header-paginator"]')
            .should('exist')
    })

    it('Should have book card items as content', ()=>{
        cy.get('[data-cy="bd-content-bookcard"]')
            .should('exist')
            .should('have.length.gt', 0)
    })

    it('Should navigate to book-item page upon clicking a bookcard', ()=>{
        cy.get('[data-cy="bd-content-bookcard"]')
            .eq(0)
            .click()
        cy.url().should('contain', 'book-item')

        cy.visit("http://localhost:4200/books")

        cy.get('[data-cy="bd-content-bookcard"]')
            .eq(2)
            .click()
        cy.url().should('contain', 'book-item')
    }) 
})