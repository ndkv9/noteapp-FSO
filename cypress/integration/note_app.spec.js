describe('Note app', function () {
	beforeEach(function () {
		cy.visit('http://localhost:3000')
	})

	it('front page can be opened', function () {
		cy.contains('Notes')
		cy.contains('Note App, by Erik Vu Nguyen')
	})

	it('login form can be opened', function () {
		cy.contains('login').click()
	})

	it('user can login', function () {
		cy.contains('login').click()
		cy.get('#username').type('saiyan1')
		cy.get('#password').type('password1')
		cy.get('#login-btn').click()

		cy.contains('Create a new note')
	})
})
