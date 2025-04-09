/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Testing validations in fields when registering a new user', () => {

    before(() => {
        cy.setLangToEn();
    })

    beforeEach(() => {
        cy.visit("http://localhost:4200/auth/register")
        cy.get("input[ng-reflect-id='username']").as("usernameInput")
        cy.get("input[ng-reflect-id='email']").as("emailInput")
        cy.get("input[ng-reflect-id='password']").as("passwordInput")
        cy.get("input[ng-reflect-id='passwordAgain']").as("passwordAgainInput")
        cy.get('[data-cy="auth-btn-next"]').as("nextButton")
    })

    it('Registration button unactivated without form filled out', () => {
        cy.get("@nextButton").should("be.disabled")
    })
    it("username field should be atleast 3 characters long", () => {
        cy.get("@usernameInput").click({ force: true })
        cy.get("@emailInput").click({ force: true })
        cy.get('[data-cy="error-username"]').as("usernameError")
        cy.get("@usernameError").should("contain.text", " Username field is required")
        cy.get("@usernameInput").type("a", { force: true })
        cy.get("@emailInput").click({ force: true })
        cy.get("@usernameError").should("contain.text", " Username must be at least 3 characters long")
        cy.get("@usernameInput").type("aaa", { force: true })
        cy.get("@usernameError").should("not.exist")
    })
    it("email field correct format", () => {
        cy.get("@emailInput").click({ force: true })
        cy.get("@usernameInput").click({ force: true })

        cy.get('[data-cy="error-email"]').as("emailError")
        cy.get("@emailError").should("contain.text", " Email field is required")

        cy.get("@emailInput").type("a", { force: true })
        cy.get("@usernameInput").click({ force: true })

        cy.get("@emailError").should("contain.text", " Incorrect format")

        cy.get("@emailInput").type("@", { force: true })
        cy.get("@usernameInput").click({ force: true })

        cy.get("@emailError").should("contain.text", " Incorrect format")
        cy.get("@emailInput").type("gmail", { force: true })

        cy.get("@emailError").should("contain.text", " Incorrect format")

        cy.get("@emailInput").type(".com", { force: true })
        cy.get("@emailError").should("not.exist")
    })
    it("password field atleast 4 characters long", () => {
        cy.get("@passwordInput").click({ force: true })
        cy.get("@usernameInput").click({ force: true })

        cy.get('[data-cy="error-password"]').as("passwordError")
        cy.get("@passwordError").should("contain.text", " Password field is required")

        cy.get("@passwordInput").type("a", { force: true })
        cy.get("@passwordError").should("contain.text", " Password must be at least 4 characters long")

        cy.get("@passwordInput").type("aaa", { force: true })
        cy.get("@passwordError").should("not.exist")
    })
    it("password again has to match", () => {
        cy.get("@passwordInput").type("jelszo", { force: true })
        cy.get("@passwordAgainInput").click({ force: true })
        cy.get("@passwordInput").click({ force: true })

        cy.get('[data-cy="error-passwordAgain"]').as("passwordAgainError")
        cy.get("@passwordAgainError").should("contain.text", " This field is required")

        cy.get("@passwordAgainInput").type("j", { force: true })
        cy.get("@passwordInput").click({ force: true })
        cy.get("@passwordAgainError").should("contain.text", " Passwords do not match")

        cy.get("@passwordAgainInput").type("elszo", { force: true })
        cy.get("@passwordAgainError").should("not.exist")
    })
    it("next button activated when form correctly filled out", () => {
        cy.get("@usernameInput").type("user", { force: true })
        cy.get("@emailInput").type("user@gmail.com", { force: true })
        cy.get("@passwordInput").type("jelszo", { force: true })
        cy.get("@passwordAgainInput").type("jelszo", { force: true })
        cy.get("@nextButton").should("be.enabled")
    })

})