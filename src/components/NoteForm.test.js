import NoteForm from './NoteForm'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('<NoteForm />', () => {
	test('updates parent state and calls onSubmit', () => {
		const createNote = jest.fn()

		const component = render(<NoteForm createNote={createNote} />)
		const input = component.container.querySelector('input')
		const button = component.getByText('save')

		fireEvent.change(input, {
			target: {
				value: 'testing of forms could be easier',
			},
		})

		fireEvent.click(button)

		expect(createNote.mock.calls).toHaveLength(1)
		expect(createNote.mock.calls[0][0].content).toBe(
			'testing of forms could be easier'
		)
	})
})
