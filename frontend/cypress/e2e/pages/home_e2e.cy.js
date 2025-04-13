/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Testing the home page', () => {
    beforeEach(() => {
        cy.setLangToEn();
        cy.visit("http://localhost:4200/home")
    })

    it('Should contain logo and buttons for visitors', () => {
        cy.get('[data-cy="home-img-logo"]')
            .should('exist')
            .should('have.attr', 'src')
            .and('include', './assets/images/logo.svg');

        [
            { btn: 'register', label: 'Register' },
            { btn: 'login', label: 'Login' },
            { btn: 'books', label: 'Discover our latest books' },
            { btn: 'summaries', label: 'Discover our latest summaries' }
        ].forEach(payload => {
            testHomeButton(payload.btn, payload.label)
        });
        cy.get('[data-cy="home-text-join"]')
            .should('exist')
            .should('contain.text', 'Please log in or register to continue')
    })

    it('Should not show auth buttons after login', () => {
        cy.loginAdmin();
        cy.get('[data-cy="home-btn-register"]').should('not.exist')
        cy.get('[data-cy="home-btn-login"]').should('not.exist')
        cy.get('[data-cy="home-text-join"]')
            .should('not.exist')            
    })

    it('Should show both drawers with items', () => {
        cy.get('[data-cy="home-btn-books"]').click()
        cy.get('[data-cy="home-drawer-books"]')
            .should('be.visible')            
        cy.get('[data-cy="home-drawer-books"]').its('length').should('be.gt', 0)
        cy.get('[data-cy="home-drawer-bookcard"]').should('have.length.greaterThan', 0)
        cy.get('.wrapper > .mat-drawer-container > .mat-drawer-backdrop').click()

        cy.get('[data-cy="home-btn-summaries"]').click()
        cy.get('[data-cy="home-drawer-summaries"]')
            .should('be.visible')
        cy.get('[data-cy="home-drawer-summaries"]').its('length').should('be.gt', 0)
        cy.get('[data-cy="home-drawer-summarycard"]').should('have.length.greaterThan', 0)
        cy.get('.wrapper > .mat-drawer-container > .mat-drawer-backdrop').click()
    })

    function testHomeButton(btn, label) {
        cy.get(`[data-cy="home-btn-${btn}"]`).as('btn')
        cy.get('@btn').should('exist')
        cy.get('@btn').should('contain.text', label)
    }
})