import { useState, useEffect } from 'react'
import Note from './components/Note'
import Noti from './components/Noti'
import Footer from './components/Footer'
import noteService from './services/notes'
import loginService from './services/login'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'
import LoginForm from './components/LoginForm'

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

	// save user info to localStorage
	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			noteService.setToken(user.token)
		}
	}, [])

	const addNote = async e => {
		e.preventDefault()
		const noteObj = {
			content: newNote,
			date: new Date().toISOString(),
			important: Math.random() < 0.5,
			id: notes.length + 1,
		}

		const returnedNote = await noteService.create(noteObj)
		setNotes(notes.concat(returnedNote))
		setNewNote('')
	}

	const handleNoteChange = e => {
		setNewNote(e.target.value)
	}

	const handleImportance = () => {
		setShowAll(!showAll)
		showAll ? setBtnText('show all') : setBtnText('show important')
	}

	const handleLogin = async e => {
		e.preventDefault()
		try {
			const user = await loginService.login({ username, password })
			window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
			noteService.setToken(user.token)
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
				<Togglable buttonLabel='login'>
					<LoginForm
						username={username}
						password={password}
						handleUsernameChange={({ target }) => setUsername(target.value)}
						handlePasswordChange={({ target }) => setPassword(target.value)}
						handleSubmit={handleLogin}
					/>
				</Togglable>
			) : (
				<div>
					<p>{user.name} logged-in</p>{' '}
					<Togglable buttonLabel='new note'>
						<NoteForm
							onSubmit={addNote}
							value={newNote}
							handleChange={handleNoteChange}
						/>
					</Togglable>
				</div>
			)}

			<button onClick={handleImportance}>{btnText}</button>

			<ul>
				{notesToShow.map((note, i) => (
					<Note
						key={i}
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
