/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

Cypress.Commands.add('dragAndDropCdk', (dragSelector, dropSelector) => {
    cy.get(dragSelector).trigger('mousedown', { which: 1 });

    cy.get(dragSelector)
        .trigger('dragstart')
        .trigger('drag', { dataTransfer: new DataTransfer() });

    cy.get(dropSelector)
        .trigger('dragenter')
        .trigger('dragover', { force: true })
        .trigger('drop', { force: true });

    cy.get(dragSelector).trigger('dragend');
});


beforeEach(() => {
    cy.setLangToEn();
    cy.loginAdmin();
    cy.visit("http://localhost:4200/mylist")
})

describe('Testing the home page', () => {
    it('Should navigate to login if user tries to access create without logging in', () => {
        cy.get('[data-cy="navbar-menu-profile"]')
            .click()
        cy.get('[data-cy="navbar-routeBtn-exit"]')
            .eq(1)
            .click()
        cy.visit('http://localhost:4200/mylist')
        cy.url().should('eq', 'http://localhost:4200/auth/login')
    })

    it('Should delete book from mylist', ()=>{
        cy.intercept({ method: "PUT", url: "**/api/users/**/booklist" }, { statusCode: 200, body: {} }).as("updateBookStatus")
        cy.get('[data-cy="mylist-card-delete"]')
            .should('exist')
            .click()
        
        cy.wait('@updateBookStatus')
    })

    it('Should favourite a book', ()=>{
        cy.intercept({ method: "PUT", url: "**/api/users/**/booklist" }, { statusCode: 200, body: {} }).as("updateBookStatus")
        cy.get('[data-cy="mylist-card-favourite"]')
            .should('exist')
            .click()
        
        cy.wait('@updateBookStatus')
    })
})

