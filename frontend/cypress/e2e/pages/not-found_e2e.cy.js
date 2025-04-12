/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Testing the not-found page', () => {
    beforeEach(() => {
        cy.setLangToEn();
        cy.visit("http://localhost:4200/404")
    })

    it('Should appear on incorrect routes', () => {
        cy.visit("http://localhost:4200/asd")
        cy.url().should('eq', 'http://localhost:4200/404')
        cy.visit("http://localhost:4200/test")
        cy.url().should('eq', 'http://localhost:4200/404')
    })

    it('Should have Obi Wan image', () => {
        cy.get('[data-cy="notfound-img"]')
            .should('exist')
            .should('have.attr', 'src')
            .and('include', './assets/images/not-found.webp');
    })

    it('Should have appropriate text', ()=>{
        cy.get('.display-1')
            .should('exist')
            .should('contain.text', '404!')
        cy.get('#not-found-quote')
            .should('exist')
            .should('contain.text', 'This is not the page you are looking for...')
    })

    it('Should have redirect countdown', ()=>{
        cy.get('#redirect')
            .should('exist')
            .should('contain.text', 'Redirecting to home page in:')
        cy.wait(1000)
        cy.get('[data-cy="notfound-redirect-spinner"]')
            .should('exist')                
            .should('have.attr', 'ng-reflect-value', '95')
        cy.wait(4000)
        cy.get('[data-cy="notfound-redirect-spinner"]')
            .should('have.attr', 'ng-reflect-value', '75')
    })
})