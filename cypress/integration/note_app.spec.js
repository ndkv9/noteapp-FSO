describe('Note app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:8080/api/testing/reset')
		const user = {
			name: 'piccolo thefirst',
			username: 'namek1',
			password: 'password1',
		}
		cy.request('POST', 'http://localhost:8080/api/users', user)
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
		cy.get('#username').type('namek1')
		cy.get('#password').type('password1')
		cy.get('#login-btn').click()

		cy.contains('Create a new note')
	})

	describe('when logged in', function () {
		beforeEach(function () {
			cy.contains('login').click()
			cy.get('#username').type('namek1')
			cy.get('#password').type('password1')
			cy.get('#login-btn').click()
		})

		it('a new note can be created', function () {
			cy.get('#new-note').type('co that la the khong?')
			cy.get('#create-btn').click()

			cy.contains('co that la the khong?')
		})

		it('the important filed can change', function () {
			cy.get('#new-note').type('co that la the khong?')
			cy.get('#create-btn').click()
			cy.get('#important-btn').click()
		})
	})
})
