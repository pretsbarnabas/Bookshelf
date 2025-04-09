/// <reference types="cypress" />
import CryptoJS from 'crypto-js';
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("defineInterceptors", () => {
    cy.intercept({ method: "POST", url: "/api/users*" }, { statusCode: 201 }).as("register")
    cy.intercept({ method: "POST", url: "/api/login*" }, { statusCode: 200, body: { token: Cypress.env("exampleToken") } }).as("login")
    cy.intercept({ method: "GET", url: "/api/users*" }, { statusCode: 200, body: {} }).as("getUser")
    cy.intercept({ method: "GET", url: "/api/users/*" }, { statusCode: 200, body: { username: Cypress.env("username") } }).as("getUser")
    cy.intercept('POST', '/api/refreshToken', { statusCode: 200, body: { token: Cypress.env('exampleToken') }, }).as('refreshToken');
})

Cypress.Commands.add("setLangToEn", () => {
    cy.visit("http://localhost:4200/auth/register")
    cy.get('[data-cy="navbar-btn-settings"]').as('settingsButton').click({ force: true });
    cy.get('[data-cy="navbar-langToggle-en"]').should('be.visible').should('not.be.disabled').click();
    cy.get('@settingsButton').click({ force: true });
})

Cypress.Commands.add("loginAdmin", () => {    
    cy.intercept('POST', '/api/login').as('login');
    cy.visit("http://localhost:4200/auth/login")
    cy.get("input[ng-reflect-id='username']").click({ force: true }).type("admin", { force: true })
    cy.get("input[ng-reflect-id='password']").click({ force: true }).type("admin", { force: true })    
    cy.get("button[type='submit']").click({ force: true })
    cy.wait('@login');
})

Cypress.env("exampleToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJhcm5pIiwicm9sZSI6InVzZXIiLCJpZCI6IjY3ZTUwNDk4OTY4YjM3YTAwNWQ4NTc5YSIsImlhdCI6MTc0MzA2MjE5MSwiZXhwIjoxNzQzMDY1NzkxfQ.NVbT1cSd_mWSKzsvaFCM465zDrAPLq_93uO_Jn4CQ1k")
Cypress.env("username", "barni")
Cypress.env("host", "http://localhost:4200")