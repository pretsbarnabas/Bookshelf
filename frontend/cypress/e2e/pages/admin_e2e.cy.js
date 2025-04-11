/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

Cypress.Commands.add('closeSnackBar', () => {
    cy.get('simple-snack-bar button')
        .contains('Close')
        .click();
    cy.wait(150);
})

beforeEach(() => {
    cy.setLangToEn();
    cy.loginAdmin();
    cy.get('simple-snack-bar button')
        .contains('Close')
        .click();
    cy.wait(150);
    cy.get('[data-cy="navbar-routeBtn-admin"]')
        .eq(0)
        .click()
})

describe('Testing the Admin page', () => {
    it('Should navigate to login if user tries to access admin without logging in', () => {
        cy.get('[data-cy="navbar-menu-profile"]')
            .click()
        cy.get('[data-cy="navbar-routeBtn-exit"]')
            .eq(1)
            .click()
        cy.visit('http://localhost:4200/admin')
        cy.url().should('eq', 'http://localhost:4200/auth/login')
    })

    it('Should have custom paginator and all-type display elements', () => {
        cy.get(`[data-cy="allt-card"]`)
            .should('exist');
        cy.get('#custom-paginator')
            .should('exist')
    });

    it('Should have all-type-display with editor role tabs', () => {
        [
            ['allt-tab-users', 'Users'],
            ['allt-tab-books', 'Books'],
            ['allt-tab-summaries', 'Summaries'],
            ['allt-tab-comments', 'Comments'],
            ['allt-tab-reviews', 'Reviews']
        ].forEach(s => testItemExists(s[0], s[1]))
    });

    it('Should navigate between tabs', () => {
        [
            ['allt-tab-users', 'allt-tabcontent-users'],
            ['allt-tab-books', 'allt-tabcontent-books'],
            ['allt-tab-summaries', 'allt-tabcontent-summaries'],
            ['allt-tab-comments', 'allt-tabcontent-comments'],
            ['allt-tab-reviews', 'allt-tabcontent-reviews'],
            ['allt-tab-users', 'allt-tabcontent-users'],
            ['allt-tab-comments', 'allt-tabcontent-comments']
        ].forEach(s => testNavigation(s[0], s[1]))
    });

    describe('Testing Admin page items', () => {
        describe('User type', () => {
            it('Should contain user type specific fields', () => {
                testNavigation('allt-tab-users', 'allt-tabcontent-users');
                [
                    'ei-btn-visitprofile', 'ei-btn-promote', 'ei-btn-demote', 'ei-btn-delete', 'ei-btn-admin',
                    'ei-tuser-img', 'ei-tuser-username', 'ei-tuser-id', 'ei-tuser-role',
                ].forEach(s => testTypeSpecificContent(s));
                cy.get('#mat-expansion-panel-header-1').click();

                ['ei-tuser-email', 'ei-datedisplay']
                    .forEach(s => testTypeSpecificContent(s));
            })

            it('Should navigate to user profile', () => {
                cy.get('#mat-expansion-panel-header-1 > .mat-content > .row > .justify-content-end > [data-cy="ei-btn-visitprofile"] > .mat-icon')
                    .click()
                cy.url().should('eq', 'http://localhost:4200/profile')
            })

            it('Should promote/demote user', () => {
                cy.get('#mat-expansion-panel-header-2 > .mat-content > .row > :nth-child(4) > .mat-expansion-panel-header-description > [data-cy="ei-tuser-role"] > .mdc-evolution-chip__cell > .mdc-evolution-chip__action > .mdc-evolution-chip__text-label')
                    .as('userRole')
                    .should('contain.text', 'user')
                cy.get('#mat-expansion-panel-header-2 > .mat-content > .row > .justify-content-end > [data-cy="ei-btn-promote"] > .mat-icon')
                    .click()
                cy.get(`[data-cy="itemd-roleedit-header"]`)
                    .as('itemDialog')
                    .should('exist')
                    .should('contain.text', 'Change role?')
                cy.get(`[data-cy="itemd-roleedit-save"]`)
                    .as('saveButton')
                    .should('exist')
                    .click({ force: true })
                cy.wait(150);
                cy.closeSnackBar();
                cy.wait(200);
                cy.get('#mat-expansion-panel-header-2 > .mat-content > .row > :nth-child(4) > .mat-expansion-panel-header-description > [data-cy="ei-tuser-role"] > .mdc-evolution-chip__cell > .mdc-evolution-chip__action > .mdc-evolution-chip__text-label')
                    .should('contain.text', 'editor')
                cy.get('#mat-expansion-panel-header-2 > .mat-content > .row > .justify-content-end > [data-cy="ei-btn-demote"] > .mat-icon')
                    .click()
                cy.get('@itemDialog')
                    .should('exist')
                    .should('contain.text', 'Change role?')
                cy.get('@saveButton')
                    .click()
                cy.wait(150);
                cy.closeSnackBar();
                cy.wait(200);
                cy.get('@userRole')
                    .should('contain.text', 'user')
            })

            it('Should delete user', () => {
                cy.intercept({ method: "DELETE", url: "**/api/users/**" }, { statusCode: 200, body: {} }).as("deleteUser")
                cy.get('#mat-expansion-panel-header-2 > .mat-content > .row > .justify-content-end > [data-cy="ei-btn-delete"] > .mat-icon')
                    .should('exist')
                    .click({ force: true })
                cy.get(`[data-cy="itemd-delete-header"]`)
                    .should('exist')
                    .should('contain.text', 'Delete?')
                cy.get(`[data-cy="itemd-btn-delete"]`)
                    .should('exist')
                    .click({ force: true })
                cy.wait('@deleteUser')
            })
        });

        describe('Book type', () => {
            beforeEach(() => {
                testNavigation('allt-tab-books', 'allt-tabcontent-books');
            })

            it('Should contain book type specific fields', () => {
                [
                    'ei-btn-visitbook', 'ei-btn-edit', 'ei-btn-delete',
                    'ei-tbook-title', 'ei-tbook-id'
                ].forEach(s => testTypeSpecificContent(s));
                cy.get('#mat-expansion-panel-header-25').click();
                ['ei-tbook-img', 'ei-datedisplay', 'ei-tbook-release', 'ei-tbook-genre', 'ei-tbook-author', 'ei-tbook-desc']
                    .forEach(s => testTypeSpecificContent(s));
            })

            it('Should navigate to book-item containing book', () => {
                cy.get('#mat-expansion-panel-header-25 > .mat-content > .row > .justify-content-end > [data-cy="ei-btn-visitbook"] > .mat-icon')
                    .click()
                cy.url().should('eq', 'http://localhost:4200/book-item')
            })

            it('Should edit book', () => {
                cy.get(`[data-cy="ei-tbook-title"]`)
                    .as('bookTitle')
                    .should('contain.text', 'Lorem')
                cy.get('#mat-expansion-panel-header-25 > .mat-content > .row > .d-flex > [data-cy="ei-btn-edit"] > .mat-icon')
                    .click()
                cy.get(`[data-cy="itemd-edit-header"]`)
                    .as('itemDialog')
                    .should('exist')
                    .should('contain.text', 'Edit item')
                cy.get("input").eq(0).as("titleInput")
                    .should('exist')
                    .clear()
                    .type('TestTitle')
                cy.get(`[data-cy="itemd-edit-save"]`)
                    .as('saveButton')
                    .should('exist')
                    .click({ force: true })
                cy.wait(150);
                cy.closeSnackBar();
                cy.wait(200);
                cy.get('@bookTitle')
                    .should('contain.text', 'TestTitle')
                cy.get('#mat-expansion-panel-header-25 > .mat-content > .row > .d-flex > [data-cy="ei-btn-edit"] > .mat-icon')
                    .click()
                cy.get('@itemDialog')
                    .should('exist')
                    .should('contain.text', 'Edit item')
                cy.get('@titleInput')
                    .should('exist')
                    .clear()
                    .type('Lorem')
                cy.get('@saveButton')
                    .should('exist')
                    .click({ force: true })
                cy.wait(150);
                cy.closeSnackBar();
                cy.wait(200);
                cy.get('@bookTitle')
                    .should('contain.text', 'Lorem')
            })

            it('Should delete book', () => {
                cy.intercept({ method: "DELETE", url: "**/api/books/**" }, { statusCode: 200, body: {} }).as("deleteBook")
                cy.get('#mat-expansion-panel-header-25 > .mat-content > .row > .justify-content-end > [data-cy="ei-btn-delete"] > .mat-icon')
                    .should('exist')
                    .click({ force: true })
                cy.get(`[data-cy="itemd-delete-header"]`)
                    .should('exist')
                    .should('contain.text', 'Delete?')
                cy.get(`[data-cy="itemd-btn-delete"]`)
                    .should('exist')
                    .click({ force: true })
                cy.wait('@deleteBook')
            })
        })

        describe('Summary type', () => {
            beforeEach(() => {
                testNavigation('allt-tab-summaries', 'allt-tabcontent-summaries');
            })

            it('Should contain summary type specific fields', () => {
                [
                    'ei-btn-visitsummary', 'ei-btn-edit', 'ei-btn-delete',
                    'ei-tsummary-id'
                ].forEach(s => testTypeSpecificContent(s));
                cy.get('#mat-expansion-panel-header-29').click();
                ['ei-tsummary-bookid', 'ei-datedisplay', 'ei-tsummary-title', 'ei-tsummary-username', 'ei-tsummary-userid', 'ei-tsummary-content']
                    .forEach(s => testTypeSpecificContent(s));
            })

            it('Should navigate to summary-item containing summary', () => {
                cy.get('#mat-expansion-panel-header-29 > .mat-content > .row > .justify-content-end > [data-cy="ei-btn-visitsummary"] > .mat-icon')
                    .click()
                cy.url().should('eq', 'http://localhost:4200/summary-item')
            })

            it('Should edit summary', () => {
                cy.intercept({ method: "PUT", url: "**/api/summaries/**" }, { statusCode: 200, body: {} }).as("updateSummary")
                cy.get(`[data-cy="ei-tsummary-content"]`)
                    .as('summaryContent')
                    .should('contain.text', 'Lorem')
                cy.get('#mat-expansion-panel-header-29 > .mat-content > .row > .d-flex > [data-cy="ei-btn-edit"] > .mat-icon')
                    .click()
                cy.get(`[data-cy="itemd-edit-header"]`)
                    .as('itemDialog')
                    .should('exist')
                    .should('contain.text', 'Edit item')
                cy.get("textarea").eq(0).as("contentInput")
                    .should('exist')
                    .clear()
                    .type('TestContent')
                cy.get(`[data-cy="itemd-edit-save"]`)
                    .as('saveButton')
                    .should('exist')
                    .click({ force: true })
                cy.wait('@updateSummary');
                cy.wait(150);
                cy.closeSnackBar();
            })

            it('Should delete summary', () => {
                cy.intercept({ method: "DELETE", url: "**/api/summaries/**" }, { statusCode: 200, body: {} }).as("deleteSummary")
                cy.get('#mat-expansion-panel-header-29 > .mat-content > .row > .justify-content-end > [data-cy="ei-btn-delete"] > .mat-icon')
                    .should('exist')
                    .click({ force: true })
                cy.get(`[data-cy="itemd-delete-header"]`)
                    .should('exist')
                    .should('contain.text', 'Delete?')
                cy.get(`[data-cy="itemd-btn-delete"]`)
                    .should('exist')
                    .click({ force: true })
                cy.wait('@deleteSummary')
            })
        })

        describe('Comment type', () => {
            beforeEach(() => {
                testNavigation('allt-tab-comments', 'allt-tabcontent-comments');
            })

            it('Should contain comment type specific fields', () => {
                [
                    'ei-btn-edit', 'ei-btn-delete',
                    'ei-tcomment-head', 'ei-tcomment-id'
                ].forEach(s => testTypeSpecificContent(s));
                cy.get('#mat-expansion-panel-header-36').click();
                ['ei-datedisplay', 'ei-tcomment-content']
                    .forEach(s => testTypeSpecificContent(s));
            })

            it('Should edit comment', () => {
                cy.intercept({ method: "PUT", url: "**/api/comments/**" }, { statusCode: 200, body: {} }).as("updateComment")
                cy.get(`[data-cy="ei-tcomment-content"]`)
                    .as('commentContent')
                    .should('contain.text', 'Lorem')
                cy.get('#mat-expansion-panel-header-36 > .mat-content > .row > .d-flex > [data-cy="ei-btn-edit"] > .mat-icon')
                    .click()
                cy.get(`[data-cy="itemd-edit-header"]`)
                    .as('itemDialog')
                    .should('exist')
                    .should('contain.text', 'Edit item')
                cy.get("textarea").eq(0).as("contentInput")
                    .should('exist')
                    .clear()
                    .type('TestContent')
                cy.get(`[data-cy="itemd-edit-save"]`)
                    .as('saveButton')
                    .should('exist')
                    .click({ force: true })
                cy.wait('@updateComment');
                cy.wait(150);
                cy.closeSnackBar();
            })

            it('Should delete comment', () => {
                cy.intercept({ method: "DELETE", url: "**/api/comments/**" }, { statusCode: 200, body: {} }).as("deleteComment")
                cy.get('#mat-expansion-panel-header-36 > .mat-content > .row > .justify-content-end > [data-cy="ei-btn-delete"] > .mat-icon')
                    .should('exist')
                    .click({ force: true })
                cy.get(`[data-cy="itemd-delete-header"]`)
                    .should('exist')
                    .should('contain.text', 'Delete?')
                cy.get(`[data-cy="itemd-btn-delete"]`)
                    .should('exist')
                    .click({ force: true })
                cy.wait('@deleteComment')
            })
        })
    })
})

function testItemExists(selector, label) {
    cy.get(`[data-cy="${selector}"]`)
        .should('exist')
        .should('contain.text', label)
}

function testNavigation(selector, contentSelector) {
    cy.get(`[data-cy="${selector}"]`)
        .click()
    cy.get(`[data-cy="${contentSelector}"]`)
        .should('exist')
}

function testTypeSpecificContent(selector) {
    cy.get(`[data-cy="${selector}"]`)
        .should('exist')
        .should('be.visible')
}