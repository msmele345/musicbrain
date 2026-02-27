describe('Recent Tracks Widget', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8080/api/genres/top', { body: [] }).as('getGenres')
    cy.intercept('GET', 'http://localhost:8080/api/artists/top*', { body: [] }).as('getTopArtists')
    cy.intercept('GET', 'http://localhost:8080/api/discovery/suggested', { body: [] }).as('getDiscovery')
    cy.intercept('GET', 'http://localhost:8080/api/tracks/recent*', {
      fixture: 'recentTracks.json',
    }).as('getRecentTracks')

    cy.visit('/')
  })

  it('shows the Recent Tracks widget title', () => {
    cy.contains('Recent Tracks').should('be.visible')
  })

  it('loads track data from the API', () => {
    cy.wait('@getRecentTracks')
    cy.get('.track-list').should('be.visible')
  })

  it('shows NOW PLAYING badge for the currently playing track', () => {
    cy.wait('@getRecentTracks')
    cy.get('.now-playing-badge').should('be.visible')
    cy.get('.now-playing-badge').should('contain.text', 'NOW PLAYING')
  })

  it('highlights the now-playing track item', () => {
    cy.wait('@getRecentTracks')
    cy.get('.track-item.now-playing').should('exist')
  })

  it('shows track names', () => {
    cy.wait('@getRecentTracks')
    cy.contains('Fake Plastic Trees').should('be.visible')
    cy.contains('Glory Box').should('be.visible')
  })

  it('does not show loading skeleton after data loads', () => {
    cy.wait('@getRecentTracks')
    cy.get('[aria-label="Loading recent tracks..."]').should('not.exist')
  })

  it('shows error state when API fails', () => {
    cy.intercept('GET', 'http://localhost:8080/api/tracks/recent*', {
      statusCode: 500,
      body: 'Internal Server Error',
    }).as('getRecentTracksFail')

    cy.visit('/')
    cy.wait('@getRecentTracksFail')
    cy.get('[role="alert"]').should('be.visible')
  })
})
