import { useState, useEffect } from 'react'
import Note from './components/Note'
import axios from 'axios'

const App = () => {
	const [notes, setNotes] = useState([])
	const [newNote, setNewNote] = useState('')
	const [showAll, setShowAll] = useState(true)
	const [btnText, setBtnText] = useState('show important')

	useEffect(() => {
		axios.get('http://localhost:5000/notes').then(res => setNotes(res.data))
	}, [])

	const addNote = e => {
		e.preventDefault()
		const noteObj = {
			content: newNote,
			date: new Date().toISOString(),
			important: Math.random() < 0.5,
		}

		axios.post('http://localhost:5000/notes', noteObj).then(res => {
			setNotes(notes.concat(res.data))
			setNewNote('')
		})
	}

	const handleNoteChange = e => {
		setNewNote(e.target.value)
	}

	const handleImportance = () => {
		setShowAll(!showAll)
		showAll ? setBtnText('show all') : setBtnText('show important')
	}

	const notesToShow = showAll ? notes : notes.filter(n => n.important)

	return (
		<div>
			<h1>Notes</h1>
			<ul>
				{notesToShow.map(note => (
					<Note key={note.id} content={note.content} />
				))}
			</ul>
			<button onClick={handleImportance}>{btnText}</button>
			<form onSubmit={addNote}>
				<input value={newNote} onChange={handleNoteChange} />
				<button type='submit'>save</button>
			</form>
		</div>
	)
}

export default App
