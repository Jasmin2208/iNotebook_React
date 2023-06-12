const express = require("express")
const router = express.Router()
const { body, validationResult } = require('express-validator');
const authentication = require("../middleware/authentication")
const Notes = require("../models/Note");
const Note = require("../models/Note");

router.get("/getnotes", authentication, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.status(200).json({ status: "success", message: "Successfully get a note", notes })
    } catch (error) {
        res.json({ status: "Failed", data: error.message })
    }

})


router.post("/addnotes", authentication, [
    body('title', "title length is minimum 5 character").isLength({ min: 5 }),
    body('description', "description length is minimum 5 character").isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, tag } = req.body
    try {
        const addNote = await Notes.create({ title, description, tag, user: req.user.id })
        res.status(201).json({ status: "success", message: "Successfully create a note", addNote })
    } catch (error) {
        res.json({ status: "Failed", data: error.message })
    }

})


// update notes
router.put("/updatenotes/:id", authentication, async (req, res) => {
    const { title, description, tag } = req.body
    const newNote = {}
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    if (tag) { newNote.tag = tag }
    try {
        let note = await Note.findById(req.params.id)
        if (note) {
            if (note.user.toString() == req.user.id) {
                note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
                res.status(201).json({ status: "success", message: "Successfully update a note", note })
            } else {
                return res.status(401).json({ status: "Failed", message: "Not Allowed" })
            }
        } else {
            return res.status(404).json({ status: "Failed", message: "Note not found" })
        }
    } catch (error) {
        res.json({ status: "Failed", message: error.message })
    }
})


//delete notes
router.delete("/deletenotes/:id", authentication, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id)
        if (note) {
            if (note.user.toString() == req.user.id) {
                note = await Note.findByIdAndDelete(req.params.id)
                res.status(201).json({ status: "success", message: "Successfully delete a note" })
            } else {
                return res.status(401).json({ status: "Failed", message: "Not Allowed" })
            }
        } else {
            return res.status(404).json({ status: "Failed", message: "Note not found" })
        }
    } catch (error) {
        res.json({ status: "Failed", message: error.message })
    }
})
module.exports = router