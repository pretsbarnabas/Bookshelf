/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

beforeEach(() => {
    cy.setLangToEn();
})

describe('Testing the Profile page (admin level user, non-observed)', () => {
    beforeEach(() => {
        cy.loginAdmin();
        cy.get('simple-snack-bar button')
            .contains('Close')
            .click();
        cy.wait(150);
        cy.get('[data-cy="navbar-menu-profile"]')
            .click()
        cy.get('[data-cy="navbar-routeBtn-profile"]')
            .eq(1)
            .click()
    })

    it('Should display user data', () => {
        cy.get(`[data-cy="profile-card-img"]`)
            .should('exist')
            .should('have.attr', 'src')
            .and('have.length.gt', 0);
        [
            ['username', 'admin'],
            ['email', 'admin@email.com'],
            ['role', 'Role: Admin'],
            ['created-label', 'Created on:'],
            ['created', 'April 8, 2016'],
            ['updated-label', 'Updated on:'],
            ['updated', 'April 8, 2016']
        ].forEach(a => testProfileCardItem(a[0], a[1]))
    });

    it('Should have items related to logged in user and their permissions', () => {
        cy.get(`[data-cy="profile-card-options"]`)
            .should('exist')
            .should('contain.text', 'Options')
            .click();
        cy.get(`[data-cy="profile-card-options-btn"]`)
            .should('exist')
            .should('contain.text', 'Edit')
            .click();
        cy.get(`[data-cy="itemd-edit-header"]`)
            .as('itemDialog')
            .should('exist')
            .should('contain.text', 'Edit profile')
        cy.get(`[data-cy="itemd-edit-content"]`)
            .should('exist')
        cy.get(`[data-cy="itemd-edit-save"]`)
            .should('exist')
            .should('contain.text', 'Save changes')
        cy.get(`[data-cy="itemd-edit-cancel"]`)
            .should('exist')
            .should('contain.text', 'Cancel')
            .click()
        cy.get('@itemDialog')
            .should('not.exist')
    });

    it('Should have custom paginator and all-type display elements', () => {
        cy.get(`[data-cy="allt-card"]`)
            .should('exist');
        cy.get('#custom-paginator')
            .should('exist')
    });

    it('Should have all-type-display with editor role tabs', () => {
        [
            ['allt-tab-books', 'Books'],
            ['allt-tab-summaries', 'Summaries'],
            ['allt-tab-comments', 'Comments'],
            ['allt-tab-reviews', 'Reviews']
        ].forEach(s => testItemExists(s[0], s[1]))
    });

    it('Should navigate between tabs', () => {
        [
            ['allt-tab-books', 'allt-tabcontent-books'],
            ['allt-tab-summaries', 'allt-tabcontent-summaries'],
            ['allt-tab-comments', 'allt-tabcontent-comments'],
            ['allt-tab-reviews', 'allt-tabcontent-reviews']
        ].forEach(s => testNavigation(s[0], s[1]))
    });
})

describe('Testing the profile page (editor level user, observed)', () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/books")
        cy.get('[data-cy="bd-content-bookcard"]')
            .eq(0)
            .click()
        cy.get('[data-cy="reviewd-img-user"]')
            .eq(0)
            .click()
    })

    it('Should display user data', () => {
        cy.get(`[data-cy="profile-card-img"]`)
            .should('exist')
            .should('have.attr', 'src')
            .and('have.length.gt', 0);
        [
            ['username', 'editor'],
            ['role', 'Role: Editor'],
            ['created-label', 'Created on:'],
            ['created', 'April 8, 2016'],
            ['updated-label', 'Updated on:'],
            ['updated', 'April 8, 2016']
        ].forEach(a => testProfileCardItem(a[0], a[1]))
    });

    it('Should not have items related to logged in user', () => {
        cy.get(`[data-cy="profile-card-options"]`)
            .should('not.exist')
        cy.get(`[data-cy="profile-card-options-btn"]`)
            .should('not.exist')
        cy.get(`[data-cy="itemd-edit-header"]`)
            .should('not.exist')
    });

    it('Should navigate to content from tab', () => {
        cy.get(`[data-cy="allt-tab-summaries"]`)
            .should('exist')
            .click()
        cy.get(`[data-cy="ei-btn-visitsummary"]`)
            .should('exist')
            .eq(0)
            .click()
        cy.url().should('eq', 'http://localhost:4200/summary-item')
    })
})

function testProfileCardItem(element, conatinedText) {
    cy.get(`[data-cy="profile-card-${element}"]`)
        .should('exist')
        .should('contain.text', conatinedText)
}

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