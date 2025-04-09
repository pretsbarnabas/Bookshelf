/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Testing the navbar component', () => {
    before(() => {
        cy.setLangToEn();
    })

    beforeEach(() => {
        cy.visit("http://localhost:4200/home")
    })

    it('Should contain app logo', () => {
        cy.get('.mat-toolbar-row > .app-icon').should('exist')
            .should('have.attr', 'src')
            .and('include', './assets/favicon.ico')
    })

    it('Should have appropriate router-buttons for visitors only', () => {
        ['home', 'books', 'summaries', 'auth/login', 'auth/register'].forEach(btn =>{
            testRouterButton(btn)
        })        
        cy.get(`[data-cy="navbar-routeBtn-mylist"]`).should('not.exist')
        cy.get(`[data-cy="navbar-routeBtn-admin`).should('not.exist')
    })

    it('Should have appropriate router-buttons for admin level users', ()=>{
        cy.loginAdmin();
        ['home', 'books', 'summaries', 'mylist', 'admin'].forEach(btn =>{
            testRouterButton(btn)
        }) 
        cy.get(`[data-cy="navbar-routeBtn-auth/login"]`).should('not.exist')
        cy.get(`[data-cy="navbar-routeBtn-auth/register`).should('not.exist')
    })
})

function testRouterButton(btn) {    
    cy.get(`[data-cy="navbar-routeBtn-${btn}"]`).as('btn')
    cy.get('@btn').should('exist')
    if(btn.includes('/'))
        btn = btn.split('/')[1]
    cy.get('@btn').should('contain.text' ,btn.charAt(0).toUpperCase() + btn.slice(1))
}