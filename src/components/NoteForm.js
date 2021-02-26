import { useState } from 'react'

const NoteForm = ({ createNote }) => {
	const [newNote, setNewNote] = useState('')

	const handleNoteChange = e => {
		setNewNote(e.target.value)
	}

	const addNote = async e => {
		e.preventDefault()
		const noteObj = {
			content: newNote,
			important: false,
		}

		createNote(noteObj)
		setNewNote('')
	}

	return (
		<div className='formDiv'>
			<h2>Create a new note</h2>

			<form onSubmit={addNote}>
				<input id='new-note' value={newNote} onChange={handleNoteChange} />
				<button id='create-btn' type='submit'>
					save
				</button>
			</form>
		</div>
	)
}

export default NoteForm
