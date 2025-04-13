/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

beforeEach(() => {
    cy.setLangToEn();
    cy.loginAdmin();
    cy.get('simple-snack-bar button')
        .contains('Close')
        .click();
    cy.wait(150);
})

describe('Testing the Create page', () => {
    describe('Book creation', () => {

        beforeEach(() => {
            cy.visit('http://localhost:4200/create/book')
            cy.get('input[ng-reflect-id="title"]')
                .as('titleInput')
            cy.get('input[ng-reflect-id="author"]')
                .as('authorInput')
            cy.get('input[ng-reflect-id="release"]')
                .as('dateInput')
            cy.get('[ng-reflect-id="genre"]')
                .as('genreSelect')
            cy.get('textarea[ng-reflect-id="description"]')
                .as('descInput')
            cy.get('[data-cy="create-btn-submit"]')
                .as('submit')
        })

        it('Should navigate to login if user tries to access create without logging in', () => {
            cy.get('[data-cy="navbar-menu-profile"]')
                .click()
            cy.get('[data-cy="navbar-routeBtn-exit"]')
                .eq(1)
                .click()
            cy.visit('http://localhost:4200/create/book')
            cy.url().should('eq', 'http://localhost:4200/auth/login')
        })

        it('Should validate input fields', () => {
            cy.get('[data-cy="error-title"]')
                .should('not.exist')
            cy.get('[data-cy="error-release"]')
                .should('not.exist')
            cy.get('[data-cy="error-description"]')
                .should('not.exist')

            cy.get('@titleInput')
                .should('exist')
                .click()
            cy.get('@dateInput')
                .should('exist')
                .type('invalid')
            cy.get('@descInput')
                .should('exist')
                .click()
            cy.get('@authorInput')
                .should('exist')
                .click()
                .should('exist')
            cy.get('[data-cy="error-title"]')
                .and('contain.text', 'This field is required')
            cy.get('[data-cy="error-release"]')
                .should('exist')
                .and('contain.text', 'Invalid format')
            cy.get('[data-cy="error-description"]')
                .should('exist')
                .and('contain.text', 'This field is required')
            cy.get('@submit')
                .should('exist')
                .should('be.disabled')

            cy.get('@titleInput')
                .type('testTitle')
            cy.get('@dateInput')
                .clear()
                .type('1')
            cy.get('@descInput')
                .type('testDescription')
            cy.get('@authorInput')
                .click()

            cy.get('[data-cy="error-title"]')
                .should('not.exist')
            cy.get('[data-cy="error-release"]')
                .should('not.exist')
            cy.get('[data-cy="error-description"]')
                .should('not.exist')
            cy.get('@submit')
                .should('be.enabled')
        })

        it('Should bind input values to example output', () => {
            cy.get('[data-cy="create-ex-img"]')
                .as('coverImg')
                .should('exist')
                .should('have.attr', 'src')
                .and('include', 'assets/images/no-cover.svg');
            cy.get('[data-cy="create-ex-title"]')
                .as('exTitle')
                .should('exist')
                .should('contain.text', 'Book Title')
            cy.get('[data-cy="create-ex-author"]')
                .as('exAuthor')
                .should('exist')
                .should('contain.text', 'Author')
            cy.get('[data-cy="create-ex-release"]')
                .as('exRelease')
                .should('exist')
                .should('contain.text', 'Release date')

            cy.get('#image')
                .selectFile('cypress/fixtures/testCover.jpg', { force: true });
            cy.get('@titleInput')
                .type('TestTitle')
            cy.get('@authorInput')
                .type('Test Author')
            cy.get('@dateInput')
                .type('3/3/1978')

            cy.get('@coverImg')
                .should('have.attr', 'src')
                .and('not.include', 'assets/images/no-cover.svg')
            cy.get('@exTitle')
                .should('contain.text', 'TestTitle')
            cy.get('@exAuthor')
                .should('contain.text', 'Test Author')
            cy.get('@exRelease')
                .should('contain.text', '1978')
        })

        it('Should create a book and navigate to /books', () => {
            cy.intercept({ method: "POST", url: "**/api/books" }, { statusCode: 200, body: {} }).as("createBook")
            cy.get('#image')
                .selectFile('cypress/fixtures/testCover.jpg', { force: true });
            cy.get('@titleInput')
                .type('TestTitle')
            cy.get('@authorInput')
                .type('Test Author')
            cy.get('@dateInput')
                .type('3/3/1978')
            cy.get('@descInput')
                .type('testDescription')
            cy.get('@submit')
                .click()
            cy.wait('@createBook')
            cy.url().should('eq', 'http://localhost:4200/books')
        })
    })

    describe('Summary creation', () => {
        beforeEach(() => {
            cy.visit('http://localhost:4200/books')
            cy.get('[data-cy="bd-content-bookcard"]')
                .eq(0)
                .click()
            cy.get('[data-cy="booki-btn-newsumm"]')
                .click();
            cy.get('textarea[ng-reflect-id="content"]')
                .as('contentTextarea')
            cy.get('[data-cy="create-btn-submit"]')
                .as('submit')
        })

        it('Should validate input field', () => {
            cy.get('@contentTextarea')
                .should('exist')
            cy.get('[data-cy="error-content"]')
                .should('not.exist')
            cy.get('@submit')
                .should('exist')
                .should('be.disabled')

            cy.get('@contentTextarea')
                .click()
            cy.get('#form-card')
                .click({ force: true })
            cy.get('[data-cy="error-content"]')
                .should('exist')
                .should('contain.text', 'This field is required')

            cy.get('@contentTextarea')
                .type('testContent')
            cy.get('[data-cy="error-content"]')
                .should('not.exist')
            cy.get('@submit')
                .should('be.enabled')
        })

        it('Should create a summary and navigate to /summaries', () => {
            cy.intercept({ method: "POST", url: "**/api/summaries" }, { statusCode: 200, body: {} }).as("createSummary")
            cy.get('@contentTextarea')
                .type('testContent')
            cy.get('@submit')
                .click()
            cy.wait('@createSummary')
            cy.url().should('eq', 'http://localhost:4200/summaries')
        })
    })
})