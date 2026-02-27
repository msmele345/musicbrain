describe('You Might Like Widget', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8080/api/genres/top', { body: [] }).as('getGenres')
    cy.intercept('GET', 'http://localhost:8080/api/artists/top*', { body: [] }).as('getTopArtists')
    cy.intercept('GET', 'http://localhost:8080/api/tracks/recent*', { body: [] }).as('getRecentTracks')
    cy.intercept('GET', 'http://localhost:8080/api/discovery/suggested', {
      fixture: 'suggestedArtists.json',
    }).as('getDiscovery')

    cy.visit('/')
  })

  it('shows the You Might Like widget title', () => {
    cy.contains('You Might Like').should('be.visible')
  })

  it('loads suggested artist cards from the API', () => {
    cy.wait('@getDiscovery')
    cy.get('.artist-card').should('have.length.at.least', 1)
  })

  it('shows artist names on the cards', () => {
    cy.wait('@getDiscovery')
    cy.contains('Massive Attack').should('be.visible')
    cy.contains('Tricky').should('be.visible')
  })

  it('shows match percentage on cards', () => {
    cy.wait('@getDiscovery')
    cy.get('.artist-match').first().should('contain.text', '87% match')
  })

  it('links artist cards to Last.fm URLs', () => {
    cy.wait('@getDiscovery')
    cy.get('.artist-card')
      .first()
      .should('have.attr', 'href', 'https://www.last.fm/music/Massive+Attack')
      .and('have.attr', 'target', '_blank')
  })

  it('does not show loading skeleton after data loads', () => {
    cy.wait('@getDiscovery')
    cy.get('[aria-label="Loading suggested artists..."]').should('not.exist')
  })

  it('shows error state when API fails', () => {
    cy.intercept('GET', 'http://localhost:8080/api/discovery/suggested', {
      statusCode: 500,
      body: 'Internal Server Error',
    }).as('getDiscoveryFail')

    cy.visit('/')
    cy.wait('@getDiscoveryFail')
    cy.get('[role="alert"]').should('be.visible')
  })
})
