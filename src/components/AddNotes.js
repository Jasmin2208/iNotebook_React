import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/NoteContext'

function AddNotes(props) {
    const context = useContext(noteContext)
    const { addNote } = context
    const [note, setNote] = useState({ title: "", description: "", tag: "" })
    const handleClick = (e) => {
        e.preventDefault()
        addNote(note.title, note.description, note.tag)
        setNote({ title: "", description: "", tag: "" })
        props.showAlert("Note Add Successfully!!!", "success")
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <div>
            <div className="container my-3">
                <h1>Add Your Notes</h1>
                <form onSubmit={handleClick}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={onChange} value={note.title} minLength={5} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" name='description' id="description" onChange={onChange} value={note.description} minLength={5} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" name='tag' id="tag" onChange={onChange} value={note.tag} required />
                    </div>
                    <button type="submit" className="btn btn-primary" >Add Note</button>
                </form>
            </div>
        </div>
    )
}

export default AddNotes