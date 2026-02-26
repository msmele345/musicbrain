describe('Top Artists Widget', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8080/api/genres/top', { body: [] }).as('getGenres')
    cy.intercept('GET', 'http://localhost:8080/api/tracks/recent*', { body: [] }).as('getRecentTracks')
    cy.intercept('GET', 'http://localhost:8080/api/discovery/suggested', { body: [] }).as('getDiscovery')
    cy.intercept('GET', 'http://localhost:8080/api/artists/top*', {
      fixture: 'topArtists.json',
    }).as('getTopArtists')

    cy.visit('/')
  })

  it('shows the Top Artists widget title', () => {
    cy.contains('Top Artists').should('be.visible')
  })

  it('loads artist data from the API', () => {
    cy.wait('@getTopArtists')
    cy.get('.chart-container').should('have.length.at.least', 1)
  })

  it('does not show loading skeleton after data loads', () => {
    cy.wait('@getTopArtists')
    cy.get('[aria-label="Loading top artists..."]').should('not.exist')
  })

  it('shows period tabs', () => {
    cy.contains('Week').should('be.visible')
    cy.contains('Month').should('be.visible')
    cy.contains('All Time').should('be.visible')
  })

  it('calls API with correct period when a tab is clicked', () => {
    cy.intercept('GET', 'http://localhost:8080/api/artists/top?period=overall*', {
      fixture: 'topArtists.json',
    }).as('getTopArtistsOverall')

    cy.contains('All Time').click()
    cy.wait('@getTopArtistsOverall')
  })

  it('shows error state when API fails', () => {
    cy.intercept('GET', 'http://localhost:8080/api/artists/top*', {
      statusCode: 500,
      body: 'Internal Server Error',
    }).as('getTopArtistsFail')

    cy.visit('/')
    cy.wait('@getTopArtistsFail')
    cy.get('[role="alert"]').should('be.visible')
  })
})
