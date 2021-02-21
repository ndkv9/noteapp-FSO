import { useState, useEffect } from 'react'
import Note from './components/Note'
import Noti from './components/Noti'
import Footer from './components/Footer'
import noteService from './services/notes'
import loginService from './services/login'

const App = () => {
	const [notes, setNotes] = useState([])
	const [newNote, setNewNote] = useState('')
	const [showAll, setShowAll] = useState(true)
	const [btnText, setBtnText] = useState('show important')
	const [errorMessage, setErrorMessage] = useState(null)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)

	useEffect(() => {
		noteService.getAll().then(initialNotes => setNotes(initialNotes))
	}, [])

	const addNote = e => {
		e.preventDefault()
		const noteObj = {
			content: newNote,
			date: new Date().toISOString(),
			important: Math.random() < 0.5,
		}

		noteService.create(noteObj).then(returnedNote => {
			setNotes(notes.concat(returnedNote))
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

	const loginForm = () => (
		<form onSubmit={handleLogin}>
			<div>
				username
				<input
					type='text'
					value={username}
					name='Username'
					onChange={({ target }) => setUsername(target.value)}
				/>
			</div>
			<div>
				password
				<input
					type='password'
					value={password}
					name='Password'
					onChange={({ target }) => setPassword(target.value)}
				/>
			</div>
			<button type='submit'>login</button>
		</form>
	)

	const noteForm = () => (
		<form onSubmit={addNote}>
			<input value={newNote} onChange={handleNoteChange} />
			<button type='submit'>save</button>
		</form>
	)

	const handleLogin = async e => {
		e.preventDefault()
		try {
			const user = await loginService.login({ username, password })
			setUser(user)
			setUsername('')
			setPassword('')
		} catch (exception) {
			setErrorMessage('Wrong credentials')
			setTimeout(() => {
				setErrorMessage(null)
			}, 3000)
		}
	}

	const notesToShow = showAll ? notes : notes.filter(n => n.important)

	const toggleImportant = id => {
		const note = notes.find(n => n.id === id)
		const changedNote = { ...note, important: !note.important }

		noteService
			.update(id, changedNote)
			.then(returnedNote => {
				setNotes(notes.map(note => (note.id !== id ? note : returnedNote)))
			})
			.catch(error => {
				setErrorMessage(
					`Note '${note.content}' was already removed from server`
				)
				setTimeout(() => {
					setErrorMessage(null)
				}, 3000)
				setNotes(notes.filter(n => n.id !== id))
			})
	}

	return (
		<div id='app'>
			<h1>Notes</h1>
			<Noti message={errorMessage} />

			{user === null ? (
				loginForm()
			) : (
				<div>
					<p>{user.name} logged-in</p> {noteForm()}
				</div>
			)}

			<button onClick={handleImportance}>{btnText}</button>

			<ul>
				{notesToShow.map(note => (
					<Note
						key={note.id}
						note={note}
						toggleImportant={() => toggleImportant(note.id)}
					/>
				))}
			</ul>

			<Footer />
		</div>
	)
}

export default App
