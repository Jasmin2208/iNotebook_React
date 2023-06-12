import NoteContext from './NoteContext';
import { useState } from 'react';


const NoteState = (props) => {
    const notesInitial = [];

    const host = "http://localhost:5000"

    const [notes, setNotes] = useState(notesInitial)


    const getNote = async () => {
        const response = await fetch(`${host}/inotebook/notes/getnotes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            }
        })
        const json = await response.json()
        setNotes(json.notes)

    }


    const addNote = async (title, description, tag) => {
        const response = await fetch(`${host}/inotebook/notes/addnotes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            },
            body: JSON.stringify({ title, description, tag })
        })
        const json = await response.json()
        setNotes(notes.concat(json.addNote))
    }

    const editNote = async (id, title, description, tag) => {
        const response = await fetch(`${host}/inotebook/notes/updatenotes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            },
            body: JSON.stringify({ title, description, tag })
        })
        const json = await response.json()
        console.log(json)



        const newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title
                newNotes[index].description = description
                newNotes[index].tag = tag
                break;
            }
        }
        setNotes(newNotes)
    }

    const deleteNote = async (id) => {
        await fetch(`${host}/inotebook/notes/deletenotes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            },
        })
        const newNote = notes.filter((note) => { return note._id !== id })
        setNotes(newNote)

    }
    return (
        <NoteContext.Provider value={{ notes, setNotes, addNote, editNote, deleteNote, getNote }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
