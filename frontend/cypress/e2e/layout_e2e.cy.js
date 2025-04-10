/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Testing the navbar component', () => {
    beforeEach(() => {
        cy.setLangToEn();
        cy.visit("http://localhost:4200/home")
        cy.get('[data-cy="navbar-btn-settings"]').as('settingsButton')
        cy.get('#app').as('appElement')
    })

    it('Should contain app logo', () => {
        cy.get('.mat-toolbar-row > .app-icon').should('exist')
            .should('have.attr', 'src')
            .and('include', './assets/favicon.ico')
    })

    it('Should have appropriate router-buttons for visitors only', () => {
        ['home', 'books', 'summaries', 'auth/login', 'auth/register'].forEach(btn => {
            testRouterButton(btn)
        })
        cy.get(`[data-cy="navbar-routeBtn-mylist"]`).should('not.exist')
        cy.get(`[data-cy="navbar-routeBtn-admin`).should('not.exist')
    })

    it('Should have appropriate router-buttons for admin level users', () => {
        cy.loginAdmin();
        ['home', 'books', 'summaries', 'mylist', 'admin'].forEach(btn => {
            testRouterButton(btn)
        })
        cy.get(`[data-cy="navbar-routeBtn-auth/login"]`).should('not.exist')
        cy.get(`[data-cy="navbar-routeBtn-auth/register`).should('not.exist')
    })

    it('Should change the theme in settings menu', () => {
        cy.get('body').as('bodyElement')
        cy.get('@bodyElement').should('not.have.class', 'darkMode').should('have.css', 'background-color', 'rgb(238, 238, 255)');
        cy.get('@settingsButton').click({ force: true });
        cy.get('[data-cy="navbar-themeToggle"]').click();
        cy.get('@bodyElement').should('have.class', 'darkMode').should('have.css', 'background-color', 'rgb(51, 51, 68)');
    })

    it('Should toggle eyeSaveMode in settings menu', () => {
        cy.get('@appElement').should('not.have.class', 'eyeSaverMode').should('not.have.css', 'filter', 'sepia(0.6) saturate(1.2) contrast(0.9) brightness(0.9)');
        cy.get('@settingsButton').click({ force: true });
        cy.get('[data-cy="navbar-eyeSaveToggle"]').click();
        cy.get('@appElement').should('have.class', 'eyeSaverMode').should('have.css', 'filter', 'sepia(0.6) saturate(1.2) contrast(0.9) brightness(0.9)');
    })

    it('Should apply accessibility filters and toggle between them', () => {
        cy.get('@appElement').should('not.have.class', 'colorblind-red-green').should('not.have.css', 'filter', 'hue-rotate(-20deg) saturate(6) contrast(0.9)');
        clickColorBlindnessButton('redgreen')
        cy.get('@appElement').should('have.class', 'colorblind-red-green').should('have.css', 'filter', 'hue-rotate(-20deg) saturate(6) contrast(0.9)');
        clickColorBlindnessButton('blueyellow')
        cy.get('@appElement')
            .should('not.have.class', 'colorblind-red-green')
            .should('not.have.css', 'filter', 'hue-rotate(-20deg) saturate(6) contrast(0.9)')
            .should('have.class', 'colorblind-blue-yellow')
            .should('have.css', 'filter', 'hue-rotate(180deg) saturate(5)');
        clickColorBlindnessButton('monochrome')
        cy.get('@appElement').should('have.class', 'colorblind-monochrome').should('have.css', 'filter', 'grayscale(1) contrast(1.2)');
    })

    it('Should route correctly with the menu buttons', () => {
        ['books', 'summaries', 'auth/login', 'auth/register', 'home'].forEach(btn => {
            testRouting(btn)
        })
        cy.loginAdmin();
        cy.get('simple-snack-bar button')
            .contains('Close')
            .click();
        ['mylist', 'admin'].forEach(btn => {
            testRouting(btn)
        })
    })
})

describe('Testing the footer component', () => {
    beforeEach(() => {
        cy.setLangToEn();
        cy.visit("http://localhost:4200/home")
    })

    it('Should contain book.gif', () => {
        cy.get('#book-gif').should('exist')
            .should('have.attr', 'src')
            .and('include', './assets/images/book.gif')
    })

    it('Should contain a quote', () => {
        cy.get('#quote')
            .should('exist')
            .invoke('text')
            .then((text) => {
                expect(text.trim().length).to.be.greaterThan(0);
            });
    })
})

function testRouterButton(btn) {
    cy.get(`[data-cy="navbar-routeBtn-${btn}"]`).as('btn')
    cy.get('@btn').should('exist')
    if (btn.includes('/'))
        btn = btn.split('/')[1]
    cy.get('@btn').should('contain.text', btn.charAt(0).toUpperCase() + btn.slice(1))
}

function clickColorBlindnessButton(btn) {
    cy.get('@settingsButton').click({ force: true });
    cy.get('[data-cy="navbar-btn-accessibility"]').should('exist').click({ force: true })
    cy.get(`[data-cy="navbar-cbBtn-${btn}"]`).as('btn')
    cy.get('@btn').should('exist').click({ force: true })
}

function testRouting(btn) {
    cy.get(`[data-cy="navbar-routeBtn-${btn}"]`).eq(0).as('btn')
    cy.get('@btn').should('exist')
    cy.get('@btn').click()
    cy.url().should('eq', `http://localhost:4200/${btn}`)
}