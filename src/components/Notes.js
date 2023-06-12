import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/NoteContext'
import NoteItem from './NoteItem'
import AddNotes from './AddNotes'
import { useNavigate } from 'react-router-dom'


function Notes(props) {
    const { showAlert } = props
    let navigate = useNavigate();
    const context = useContext(noteContext)
    const { notes, getNote, editNote } = context
    const ref = useRef(null)
    const refClose = useRef(null)
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })
    const updateNote = (currentNote) => {
        ref.current.click()
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })

    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getNote()
        } else {
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [])


    const handleClick = (e) => {
        console.log("click")
        e.preventDefault()
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click()
        props.showAlert("Note update Successfully!!!", "success")
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <>
            <AddNotes showAlert={showAlert} />
            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleClick}>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name='etitle' aria-describedby="emailHelp" value={note.etitle} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" name='edescription' id="edescription" value={note.edescription} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" name='etag' id="etag" value={note.etag} onChange={onChange} required />
                                </div>
                                <div className="mb-3">
                                    <button type="button" className="btn btn-secondary" ref={refClose} data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary mx-2" >Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <h1> Your Notes</h1>
                <div className="container">
                    {notes.length === 0 && "No Notes Available"}
                </div>
                {
                    Array.isArray(notes) && notes.map((note) => {
                        return <NoteItem key={note._id} updateNote={updateNote} note={note} showAlert={showAlert} />
                    })
                }
            </div>
        </>
    )
}

export default Notes