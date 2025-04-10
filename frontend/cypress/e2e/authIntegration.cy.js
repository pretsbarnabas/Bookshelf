/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Testing the authentication system when registering and logging in', () => {

    before(() => {
        cy.task("seedDatabase")
    })

    beforeEach(() => {
        cy.setLangToEn();
        cy.visit("http://localhost:4200/auth/register")

        cy.defineInterceptors()
        cy.get("input[ng-reflect-id='username']").as("usernameInput")
        cy.get("input[ng-reflect-id='email']").as("emailInput")
        cy.get("input[ng-reflect-id='password']").as("passwordInput")
        cy.get("input[ng-reflect-id='passwordAgain']").as("passwordAgainInput")
        cy.get('[data-cy="auth-btn-next"]').as("nextButton")
    })

    it('should register properly', () => {
        cy.get("@usernameInput").click({ force: true })
        cy.get("@usernameInput").type("barni", { force: true })
        cy.get("@emailInput").click({ force: true })
        cy.get("@emailInput").type("barni@gmail.com", { force: true })
        cy.get("@passwordInput").click({ force: true })
        cy.get("@passwordInput").type("jelszo", { force: true })
        cy.get("@passwordAgainInput").click({ force: true })
        cy.get("@passwordAgainInput").type("jelszo", { force: true })

        cy.get("@nextButton").click({ force: true })
        cy.get('[data-cy="auth-btn-skip"]').click({ force: true })
        cy.get('[data-cy="auth-btn-register"]').click({ force: true })
        cy.wait("@register")
        cy.wait("@login")
        // cy.getAllLocalStorage().then((result) => {
        //     expect(result[Cypress.env("host")]["authToken"]).to.equal(Cypress.env("exampleToken"));
        // });
    })

    it("should login properly", () => {
        cy.visit("http://localhost:4200/auth/login")

        cy.get("input[ng-reflect-id='username']").as("usernameInput")
        cy.get("input[ng-reflect-id='password']").as("passwordInput")
        cy.get("@usernameInput").click({ force: true })
        cy.get("@usernameInput").type("barni", { force: true })
        cy.get("@passwordInput").click({ force: true })
        cy.get("@passwordInput").type("jelszo", { force: true })
        cy.get("button[type='submit']").as("submitButton")
        cy.get("@submitButton").click({ force: true })

        cy.wait("@login")

        // cy.getAllLocalStorage().then((result) => {
        //   expect(result[Cypress.env("host")]["authToken"]).to.equal(Cypress.env("exampleToken"))
        // })
    })
})