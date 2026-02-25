describe('Genre Breakdown Widget', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8080/api/genres/top', {
      fixture: 'topGenres.json',
    }).as('getTopGenres')

    cy.visit('/')
  })

  it('shows the Genre Breakdown widget title', () => {
    cy.contains('Genre Breakdown').should('be.visible')
  })

  it('loads genre data from the API', () => {
    cy.wait('@getTopGenres')
    cy.get('.chart-container').should('be.visible')
  })

  it('does not show loading skeleton after data loads', () => {
    cy.wait('@getTopGenres')
    cy.get('.skeleton').should('not.exist')
  })

  it('does not show error state on successful fetch', () => {
    cy.wait('@getTopGenres')
    cy.get('[role="alert"]').should('not.exist')
  })

  it('shows error state when API fails', () => {
    cy.intercept('GET', 'http://localhost:8080/api/genres/top', {
      statusCode: 500,
      body: 'Internal Server Error',
    }).as('getTopGenresFail')

    cy.visit('/')
    cy.wait('@getTopGenresFail')
    cy.get('[role="alert"]').should('be.visible')
  })
})
