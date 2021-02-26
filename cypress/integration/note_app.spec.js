describe('Note app', function () {
	it('front page can be opened', function () {
		cy.visit('http://localhost:3000')
		cy.contains('Notes')
		cy.contains('Note App, by Erik Vu Nguyen')
	})

	it('login form can be opened', function () {
		cy.visit('http://localhost:3000')
		cy.contains('login').click()
	})
})
