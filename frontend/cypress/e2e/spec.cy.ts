/// <reference types="cypress" />

describe('template spec', () => {
  before(()=>{
    cy.task("seedDatabase")
  })
  it('passes', () => {
    cy.visit("http://localhost:4200/auth/register")


    cy.get("input[ng-reflect-id='username']").as("usernameInput")
    cy.get("input[ng-reflect-id='email']").as("emailInput")
    cy.get("input[ng-reflect-id='password']").as("passwordInput")
    cy.get("input[ng-reflect-id='passwordAgain']").as("passwordAgainInput")
    cy.get("button[type='submit']").as("submitButton")

    cy.get("@usernameInput").click({force:true})
    cy.get("@usernameInput").type("barni",{force:true})
    cy.get("@emailInput").click({force:true})
    cy.get("@emailInput").type("barni@gmail.com",{force:true})
    cy.get("@passwordInput").click({force:true})
    cy.get("@passwordInput").type("jelszo",{force:true})
    cy.get("@passwordInput").click({force:true})
    cy.get("@passwordAgainInput").type("jelszo",{force:true}) 

    cy.get("@submitButton").click({force:true})
  })
})