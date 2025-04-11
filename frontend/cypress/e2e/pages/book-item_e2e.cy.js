/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

beforeEach(() => {
    cy.intercept({ method: "PUT", url: '**/api/reviews/**/like' }, { statusCode: 200, body: {} }).as("likeReview")
    cy.intercept({ method: "PUT", url: '**/api/comments/**/like' }, { statusCode: 200, body: {} }).as("likeComment")
    cy.setLangToEn();
    cy.visit("http://localhost:4200/books")
    cy.get('[data-cy="bd-content-bookcard"]')
        .eq(0)
        .click()
})

describe('Testing the books page', () => {
    it('Should display bookcard with values', () => {
        cy.get('[data-cy="booki-card-img"]')
            .should('exist')
            .should('have.attr', 'src')
        cy.get('[data-cy="booki-card-title"]')
            .should('exist')
            .should('contain.text', 'Lorem')
        cy.get('[data-cy="booki-card-author"]')
            .should('exist')
            .should('contain.text', 'Author: Lorem')
        cy.get('[data-cy="booki-card-release"]')
            .should('exist')
            .should('contain.text', 'Release date: 2016')
        cy.get('[data-cy="booki-card-genre"]')
            .should('exist')
            .should('contain.text', 'Genre: Crime')
    })

    it('Should have back button that navigates to books', () => {
        cy.get('[data-cy="booki-btn-back"]')
            .should('exist')
            .should('contain.text', 'Back')
            .click();
        cy.url().should('eq', 'http://localhost:4200/books')
    })

    it('Should have description card with values', () => {
        cy.get('[data-cy="booki-desc-card"]')
            .should('exist')
        cy.get('[data-cy="booki-desc-title"]')
            .should('exist')
            .should('contain.text', 'Lorem')
        cy.get('[data-cy="booki-desc-author"]')
            .should('exist')
            .should('contain.text', 'Lorem')
        cy.get('[data-cy="booki-desc-release"]')
            .should('exist')
            .should('contain.text', '2016')
        cy.get('[data-cy="booki-desc-desc"]')
            .should('exist')
            .its('text')
            .should('have.length.gt', 0)
    })

});

describe('Testing book-item custom-paginator and review-display', () => {
    it('Should contain custom-paginator and review-display components', () => {
        cy.get('[data-cy="booki-desc-paginator"]')
            .should('exist')
        cy.get('[data-cy="booki-desc-rd"]')
            .should('exist')
    });

    it('Should sort with the sorting menu', () => {
        cy.get('[data-cy="paginator-btn-sort"]')
            .should('exist')
            .click()
        cy.get('[data-cy="sortmenu-select"]')
            .should('exist')
            .click()
        cy.get('[data-cy="sortmenu-option"]').contains('Score')
            .should('exist')
            .click()
        cy.get('[data-cy="sortmenu-desc"]')
            .should('exist')
            .click()
        cy.get('[data-cy="booki-desc-rd"]')
            .eq(0)
            .find('[data-cy="reviewd-icon-score"]')
            .should('have.length', 5)
            .eq(0)
            .should('contain', 'star')
    })

    it('Should navigate to reviewer profile on profile picture or username click', () => {
        cy.loginAdmin();
        cy.visit("http://localhost:4200/books")
        cy.get('[data-cy="bd-content-bookcard"]')
            .eq(0)
            .click()
        cy.get('[data-cy="reviewd-img-user"]')
            .should('exist')
            .eq(0)
            .click()
        cy.url().should('eq', 'http://localhost:4200/profile')

        cy.visit("http://localhost:4200/books")
        cy.get('[data-cy="bd-content-bookcard"]')
            .eq(0)
            .click()
        cy.get('[data-cy="reviewd-text-username"]')
            .should('exist')
            .eq(0)
            .click()
        cy.url().should('eq', 'http://localhost:4200/profile')
    })

    it('Should let user like and dislike review', () => {
        cy.loginAdmin();
        cy.visit("http://localhost:4200/books")
        cy.get('[data-cy="bd-content-bookcard"]')
            .eq(0)
            .click()
        cy.get('[data-cy="reviewd-text-likecount"]')
            .should('exist')
            .eq(0).as('likecount')
            .should('contain.text', 0)
        cy.get('[data-cy="reviewd-btn-like"]')
            .should('exist')
            .eq(0)
            .click({ force: true })
        cy.wait('@likeReview');
        cy.get('@likecount')
            .should('contain.text', 1)
        cy.get('[data-cy="reviewd-text-dislikecount"]')
            .should('exist')
            .eq(0).as('dislikecount')
            .should('contain.text', 0)
        cy.get('[data-cy="reviewd-btn-dislike"]')
            .should('exist')
            .eq(0)
            .click({ force: true })
        cy.wait('@likeReview');
        cy.get('@dislikecount')
            .should('contain.text', 1)
    })

    it('Should remove like if clicked a second time', () => {
        cy.loginAdmin();
        cy.visit("http://localhost:4200/books")
        cy.get('[data-cy="bd-content-bookcard"]')
            .eq(0)
            .click()
        cy.get('[data-cy="reviewd-text-likecount"]')
            .should('exist')
            .eq(0).as('likecount')
            .should('contain.text', 0)
        cy.get('[data-cy="reviewd-btn-like"]')
            .should('exist')
            .eq(0).as('likeBtn')
            .click({ force: true })
        cy.wait('@likeReview');
        cy.get('@likecount')
            .should('contain.text', 1)
        cy.get('@likeBtn')
            .click({ force: true })
        cy.wait('@likeReview');
        cy.get('@likecount')
            .should('contain.text', 0)
    })

    it('Should open dialog if review has likes', () => {
        cy.loginAdmin();
        cy.visit("http://localhost:4200/books")
        cy.get('[data-cy="bd-content-bookcard"]')
            .eq(0)
            .click()
        cy.get('[data-cy="reviewd-btn-like"]')
            .should('exist')
            .eq(0).as('likeBtn')
            .click({ force: true })
        cy.wait('@likeReview');
        cy.get('[data-cy="reviewd-dialog-open"]')
            .should('exist')
            .click({ force: true })
        cy.wait(50);
        cy.get('[data-cy="reviewd-dialog"]')
            .should('exist')
            .eq(0)
            .should('be.visible')
    })

});

describe('Testing review-display comments', () => {
    it('Should show/hide comments on review', () => {
        cy.get('[data-cy="reviewd-btn-showhide"]')
            .should('exist')
            .eq(0).as('show/hide')
            .click({ force: true })
        cy.get('[data-cy="reviewd-comment"]').as('comments')
            .should('have.length', 2)
        cy.get('@show/hide').click({ force: true })
        cy.wait(100)
        cy.get('@comments')
            .should('not.exist')
    })

    it('Should let user like/dislike comment', () => {
        cy.loginAdmin();
        cy.visit("http://localhost:4200/books")
        cy.get('[data-cy="bd-content-bookcard"]')
            .eq(0)
            .click()
        cy.get('[data-cy="reviewd-btn-showhide"]')
            .should('exist')
            .eq(0)
            .click({ force: true })
        cy.wait(50);
        cy.get('[data-cy="reviewd-comment-likecount"]')
            .should('exist')
            .eq(0).as('likecount')
            .should('contain.text', 0)
        cy.get('[data-cy="reviewd-comment-like"]')
            .should('exist')
            .eq(0)
            .click({ force: true })
        cy.wait('@likeComment');
        cy.get('@likecount')
            .should('contain.text', 1)
        cy.wait(100);
        cy.get('[data-cy="reviewd-comment-dislikecount"]')
            .should('exist')
            .eq(0).as('dislikecount')
            .should('contain.text', 0)
        cy.get('[data-cy="reviewd-comment-dislike"]')
            .should('exist')
            .eq(0)
            .click({ force: true })
        cy.wait('@likeComment');
        cy.get('@dislikecount')
            .should('contain.text', 1)
    })
})