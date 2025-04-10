/// <reference types="cypress" />
describe('Testing validations in fields when registering a new user', () => {

    beforeEach(()=>{
        cy.visit("http://localhost:4200/auth/register")
        cy.get("input[ng-reflect-id='username']").as("usernameInput")
        cy.get("input[ng-reflect-id='email']").as("emailInput")
        cy.get("input[ng-reflect-id='password']").as("passwordInput")
        cy.get("input[ng-reflect-id='passwordAgain']").as("passwordAgainInput")
        cy.get("form > div > button[type='submit']").as("submitButton")
    })

    it('Registration button unactivated without form filled out', () => {
        cy.get("@submitButton").should("be.disabled")
      })
      it("username field should be atleast 3 characters long",()=>{
        cy.get("@usernameInput").click({force:true})
        cy.get("@emailInput").click({force:true})
        cy.get("mat-error#mat-mdc-error-0 > span").as("usernameError")
        cy.get("@usernameError").should("contain.text","Felhasználónév kitöltése kötelező")
        cy.get("@usernameInput").type("a",{force:true})
        cy.get("@emailInput").click({force:true})
        cy.get("@usernameError").should("contain.text","A felhasználónév legalább 3 karaktert tartalmazzon")
        cy.get("@usernameInput").type("aaa",{force:true})
        cy.get("@usernameError").should("not.exist")
      })
      it("email field correct format",()=>{
        cy.get("@emailInput").click({force:true})
        cy.get("@usernameInput").click({force:true})
    
        cy.get("mat-error#mat-mdc-error-0 > span").as("emailError")
        cy.get("@emailError").should("contain.text","Email kitöltése kötelező")
    
        cy.get("@emailInput").type("a",{force:true})
        cy.get("@usernameInput").click({force:true})
    
        cy.get("@emailError").should("contain.text","Formátum nem megfelelő")
    
        cy.get("@emailInput").type("@",{force:true})
        cy.get("@usernameInput").click({force:true})
    
        cy.get("@emailError").should("contain.text","Formátum nem megfelelő")
        cy.get("@emailInput").type("gmail",{force:true})
    
        cy.get("@emailError").should("contain.text","Formátum nem megfelelő")
    
        cy.get("@emailInput").type(".com",{force:true})
        cy.get("@emailError").should("not.exist")
      })
      it("password field atleast 4 characters long",()=>{
        cy.get("@passwordInput").click({force:true})
        cy.get("@usernameInput").click({force:true})
    
        cy.get("mat-error#mat-mdc-error-0 > span").as("passwordError")
        cy.get("@passwordError").should("contain.text","Jelszó kitöltése kötelező")
    
        cy.get("@passwordInput").type("a",{force:true})
        cy.get("@passwordError").should("contain.text","A jelszó legalább 4 karaktert tartalmazzon")
    
        cy.get("@passwordInput").type("aaa",{force:true})    
        cy.get("@passwordError").should("not.exist")
      })
      it("password again has to match",()=>{
        cy.get("@passwordInput").type("jelszo",{force:true})    
        cy.get("@passwordAgainInput").click({force:true})
        cy.get("@passwordInput").click({force:true})
    
        cy.get("mat-error#mat-mdc-error-1 > span").as("passwordAgainError")
        cy.get("@passwordAgainError").should("contain.text","Mező kitöltése kötelező")
    
        cy.get("@passwordAgainInput").type("j",{force:true})    
        cy.get("@passwordInput").click({force:true})
        cy.get("@passwordAgainError").should("contain.text","A jelszavak nem egyeznek")
    
        cy.get("@passwordAgainInput").type("elszo",{force:true})    
        cy.get("@passwordAgainError").should("not.exist")
      })
      it("registration button activated when form correctly filled out",()=>{
        cy.get("@usernameInput").type("user",{force:true})
        cy.get("@emailInput").type("user@gmail.com",{force:true})
        cy.get("@passwordInput").type("jelszo",{force:true})    
        cy.get("@passwordAgainInput").type("jelszo",{force:true})    
        cy.get("@submitButton").should("be.enabled")
      })

})