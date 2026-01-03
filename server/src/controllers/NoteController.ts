import { Request, Response } from "express";
import { NoteService } from "../services/NoteService";

const noteService = new NoteService();

export const createNote = async (req: Request, res: Response) => {
    try {
        const note = await noteService.createNote(req.user!.userId, req.body);
        res.status(201).json({ success: true, data: note });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getNotes = async (req: Request, res: Response) => {
    try {
        const { workspaceId } = req.params; // Get ID from URL
        const notes = await noteService.getNotesByWorkspace(req.user!.userId, workspaceId);
        res.status(200).json({ success: true, data: notes });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};