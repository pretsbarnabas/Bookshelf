/// <reference types="cypress" />
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

Cypress.Commands.add("defineInterceptors",()=>{
    cy.intercept({method: "POST",url: "/api/users*"},{statusCode: 201}).as("register")
    cy.intercept({method: "POST",url: "/api/login*"},{statusCode: 200, body:{token:Cypress.env("exampleToken")}}).as("login")
    cy.intercept({method: "GET",url: "/api/users*"},{statusCode: 200, body:{}}).as("getUser")
    cy.intercept({method: "GET",url: "/api/users/*"},{statusCode: 200, body:{username: Cypress.env("username")}}).as("getUser")
})

Cypress.env("exampleToken","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJhcm5pIiwicm9sZSI6InVzZXIiLCJpZCI6IjY3ZTUwNDk4OTY4YjM3YTAwNWQ4NTc5YSIsImlhdCI6MTc0MzA2MjE5MSwiZXhwIjoxNzQzMDY1NzkxfQ.NVbT1cSd_mWSKzsvaFCM465zDrAPLq_93uO_Jn4CQ1k")
Cypress.env("username","barni")
Cypress.env("host","http://localhost:4200")